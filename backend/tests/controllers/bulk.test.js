import request from 'supertest';
import express from 'express';
import bulkRoutes from '../../routes/bulk.js';
import { createTestUser, createTestForest, createTestTree, generateTestToken } from '../helpers/testHelpers.js';
import { Tree, AuditLog } from '../../models/index.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/bulk', bulkRoutes);

describe('Bulk Operations Controller', () => {
  let user, adminUser, forest, authToken, adminToken;

  beforeEach(async () => {
    user = await createTestUser();
    adminUser = await createTestUser({ 
      email: 'admin@test.com',
      role: 'admin' 
    });
    forest = await createTestForest();
    authToken = generateTestToken(user._id, user.role);
    adminToken = generateTestToken(adminUser._id, adminUser.role);
  });

  describe('POST /api/bulk/trees/create', () => {
    it('should create multiple trees successfully', async () => {
      const treesData = {
        forestId: forest._id.toString(),
        trees: [
          {
            species: 'Oak',
            location: {
              type: 'Point',
              coordinates: [18.0686, 59.3293]
            },
            plantedDate: '2024-01-15'
          },
          {
            species: 'Pine',
            location: {
              type: 'Point',
              coordinates: [18.0687, 59.3294]
            },
            plantedDate: '2024-01-15'
          }
        ]
      };

      const response = await request(app)
        .post('/api/bulk/trees/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(treesData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.createdTrees).toHaveLength(2);
      expect(response.body.data.summary.totalCreated).toBe(2);

      // Verify trees were created in database
      const treesInDb = await Tree.find({ forestId: forest._id });
      expect(treesInDb).toHaveLength(2);
    });

    it('should handle validation errors', async () => {
      const treesData = {
        trees: [
          {
            // Missing species
            location: {
              type: 'Point',
              coordinates: [18.0686, 59.3293]
            }
          },
          {
            species: 'Pine'
            // Missing location
          }
        ]
      };

      const response = await request(app)
        .post('/api/bulk/trees/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(treesData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(3); // Missing species, forestId, and location
    });

    it('should reject too many trees', async () => {
      const trees = Array(1001).fill({
        species: 'Oak',
        location: {
          type: 'Point',
          coordinates: [18.0686, 59.3293]
        }
      });

      const response = await request(app)
        .post('/api/bulk/trees/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ trees, forestId: forest._id.toString() });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Maximum 1000 trees');
    });

    it('should fail with non-existent forest', async () => {
      const treesData = {
        forestId: '507f1f77bcf86cd799439011', // Non-existent forest
        trees: [{
          species: 'Oak',
          location: {
            type: 'Point',
            coordinates: [18.0686, 59.3293]
          }
        }]
      };

      const response = await request(app)
        .post('/api/bulk/trees/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(treesData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Forest not found');
    });
  });

  describe('PUT /api/bulk/trees/update', () => {
    let tree1, tree2;

    beforeEach(async () => {
      tree1 = await createTestTree({ forestId: forest._id, species: 'Oak' });
      tree2 = await createTestTree({ forestId: forest._id, species: 'Pine' });
    });

    it('should update trees by IDs', async () => {
      const updateData = {
        treeIds: [tree1._id.toString(), tree2._id.toString()],
        updates: {
          isAlive: false
        }
      };

      const response = await request(app)
        .put('/api/bulk/trees/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.modifiedCount).toBe(2);

      // Verify updates in database
      const updatedTrees = await Tree.find({ 
        _id: { $in: [tree1._id, tree2._id] } 
      });
      updatedTrees.forEach(tree => {
        expect(tree.isAlive).toBe(false);
      });
    });

    it('should update trees by filter', async () => {
      const updateData = {
        filter: {
          forestId: forest._id.toString(),
          species: 'Oak'
        },
        updates: {
          addMeasurement: {
            height: 2.5,
            diameter: 0.15,
            healthStatus: 'healthy',
            notes: 'Bulk measurement'
          }
        }
      };

      const response = await request(app)
        .put('/api/bulk/trees/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.modifiedCount).toBe(1);

      // Verify measurement was added
      const updatedTree = await Tree.findById(tree1._id);
      expect(updatedTree.measurements).toHaveLength(2); // Original + new measurement
      expect(updatedTree.measurements[1].height).toBe(2.5);
    });

    it('should fail with no matching trees', async () => {
      const updateData = {
        filter: {
          species: 'NonExistentSpecies'
        },
        updates: {
          isAlive: false
        }
      };

      const response = await request(app)
        .put('/api/bulk/trees/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No trees found matching the criteria');
    });

    it('should require either treeIds or filter', async () => {
      const response = await request(app)
        .put('/api/bulk/trees/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          updates: { isAlive: false }
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Either treeIds array or filter criteria is required');
    });
  });

  describe('DELETE /api/bulk/trees/delete', () => {
    let tree1, tree2;

    beforeEach(async () => {
      tree1 = await createTestTree({ forestId: forest._id, species: 'Oak' });
      tree2 = await createTestTree({ forestId: forest._id, species: 'Pine', isAlive: false });
    });

    it('should soft delete trees by IDs', async () => {
      const deleteData = {
        treeIds: [tree1._id.toString(), tree2._id.toString()],
        hardDelete: false
      };

      const response = await request(app)
        .delete('/api/bulk/trees/delete')
        .set('Authorization', `Bearer ${authToken}`)
        .send(deleteData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.deletedCount).toBe(2);

      // Verify soft delete (trees still exist but marked inactive)
      const deletedTrees = await Tree.find({ 
        _id: { $in: [tree1._id, tree2._id] } 
      });
      deletedTrees.forEach(tree => {
        expect(tree.isActive).toBe(false);
        expect(tree.isAlive).toBe(false);
        expect(tree.deletedAt).toBeDefined();
      });
    });

    it('should hard delete trees as admin', async () => {
      const deleteData = {
        treeIds: [tree1._id.toString()],
        hardDelete: true
      };

      const response = await request(app)
        .delete('/api/bulk/trees/delete')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(deleteData);

      expect(response.status).toBe(200);
      expect(response.body.data.hardDelete).toBe(true);

      // Verify hard delete (tree no longer exists)
      const deletedTree = await Tree.findById(tree1._id);
      expect(deletedTree).toBeNull();
    });

    it('should delete trees by filter', async () => {
      const deleteData = {
        filter: {
          isAlive: false
        },
        hardDelete: false
      };

      const response = await request(app)
        .delete('/api/bulk/trees/delete')
        .set('Authorization', `Bearer ${authToken}`)
        .send(deleteData);

      expect(response.status).toBe(200);
      expect(response.body.data.deletedCount).toBe(1);
    });
  });

  describe('POST /api/bulk/measurements/add', () => {
    let tree1, tree2;

    beforeEach(async () => {
      tree1 = await createTestTree({ forestId: forest._id });
      tree2 = await createTestTree({ forestId: forest._id });
    });

    it('should add measurements to multiple trees', async () => {
      const measurementsData = {
        measurements: [
          {
            treeId: tree1._id.toString(),
            height: 2.5,
            diameter: 0.15,
            healthStatus: 'healthy',
            co2Absorption: 12.5,
            notes: 'Monthly measurement'
          },
          {
            treeId: tree2._id.toString(),
            height: 3.2,
            diameter: 0.18,
            healthStatus: 'stressed',
            co2Absorption: 10.2,
            notes: 'Showing signs of stress'
          }
        ]
      };

      const response = await request(app)
        .post('/api/bulk/measurements/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send(measurementsData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.measurementCount).toBe(2);
      expect(response.body.data.affectedTrees).toBe(2);

      // Verify measurements were added
      const updatedTree1 = await Tree.findById(tree1._id);
      const updatedTree2 = await Tree.findById(tree2._id);
      
      expect(updatedTree1.measurements).toHaveLength(2); // Original + new
      expect(updatedTree2.measurements).toHaveLength(2);
      expect(updatedTree1.measurements[1].height).toBe(2.5);
      expect(updatedTree2.measurements[1].healthStatus).toBe('stressed');
    });

    it('should validate measurement data', async () => {
      const measurementsData = {
        measurements: [
          {
            // Missing treeId
            height: 2.5
          },
          {
            treeId: tree1._id.toString()
            // Missing measurement values
          }
        ]
      };

      const response = await request(app)
        .post('/api/bulk/measurements/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send(measurementsData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(2);
    });

    it('should fail with non-existent trees', async () => {
      const measurementsData = {
        measurements: [
          {
            treeId: '507f1f77bcf86cd799439011', // Non-existent tree
            height: 2.5
          }
        ]
      };

      const response = await request(app)
        .post('/api/bulk/measurements/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send(measurementsData);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Some trees not found');
      expect(response.body.missingTreeIds).toBeDefined();
    });
  });

  describe('GET /api/bulk/operations/status', () => {
    beforeEach(async () => {
      // Create some audit log entries for bulk operations
      await AuditLog.create([
        {
          userId: user._id,
          action: 'bulk_create',
          resource: 'trees',
          changes: { operation: 'bulk_create_trees', count: 5 }
        },
        {
          userId: adminUser._id,
          action: 'bulk_update',
          resource: 'trees',
          changes: { operation: 'bulk_update_trees', affectedCount: 10 }
        }
      ]);
    });

    it('should return bulk operation status', async () => {
      const response = await request(app)
        .get('/api/bulk/operations/status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.recentOperations).toBeDefined();
      expect(response.body.data.statistics).toBeDefined();
      expect(response.body.data.statistics.total).toBeGreaterThan(0);
    });

    it('should include operation statistics', async () => {
      const response = await request(app)
        .get('/api/bulk/operations/status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.statistics.byOperation).toBeDefined();
      expect(response.body.data.statistics.byUser).toBeDefined();
      expect(response.body.data.statistics.last24Hours).toBeDefined();
    });
  });

  describe('Authentication and Authorization', () => {
    it('should require authentication for all bulk operations', async () => {
      const response = await request(app)
        .post('/api/bulk/trees/create')
        .send({ trees: [] });

      expect(response.status).toBe(401);
    });

    it('should track user activity for bulk operations', async () => {
      const treesData = {
        forestId: forest._id.toString(),
        trees: [{
          species: 'Oak',
          location: {
            type: 'Point',
            coordinates: [18.0686, 59.3293]
          }
        }]
      };

      const response = await request(app)
        .post('/api/bulk/trees/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(treesData);

      expect(response.status).toBe(201);

      // Verify audit log was created
      const auditLogs = await AuditLog.find({ 
        userId: user._id,
        action: 'bulk_create'
      });
      expect(auditLogs).toHaveLength(1);
    });
  });
});