import { validationResult } from 'express-validator';
import { Tree, Forest } from '../models/index.js';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Export trees data to CSV
export const exportTreesCSV = async (req, res) => {
  try {
    const {
      forestId,
      species,
      isAlive,
      startDate,
      endDate,
      includeHealthStatus = true,
      includeMeasurements = false
    } = req.query;

    // Build query conditions
    const queryConditions = {};
    if (forestId) queryConditions.forestId = forestId;
    if (species) queryConditions.species = new RegExp(species, 'i');
    if (isAlive !== undefined) queryConditions.isAlive = isAlive === 'true';

    if (startDate || endDate) {
      queryConditions.plantedDate = {};
      if (startDate) queryConditions.plantedDate.$gte = new Date(startDate);
      if (endDate) queryConditions.plantedDate.$lte = new Date(endDate);
    }

    // Get trees with forest information
    const trees = await Tree.find(queryConditions)
      .populate('forestId', 'name region')
      .lean();

    if (trees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trees found matching the criteria'
      });
    }

    // Prepare CSV data
    const csvData = [];
    
    trees.forEach(tree => {
      const baseRow = {
        'Tree ID': tree.treeId,
        'Forest Name': tree.forestId?.name || 'Unknown',
        'Region': tree.forestId?.region || 'Unknown',
        'Species': tree.species,
        'Planted Date': tree.plantedDate.toISOString().split('T')[0],
        'Is Alive': tree.isAlive ? 'Yes' : 'No',
        'Longitude': tree.location.coordinates[0],
        'Latitude': tree.location.coordinates[1],
        'Age (Days)': Math.floor((new Date() - tree.plantedDate) / (1000 * 60 * 60 * 24))
      };

      if (!tree.isAlive) {
        baseRow['Death Date'] = tree.deathDate ? tree.deathDate.toISOString().split('T')[0] : '';
        baseRow['Death Cause'] = tree.deathCause || '';
      }

      if (includeHealthStatus === 'true' && tree.measurements.length > 0) {
        const latestMeasurement = tree.measurements
          .sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
        
        baseRow['Current Height (m)'] = latestMeasurement.height || '';
        baseRow['Current Health Status'] = latestMeasurement.healthStatus || '';
        baseRow['Latest Measurement Date'] = latestMeasurement.measuredAt.toISOString().split('T')[0];
      }

      if (includeMeasurements === 'true') {
        if (tree.measurements.length === 0) {
          csvData.push(baseRow);
        } else {
          tree.measurements.forEach((measurement, index) => {
            const row = { ...baseRow };
            row['Measurement #'] = index + 1;
            row['Height (m)'] = measurement.height;
            row['Diameter (cm)'] = measurement.diameter || '';
            row['CO2 Absorption (kg)'] = measurement.co2Absorption || '';
            row['Health Status'] = measurement.healthStatus;
            row['Measurement Date'] = measurement.measuredAt.toISOString().split('T')[0];
            row['Notes'] = measurement.notes || '';
            csvData.push(row);
          });
        }
      } else {
        csvData.push(baseRow);
      }
    });

    // Convert to CSV format
    const csvHeaders = Object.keys(csvData[0]);
    const csvRows = csvData.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    );
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // Set response headers
    const filename = `nanwa_trees_export_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(csvContent));

    res.send(csvContent);
  } catch (error) {
    console.error('Export trees CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Export trees data to XLSX
export const exportTreesXLSX = async (req, res) => {
  try {
    const {
      forestId,
      species,
      isAlive,
      startDate,
      endDate,
      includeHealthStatus = true,
      includeMeasurements = false
    } = req.query;

    // Build query conditions (same as CSV)
    const queryConditions = {};
    if (forestId) queryConditions.forestId = forestId;
    if (species) queryConditions.species = new RegExp(species, 'i');
    if (isAlive !== undefined) queryConditions.isAlive = isAlive === 'true';

    if (startDate || endDate) {
      queryConditions.plantedDate = {};
      if (startDate) queryConditions.plantedDate.$gte = new Date(startDate);
      if (endDate) queryConditions.plantedDate.$lte = new Date(endDate);
    }

    // Get trees with forest information
    const trees = await Tree.find(queryConditions)
      .populate('forestId', 'name region')
      .lean();

    if (trees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trees found matching the criteria'
      });
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare trees summary data
    const treesData = trees.map(tree => {
      const row = {
        'Tree ID': tree.treeId,
        'Forest Name': tree.forestId?.name || 'Unknown',
        'Region': tree.forestId?.region || 'Unknown',
        'Species': tree.species,
        'Planted Date': tree.plantedDate.toISOString().split('T')[0],
        'Is Alive': tree.isAlive ? 'Yes' : 'No',
        'Longitude': tree.location.coordinates[0],
        'Latitude': tree.location.coordinates[1],
        'Age (Days)': Math.floor((new Date() - tree.plantedDate) / (1000 * 60 * 60 * 24))
      };

      if (!tree.isAlive) {
        row['Death Date'] = tree.deathDate ? tree.deathDate.toISOString().split('T')[0] : '';
        row['Death Cause'] = tree.deathCause || '';
      }

      if (includeHealthStatus === 'true' && tree.measurements.length > 0) {
        const latestMeasurement = tree.measurements
          .sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
        
        row['Current Height (m)'] = latestMeasurement.height || '';
        row['Current Health Status'] = latestMeasurement.healthStatus || '';
        row['Latest Measurement Date'] = latestMeasurement.measuredAt.toISOString().split('T')[0];
      }

      return row;
    });

    // Add trees summary sheet
    const treesWorksheet = XLSX.utils.json_to_sheet(treesData);
    XLSX.utils.book_append_sheet(workbook, treesWorksheet, 'Trees Summary');

    // Add measurements sheet if requested
    if (includeMeasurements === 'true') {
      const measurementsData = [];
      
      trees.forEach(tree => {
        tree.measurements.forEach((measurement, index) => {
          measurementsData.push({
            'Tree ID': tree.treeId,
            'Forest Name': tree.forestId?.name || 'Unknown',
            'Species': tree.species,
            'Measurement #': index + 1,
            'Height (m)': measurement.height,
            'Diameter (cm)': measurement.diameter || '',
            'CO2 Absorption (kg)': measurement.co2Absorption || '',
            'Health Status': measurement.healthStatus,
            'Measurement Date': measurement.measuredAt.toISOString().split('T')[0],
            'Notes': measurement.notes || ''
          });
        });
      });

      if (measurementsData.length > 0) {
        const measurementsWorksheet = XLSX.utils.json_to_sheet(measurementsData);
        XLSX.utils.book_append_sheet(workbook, measurementsWorksheet, 'Measurements');
      }
    }

    // Add statistics sheet
    const statistics = {
      'Total Trees': trees.length,
      'Alive Trees': trees.filter(t => t.isAlive).length,
      'Dead Trees': trees.filter(t => !t.isAlive).length,
      'Survival Rate (%)': ((trees.filter(t => t.isAlive).length / trees.length) * 100).toFixed(2),
      'Export Date': new Date().toISOString().split('T')[0],
      'Unique Forests': [...new Set(trees.map(t => t.forestId?.name).filter(Boolean))].length,
      'Unique Species': [...new Set(trees.map(t => t.species))].length
    };

    const statsData = Object.entries(statistics).map(([key, value]) => ({
      'Metric': key,
      'Value': value
    }));

    const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Statistics');

    // Convert workbook to buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers
    const filename = `nanwa_trees_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  } catch (error) {
    console.error('Export trees XLSX error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Export forest analytics data
export const exportForestAnalytics = async (req, res) => {
  try {
    const { format = 'xlsx' } = req.query;

    // Get all forests with their tree statistics
    const forests = await Forest.find({ isActive: true }).lean();
    
    const forestAnalytics = await Promise.all(
      forests.map(async (forest) => {
        const totalTrees = await Tree.countDocuments({ forestId: forest._id });
        const aliveTrees = await Tree.countDocuments({ forestId: forest._id, isAlive: true });
        const survivalRate = totalTrees > 0 ? (aliveTrees / totalTrees) * 100 : 0;

        // Get average height from latest measurements
        const avgHeightResult = await Tree.aggregate([
          { $match: { forestId: forest._id, isAlive: true } },
          { $unwind: '$measurements' },
          { $sort: { 'measurements.measuredAt': -1 } },
          { $group: { 
            _id: '$_id', 
            latestHeight: { $first: '$measurements.height' } 
          }},
          { $group: { 
            _id: null, 
            avgHeight: { $avg: '$latestHeight' } 
          }}
        ]);

        const avgHeight = avgHeightResult.length > 0 ? avgHeightResult[0].avgHeight : 0;

        // Get total CO2 absorption
        const co2Result = await Tree.aggregate([
          { $match: { forestId: forest._id, isAlive: true } },
          { $unwind: '$measurements' },
          { $group: { 
            _id: null, 
            totalCO2: { $sum: '$measurements.co2Absorption' } 
          }}
        ]);

        const totalCO2 = co2Result.length > 0 ? co2Result[0].totalCO2 : 0;

        return {
          'Forest Name': forest.name,
          'Region': forest.region,
          'Area (hectares)': forest.area,
          'Established Date': forest.establishedDate.toISOString().split('T')[0],
          'Total Trees': totalTrees,
          'Alive Trees': aliveTrees,
          'Dead Trees': totalTrees - aliveTrees,
          'Survival Rate (%)': Math.round(survivalRate * 100) / 100,
          'Average Height (m)': Math.round(avgHeight * 100) / 100,
          'Total CO2 Absorption (kg)': Math.round(totalCO2 * 100) / 100,
          'Trees per Hectare': totalTrees > 0 ? Math.round((totalTrees / forest.area) * 100) / 100 : 0
        };
      })
    );

    if (format === 'csv') {
      // Export as CSV
      const csvHeaders = Object.keys(forestAnalytics[0]);
      const csvRows = forestAnalytics.map(row => 
        csvHeaders.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      );
      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

      const filename = `nanwa_forest_analytics_${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);
    } else {
      // Export as XLSX
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(forestAnalytics);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Forest Analytics');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      const filename = `nanwa_forest_analytics_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    }
  } catch (error) {
    console.error('Export forest analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export forest analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};