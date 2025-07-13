import request from 'supertest';
import express from 'express';
import dashboardRoutes from '../../routes/dashboard.js';
import { createTestUser, createTestTrees, generateTestToken } from '../helpers/testHelpers.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/dashboard', dashboardRoutes);

describe('Dashboard Controller', () => {
  let user, authToken;

  beforeEach(async () => {
    user = await createTestUser();
    authToken = generateTestToken(user._id, user.role);
    
    // Create test data for dashboard stats
    await createTestTrees(10);
  });

  describe('GET /api/dashboard/stats', () => {
    it('should return dashboard statistics for authenticated user', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.trees).toBeDefined();
      expect(response.body.data.forests).toBeDefined();
      expect(response.body.data.users).toBeDefined();
      expect(response.body.data.trees.total).toBeGreaterThan(0);
      expect(response.body.data.trees.alive).toBeDefined();
      expect(response.body.data.trees.dead).toBeDefined();
      expect(response.body.data.trees.survivalRate).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return filtered stats by forest', async () => {
      const trees = await createTestTrees(5);
      const forestId = trees[0].forestId;

      const response = await request(app)
        .get('/api/dashboard/stats')
        .query({ forestId: forestId.toString() })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.filters.forestId).toBe(forestId.toString());
    });

    it('should return stats within date range', async () => {
      const startDate = '2021-01-01';
      const endDate = '2023-12-31';

      const response = await request(app)
        .get('/api/dashboard/stats')
        .query({ startDate, endDate })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.filters.startDate).toBe(startDate);
      expect(response.body.data.filters.endDate).toBe(endDate);
    });
  });

  describe('GET /api/dashboard/overview', () => {
    it('should return comprehensive dashboard overview', async () => {
      const response = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.summary).toBeDefined();
      expect(response.body.data.recentActivities).toBeDefined();
      expect(response.body.data.topPerformingForests).toBeDefined();
      expect(response.body.data.speciesDistribution).toBeDefined();
    });

    it('should include recent activities', async () => {
      const response = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.recentActivities).toBeInstanceOf(Array);
    });

    it('should include species distribution', async () => {
      const response = await request(app)
        .get('/api/dashboard/overview')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.speciesDistribution).toBeInstanceOf(Array);
      expect(response.body.data.speciesDistribution.length).toBeGreaterThan(0);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to dashboard endpoints', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const requests = Array(20).fill().map(() =>
        request(app)
          .get('/api/dashboard/stats')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      // At least some requests should be rate limited
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});