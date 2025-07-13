import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import uploadRoutes from '../../routes/uploads.js';
import { createTestUser, createTestTree, generateTestToken } from '../helpers/testHelpers.js';
import { TreeImage } from '../../models/index.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/uploads', uploadRoutes);

describe('Upload Controller', () => {
  let user, tree, authToken;

  beforeEach(async () => {
    user = await createTestUser();
    tree = await createTestTree();
    authToken = generateTestToken(user._id, user.role);
  });

  describe('POST /api/uploads/trees/:treeId/images', () => {
    const testImagePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-image.jpg');

    beforeEach(async () => {
      // Create a simple test image if it doesn't exist
      const testDir = path.dirname(testImagePath);
      try {
        await fs.access(testDir);
      } catch {
        await fs.mkdir(testDir, { recursive: true });
      }

      try {
        await fs.access(testImagePath);
      } catch {
        // Create a minimal valid JPEG file for testing
        const minimalJpeg = Buffer.from([
          0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
          0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
          0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
          0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0xFF, 0xD9
        ]);
        await fs.writeFile(testImagePath, minimalJpeg);
      }
    });

    it('should upload image successfully', async () => {
      const response = await request(app)
        .post(`/api/uploads/trees/${tree._id}/images`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', testImagePath)
        .field('description', 'Test tree image')
        .field('imageType', 'tree_photo')
        .field('tags', 'test,health-check');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.images).toHaveLength(1);
      expect(response.body.data.images[0].description).toBe('Test tree image');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/uploads/trees/${tree._id}/images`)
        .attach('images', testImagePath);

      expect(response.status).toBe(401);
    });

    it('should fail with non-existent tree', async () => {
      const fakeTreeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .post(`/api/uploads/trees/${fakeTreeId}/images`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', testImagePath);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Tree not found');
    });

    it('should fail without files', async () => {
      const response = await request(app)
        .post(`/api/uploads/trees/${tree._id}/images`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('description', 'Test without image');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No files uploaded');
    });
  });

  describe('GET /api/uploads/trees/:treeId/images', () => {
    let uploadedImage;

    beforeEach(async () => {
      uploadedImage = new TreeImage({
        treeId: tree._id,
        filename: 'test-image.jpg',
        originalName: 'original-test.jpg',
        mimeType: 'image/jpeg',
        size: 12345,
        path: '/uploads/trees/test-image.jpg',
        thumbnailPath: '/uploads/thumbnails/thumb-test-image.jpg',
        metadata: {
          width: 800,
          height: 600,
          format: 'jpeg'
        },
        imageType: 'tree_photo',
        description: 'Test image',
        uploadedBy: user._id,
        tags: ['test', 'sample']
      });
      await uploadedImage.save();
    });

    it('should get tree images successfully', async () => {
      const response = await request(app)
        .get(`/api/uploads/trees/${tree._id}/images`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.images).toHaveLength(1);
      expect(response.body.data.images[0].description).toBe('Test image');
    });

    it('should filter by image type', async () => {
      const response = await request(app)
        .get(`/api/uploads/trees/${tree._id}/images`)
        .query({ imageType: 'tree_photo' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.images).toHaveLength(1);
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get(`/api/uploads/trees/${tree._id}/images`)
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });

    it('should fail with non-existent tree', async () => {
      const fakeTreeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/uploads/trees/${fakeTreeId}/images`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/uploads/images/:imageId', () => {
    let uploadedImage;

    beforeEach(async () => {
      uploadedImage = new TreeImage({
        treeId: tree._id,
        filename: 'test-image.jpg',
        originalName: 'original-test.jpg',
        mimeType: 'image/jpeg',
        size: 12345,
        path: '/uploads/trees/test-image.jpg',
        uploadedBy: user._id
      });
      await uploadedImage.save();
    });

    it('should get image details successfully', async () => {
      const response = await request(app)
        .get(`/api/uploads/images/${uploadedImage._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.filename).toBe('test-image.jpg');
    });

    it('should fail with non-existent image', async () => {
      const fakeImageId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/uploads/images/${fakeImageId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/uploads/images/:imageId', () => {
    let uploadedImage;

    beforeEach(async () => {
      uploadedImage = new TreeImage({
        treeId: tree._id,
        filename: 'test-image.jpg',
        originalName: 'original-test.jpg',
        mimeType: 'image/jpeg',
        size: 12345,
        path: '/uploads/trees/test-image.jpg',
        uploadedBy: user._id,
        description: 'Original description'
      });
      await uploadedImage.save();
    });

    it('should update image metadata successfully', async () => {
      const updateData = {
        description: 'Updated description',
        imageType: 'health_assessment',
        tags: 'updated,health,assessment'
      };

      const response = await request(app)
        .put(`/api/uploads/images/${uploadedImage._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.description).toBe('Updated description');
      expect(response.body.data.imageType).toBe('health_assessment');
    });

    it('should fail when updating image not owned by user', async () => {
      const otherUser = await createTestUser({ email: 'other@test.com' });
      const otherToken = generateTestToken(otherUser._id, otherUser.role);

      const response = await request(app)
        .put(`/api/uploads/images/${uploadedImage._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ description: 'Unauthorized update' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized to update this image');
    });
  });

  describe('DELETE /api/uploads/images/:imageId', () => {
    let uploadedImage;

    beforeEach(async () => {
      uploadedImage = new TreeImage({
        treeId: tree._id,
        filename: 'test-image.jpg',
        originalName: 'original-test.jpg',
        mimeType: 'image/jpeg',
        size: 12345,
        path: '/uploads/trees/test-image.jpg',
        uploadedBy: user._id
      });
      await uploadedImage.save();
    });

    it('should delete image successfully (soft delete)', async () => {
      const response = await request(app)
        .delete(`/api/uploads/images/${uploadedImage._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Image deleted successfully');

      // Verify soft delete
      const deletedImage = await TreeImage.findById(uploadedImage._id);
      expect(deletedImage.isActive).toBe(false);
    });

    it('should fail when deleting image not owned by user', async () => {
      const otherUser = await createTestUser({ email: 'other@test.com' });
      const otherToken = generateTestToken(otherUser._id, otherUser.role);

      const response = await request(app)
        .delete(`/api/uploads/images/${uploadedImage._id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized to delete this image');
    });
  });

  describe('GET /api/uploads/trees/:treeId/images/stats', () => {
    beforeEach(async () => {
      // Create multiple images with different types
      const imageTypes = ['tree_photo', 'measurement_photo', 'health_assessment'];
      
      for (let i = 0; i < imageTypes.length; i++) {
        const image = new TreeImage({
          treeId: tree._id,
          filename: `test-image-${i}.jpg`,
          originalName: `original-test-${i}.jpg`,
          mimeType: 'image/jpeg',
          size: 12345 * (i + 1),
          path: `/uploads/trees/test-image-${i}.jpg`,
          imageType: imageTypes[i],
          uploadedBy: user._id
        });
        await image.save();
      }
    });

    it('should get image statistics successfully', async () => {
      const response = await request(app)
        .get(`/api/uploads/trees/${tree._id}/images/stats`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.byType).toBeDefined();
      expect(response.body.data.total).toBeDefined();
      expect(response.body.data.total.totalImages).toBe(3);
    });
  });

  describe('GET /api/uploads/images/recent', () => {
    beforeEach(async () => {
      const image = new TreeImage({
        treeId: tree._id,
        filename: 'recent-image.jpg',
        originalName: 'recent-original.jpg',
        mimeType: 'image/jpeg',
        size: 12345,
        path: '/uploads/trees/recent-image.jpg',
        uploadedBy: user._id
      });
      await image.save();
    });

    it('should get recent images successfully', async () => {
      const response = await request(app)
        .get('/api/uploads/images/recent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.images).toBeDefined();
      expect(response.body.data.count).toBeGreaterThan(0);
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/api/uploads/images/recent')
        .query({ limit: 5 })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.images.length).toBeLessThanOrEqual(5);
    });
  });
});