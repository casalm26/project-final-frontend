import { Tree, Forest, TreeImage, AuditLog } from '../models/index.js';
import mongoose from 'mongoose';

// Bulk create trees
export const bulkCreateTrees = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { trees, forestId, skipValidation = false } = req.body;

    if (!trees || !Array.isArray(trees) || trees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Trees array is required and cannot be empty'
      });
    }

    if (trees.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 1000 trees can be created in one bulk operation'
      });
    }

    // Validate forest exists if forestId provided
    if (forestId) {
      const forest = await Forest.findById(forestId).session(session);
      if (!forest) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Forest not found'
        });
      }
    }

    const validationErrors = [];
    const processedTrees = [];

    // Process and validate each tree
    for (let i = 0; i < trees.length; i++) {
      const treeData = { ...trees[i] };
      
      // Use provided forestId if not specified in tree data
      if (forestId && !treeData.forestId) {
        treeData.forestId = forestId;
      }

      // Add default values
      if (!treeData.plantedDate) {
        treeData.plantedDate = new Date();
      }
      
      if (!treeData.isAlive) {
        treeData.isAlive = true;
      }

      // Basic validation if not skipped
      if (!skipValidation) {
        if (!treeData.species) {
          validationErrors.push({
            index: i,
            field: 'species',
            message: 'Species is required'
          });
          continue;
        }

        if (!treeData.forestId) {
          validationErrors.push({
            index: i,
            field: 'forestId',
            message: 'Forest ID is required'
          });
          continue;
        }

        if (!treeData.location || !treeData.location.coordinates) {
          validationErrors.push({
            index: i,
            field: 'location',
            message: 'Location coordinates are required'
          });
          continue;
        }
      }

      processedTrees.push(treeData);
    }

    if (validationErrors.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Validation errors found',
        errors: validationErrors,
        validCount: processedTrees.length,
        errorCount: validationErrors.length
      });
    }

    // Insert trees in bulk
    const createdTrees = await Tree.insertMany(processedTrees, { session });

    // Log audit trail
    await AuditLog.create([{
      userId: req.user._id,
      action: 'bulk_create',
      resource: 'trees',
      resourceId: null,
      changes: {
        operation: 'bulk_create_trees',
        count: createdTrees.length,
        forestId: forestId || 'multiple'
      }
    }], { session });

    await session.commitTransaction();

    // Emit real-time events for created trees
    if (global.realtimeController) {
      createdTrees.forEach(tree => {
        global.realtimeController.broadcastTreeUpdate(
          tree._id.toString(),
          tree.toObject(),
          'tree:created'
        );
      });

      // Emit bulk operation notification
      global.realtimeController.broadcastSystemNotification({
        type: 'info',
        message: `${createdTrees.length} trees created in bulk operation`,
        level: 'info',
        details: {
          count: createdTrees.length,
          forestId: forestId || 'multiple',
          createdBy: req.user.email
        }
      }, 'admin');
    }

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdTrees.length} trees`,
      data: {
        createdTrees: createdTrees.map(tree => tree.toObject()),
        summary: {
          totalCreated: createdTrees.length,
          forestId: forestId || 'multiple',
          createdAt: new Date()
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Bulk create trees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trees in bulk',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Bulk update trees
export const bulkUpdateTrees = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { treeIds, updates, filter } = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates object is required'
      });
    }

    let query = {};

    // Use either treeIds array or filter criteria
    if (treeIds && Array.isArray(treeIds) && treeIds.length > 0) {
      if (treeIds.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 1000 trees can be updated in one bulk operation'
        });
      }
      query._id = { $in: treeIds };
    } else if (filter) {
      // Build query from filter object
      if (filter.forestId) query.forestId = filter.forestId;
      if (filter.species) query.species = new RegExp(filter.species, 'i');
      if (filter.isAlive !== undefined) query.isAlive = filter.isAlive;
      if (filter.plantedBefore) query.plantedDate = { $lt: new Date(filter.plantedBefore) };
      if (filter.plantedAfter) {
        query.plantedDate = { 
          ...query.plantedDate, 
          $gt: new Date(filter.plantedAfter) 
        };
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either treeIds array or filter criteria is required'
      });
    }

    // Find trees to update (for audit trail)
    const treesToUpdate = await Tree.find(query).session(session);
    
    if (treesToUpdate.length === 0) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'No trees found matching the criteria'
      });
    }

    if (treesToUpdate.length > 1000) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Too many trees found (${treesToUpdate.length}). Maximum 1000 trees can be updated in one operation`
      });
    }

    // Prepare update object
    const updateObj = { ...updates };
    updateObj.updatedAt = new Date();

    // Handle measurements array updates
    if (updates.addMeasurement) {
      const measurement = {
        ...updates.addMeasurement,
        measuredAt: updates.addMeasurement.measuredAt || new Date()
      };
      updateObj.$push = { measurements: measurement };
      delete updateObj.addMeasurement;
    }

    // Perform bulk update
    const updateResult = await Tree.updateMany(query, updateObj, { session });

    // Log audit trail
    await AuditLog.create([{
      userId: req.user._id,
      action: 'bulk_update',
      resource: 'trees',
      resourceId: null,
      changes: {
        operation: 'bulk_update_trees',
        affectedCount: updateResult.modifiedCount,
        updates: updates,
        filter: treeIds ? { treeIds: treeIds.length } : filter
      }
    }], { session });

    await session.commitTransaction();

    // Emit real-time events for updated trees
    if (global.realtimeController) {
      treesToUpdate.forEach(tree => {
        global.realtimeController.broadcastTreeUpdate(
          tree._id.toString(),
          { ...tree.toObject(), ...updates },
          'tree:updated'
        );
      });

      // Emit bulk operation notification
      global.realtimeController.broadcastSystemNotification({
        type: 'info',
        message: `${updateResult.modifiedCount} trees updated in bulk operation`,
        level: 'info',
        details: {
          modifiedCount: updateResult.modifiedCount,
          matchedCount: updateResult.matchedCount,
          updatedBy: req.user.email
        }
      }, 'admin');
    }

    res.json({
      success: true,
      message: `Successfully updated ${updateResult.modifiedCount} trees`,
      data: {
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount,
        summary: {
          operation: 'bulk_update',
          affectedTrees: treesToUpdate.map(tree => tree._id),
          updates: updates,
          updatedAt: new Date()
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Bulk update trees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trees in bulk',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Bulk delete trees (soft delete)
export const bulkDeleteTrees = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { treeIds, filter, hardDelete = false } = req.body;

    let query = {};

    // Use either treeIds array or filter criteria
    if (treeIds && Array.isArray(treeIds) && treeIds.length > 0) {
      if (treeIds.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 1000 trees can be deleted in one bulk operation'
        });
      }
      query._id = { $in: treeIds };
    } else if (filter) {
      // Build query from filter object
      if (filter.forestId) query.forestId = filter.forestId;
      if (filter.species) query.species = new RegExp(filter.species, 'i');
      if (filter.isAlive !== undefined) query.isAlive = filter.isAlive;
      if (filter.plantedBefore) query.plantedDate = { $lt: new Date(filter.plantedBefore) };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either treeIds array or filter criteria is required'
      });
    }

    // Find trees to delete (for audit trail)
    const treesToDelete = await Tree.find(query).session(session);
    
    if (treesToDelete.length === 0) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'No trees found matching the criteria'
      });
    }

    if (treesToDelete.length > 1000) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Too many trees found (${treesToDelete.length}). Maximum 1000 trees can be deleted in one operation`
      });
    }

    let deleteResult;

    if (hardDelete && req.user.role === 'admin') {
      // Hard delete (admin only)
      deleteResult = await Tree.deleteMany(query, { session });
      
      // Also delete associated images
      const treeIdsToDelete = treesToDelete.map(tree => tree._id);
      await TreeImage.updateMany(
        { treeId: { $in: treeIdsToDelete } },
        { isActive: false },
        { session }
      );
    } else {
      // Soft delete - mark as inactive
      deleteResult = await Tree.updateMany(
        query, 
        { 
          isActive: false, 
          isAlive: false,
          deletedAt: new Date(),
          deletedBy: req.user._id
        }, 
        { session }
      );
    }

    // Log audit trail
    await AuditLog.create([{
      userId: req.user._id,
      action: hardDelete ? 'bulk_hard_delete' : 'bulk_soft_delete',
      resource: 'trees',
      resourceId: null,
      changes: {
        operation: hardDelete ? 'bulk_hard_delete_trees' : 'bulk_soft_delete_trees',
        affectedCount: deleteResult.deletedCount || deleteResult.modifiedCount,
        treeIds: treesToDelete.map(tree => tree._id),
        filter: treeIds ? { treeIds: treeIds.length } : filter
      }
    }], { session });

    await session.commitTransaction();

    // Emit real-time events for deleted trees
    if (global.realtimeController) {
      treesToDelete.forEach(tree => {
        global.realtimeController.broadcastTreeUpdate(
          tree._id.toString(),
          { isActive: false, deletedAt: new Date() },
          'tree:deleted'
        );
      });

      // Emit bulk operation notification
      global.realtimeController.broadcastSystemNotification({
        type: 'warning',
        message: `${deleteResult.deletedCount || deleteResult.modifiedCount} trees ${hardDelete ? 'permanently deleted' : 'marked as inactive'} in bulk operation`,
        level: 'warning',
        details: {
          deletedCount: deleteResult.deletedCount || deleteResult.modifiedCount,
          hardDelete,
          deletedBy: req.user.email
        }
      }, 'admin');
    }

    res.json({
      success: true,
      message: `Successfully ${hardDelete ? 'deleted' : 'deactivated'} ${deleteResult.deletedCount || deleteResult.modifiedCount} trees`,
      data: {
        deletedCount: deleteResult.deletedCount || deleteResult.modifiedCount,
        hardDelete,
        summary: {
          operation: hardDelete ? 'bulk_hard_delete' : 'bulk_soft_delete',
          affectedTrees: treesToDelete.map(tree => tree._id),
          deletedAt: new Date()
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Bulk delete trees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trees in bulk',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Bulk add measurements to trees
export const bulkAddMeasurements = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { measurements } = req.body;

    if (!measurements || !Array.isArray(measurements) || measurements.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Measurements array is required and cannot be empty'
      });
    }

    if (measurements.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 1000 measurements can be added in one bulk operation'
      });
    }

    const validationErrors = [];
    const processedMeasurements = new Map(); // Group by treeId

    // Process and validate measurements
    for (let i = 0; i < measurements.length; i++) {
      const measurement = measurements[i];

      if (!measurement.treeId) {
        validationErrors.push({
          index: i,
          field: 'treeId',
          message: 'Tree ID is required'
        });
        continue;
      }

      if (!measurement.height && !measurement.diameter && !measurement.co2Absorption && !measurement.healthStatus) {
        validationErrors.push({
          index: i,
          field: 'measurement_data',
          message: 'At least one measurement value is required'
        });
        continue;
      }

      const measurementData = {
        height: measurement.height,
        diameter: measurement.diameter,
        healthStatus: measurement.healthStatus || 'healthy',
        co2Absorption: measurement.co2Absorption,
        measuredAt: measurement.measuredAt || new Date(),
        notes: measurement.notes || ''
      };

      if (!processedMeasurements.has(measurement.treeId)) {
        processedMeasurements.set(measurement.treeId, []);
      }
      processedMeasurements.get(measurement.treeId).push(measurementData);
    }

    if (validationErrors.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Validation errors found',
        errors: validationErrors
      });
    }

    // Verify all trees exist
    const treeIds = Array.from(processedMeasurements.keys());
    const existingTrees = await Tree.find({ 
      _id: { $in: treeIds },
      isActive: true 
    }).session(session);

    if (existingTrees.length !== treeIds.length) {
      await session.abortTransaction();
      const foundIds = existingTrees.map(tree => tree._id.toString());
      const missingIds = treeIds.filter(id => !foundIds.includes(id));
      
      return res.status(404).json({
        success: false,
        message: 'Some trees not found or inactive',
        missingTreeIds: missingIds
      });
    }

    // Apply measurements to trees
    const updateResults = [];
    for (const [treeId, treeMeasurements] of processedMeasurements) {
      const result = await Tree.updateOne(
        { _id: treeId },
        { 
          $push: { measurements: { $each: treeMeasurements } },
          $set: { updatedAt: new Date() }
        },
        { session }
      );
      updateResults.push({ treeId, modifiedCount: result.modifiedCount });
    }

    // Log audit trail
    await AuditLog.create([{
      userId: req.user._id,
      action: 'bulk_add_measurements',
      resource: 'trees',
      resourceId: null,
      changes: {
        operation: 'bulk_add_measurements',
        measurementCount: measurements.length,
        affectedTrees: treeIds.length
      }
    }], { session });

    await session.commitTransaction();

    // Emit real-time events
    if (global.realtimeController) {
      existingTrees.forEach(tree => {
        global.realtimeController.broadcastTreeUpdate(
          tree._id.toString(),
          { newMeasurements: processedMeasurements.get(tree._id.toString()) },
          'tree:measurements-added'
        );
      });

      global.realtimeController.broadcastSystemNotification({
        type: 'success',
        message: `${measurements.length} measurements added to ${treeIds.length} trees`,
        level: 'info',
        details: {
          measurementCount: measurements.length,
          treeCount: treeIds.length,
          addedBy: req.user.email
        }
      }, 'admin');
    }

    res.status(201).json({
      success: true,
      message: `Successfully added ${measurements.length} measurements to ${treeIds.length} trees`,
      data: {
        measurementCount: measurements.length,
        affectedTrees: treeIds.length,
        updateResults,
        summary: {
          operation: 'bulk_add_measurements',
          addedAt: new Date()
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Bulk add measurements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add measurements in bulk',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Get bulk operation status
export const getBulkOperationStatus = async (req, res) => {
  try {
    // Get recent bulk operations from audit logs
    const recentOperations = await AuditLog.find({
      action: { $in: ['bulk_create', 'bulk_update', 'bulk_delete', 'bulk_add_measurements'] },
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .populate('userId', 'firstName lastName email');

    // Calculate statistics
    const stats = {
      total: recentOperations.length,
      byOperation: {},
      byUser: {},
      last24Hours: recentOperations.length
    };

    recentOperations.forEach(op => {
      // Count by operation type
      stats.byOperation[op.action] = (stats.byOperation[op.action] || 0) + 1;
      
      // Count by user
      const userEmail = op.userId?.email || 'unknown';
      stats.byUser[userEmail] = (stats.byUser[userEmail] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        recentOperations: recentOperations.map(op => ({
          id: op._id,
          action: op.action,
          resource: op.resource,
          timestamp: op.timestamp,
          user: op.userId ? {
            email: op.userId.email,
            name: `${op.userId.firstName} ${op.userId.lastName}`
          } : null,
          changes: op.changes
        })),
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Get bulk operation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bulk operation status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};