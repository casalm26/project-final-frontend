import request from 'supertest';
import express from 'express';
import chartRoutes from '../../routes/charts.js';
import { createTestUser, createTestTrees, createTestTree, generateTestToken } from '../helpers/testHelpers.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/charts', chartRoutes);

describe('Chart Controller', () => {
  let user, authToken;

  beforeEach(async () => {
    user = await createTestUser();
    authToken = generateTestToken(user._id, user.role);
    
    // Create test trees with measurements for chart data
    await createTestTrees(5);
  });

  describe('GET /api/charts/survival-rate', () => {
    it('should return survival rate chart data', async () => {
      const response = await request(app)
        .get('/api/charts/survival-rate')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.chartData).toBeInstanceOf(Array);
      expect(response.body.data.groupBy).toBeDefined();
      expect(response.body.data.totalDataPoints).toBeGreaterThanOrEqual(0);
    });

    it('should support different groupBy parameters', async () => {
      const response = await request(app)
        .get('/api/charts/survival-rate')
        .query({ groupBy: 'week' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.groupBy).toBe('week');
    });

    it('should filter by forest ID', async () => {
      const trees = await createTestTrees(3);
      const forestId = trees[0].forestId;

      const response = await request(app)
        .get('/api/charts/survival-rate')
        .query({ forestId: forestId.toString() })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/charts/survival-rate');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/charts/height-growth', () => {
    beforeEach(async () => {
      // Create tree with multiple measurements for height growth
      await createTestTree({
        measurements: [
          {
            height: 1.5,
            diameter: 0.08,
            healthStatus: 'healthy',
            measuredAt: new Date('2023-01-01'),
            co2Absorption: 8.0
          },
          {
            height: 2.1,
            diameter: 0.12,
            healthStatus: 'healthy',
            measuredAt: new Date('2023-06-01'),
            co2Absorption: 12.5
          }
        ]
      });
    });

    it('should return height growth chart data', async () => {
      const response = await request(app)
        .get('/api/charts/height-growth')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.chartData).toBeInstanceOf(Array);
    });

    it('should filter by species', async () => {
      const response = await request(app)
        .get('/api/charts/height-growth')
        .query({ species: 'Pine' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.filters.species).toBe('Pine');
    });

    it('should include date range filtering', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';

      const response = await request(app)
        .get('/api/charts/height-growth')
        .query({ startDate, endDate })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.filters.startDate).toBe(startDate);
      expect(response.body.data.filters.endDate).toBe(endDate);
    });
  });

  describe('GET /api/charts/co2-absorption', () => {
    it('should return CO2 absorption chart data', async () => {
      const response = await request(app)
        .get('/api/charts/co2-absorption')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.chartData).toBeInstanceOf(Array);
      expect(response.body.data.summary).toBeDefined();
    });

    it('should include cumulative CO2 data', async () => {
      const response = await request(app)
        .get('/api/charts/co2-absorption')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      if (response.body.data.chartData.length > 0) {
        expect(response.body.data.chartData[0]).toHaveProperty('cumulativeCO2');
      }
    });

    it('should provide summary statistics', async () => {
      const response = await request(app)
        .get('/api/charts/co2-absorption')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.summary).toHaveProperty('totalCO2Absorption');
      expect(response.body.data.summary).toHaveProperty('totalMeasurements');
      expect(response.body.data.summary).toHaveProperty('uniqueTrees');
    });
  });

  describe('GET /api/charts/health-status', () => {
    it('should return health status distribution chart data', async () => {
      const response = await request(app)
        .get('/api/charts/health-status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.chartData).toBeInstanceOf(Array);
    });

    it('should include health distribution breakdown', async () => {
      const response = await request(app)
        .get('/api/charts/health-status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      if (response.body.data.chartData.length > 0) {
        expect(response.body.data.chartData[0]).toHaveProperty('healthDistribution');
        expect(response.body.data.chartData[0]).toHaveProperty('totalMeasurements');
      }
    });
  });

  describe('GET /api/charts/combined', () => {
    it('should return combined chart data for dashboard', async () => {
      const response = await request(app)
        .get('/api/charts/combined')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('survivalRate');
      expect(response.body.data).toHaveProperty('heightGrowth');
      expect(response.body.data).toHaveProperty('co2Absorption');
      expect(response.body.data).toHaveProperty('healthStatus');
      expect(response.body.data).toHaveProperty('generatedAt');
    });

    it('should include filters in combined response', async () => {
      const forestId = (await createTestTrees(2))[0].forestId;

      const response = await request(app)
        .get('/api/charts/combined')
        .query({ forestId: forestId.toString(), groupBy: 'week' })
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.filters.forestId).toBe(forestId.toString());
      expect(response.body.data.groupBy).toBe('week');
    });

    it('should handle empty data gracefully', async () => {
      // Clear all test data
      const { Tree } = await import('../../models/index.js');
      await Tree.deleteMany({});

      const response = await request(app)
        .get('/api/charts/combined')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to chart endpoints', async () => {
      const requests = Array(15).fill().map(() =>
        request(app)
          .get('/api/charts/survival-rate')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});