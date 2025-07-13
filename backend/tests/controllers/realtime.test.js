import request from 'supertest';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import realtimeRoutes from '../../routes/realtime.js';
import { createTestUser, generateTestToken } from '../helpers/testHelpers.js';
import { RealtimeController } from '../../controllers/realtimeController.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/realtime', realtimeRoutes);

describe('Realtime Controller', () => {
  let server, io, realtimeController, user, authToken;
  let clientSocket;

  beforeAll((done) => {
    server = createServer(app);
    io = new Server(server);
    realtimeController = new RealtimeController(io);
    
    // Make available globally for middleware
    global.io = io;
    global.realtimeController = realtimeController;

    server.listen(() => {
      const port = server.address().port;
      done();
    });
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
    if (clientSocket) {
      clientSocket.close();
    }
  });

  beforeEach(async () => {
    user = await createTestUser();
    authToken = generateTestToken(user._id, user.role);
  });

  afterEach(() => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
  });

  describe('HTTP Endpoints', () => {
    describe('GET /api/realtime/connection-stats', () => {
      it('should return connection statistics', async () => {
        const response = await request(app)
          .get('/api/realtime/connection-stats')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('connectedUsers');
        expect(response.body.data.connectedUsers).toBe(0); // No socket connections in this test
      });

      it('should fail without authentication', async () => {
        const response = await request(app)
          .get('/api/realtime/connection-stats');

        expect(response.status).toBe(401);
      });

      it('should filter sensitive data for non-admin users', async () => {
        const response = await request(app)
          .get('/api/realtime/connection-stats')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).not.toHaveProperty('connections');
        expect(response.body.data).toHaveProperty('message');
      });
    });

    describe('POST /api/realtime/broadcast', () => {
      let adminUser, adminToken;

      beforeEach(async () => {
        adminUser = await createTestUser({ 
          email: 'admin@test.com',
          role: 'admin' 
        });
        adminToken = generateTestToken(adminUser._id, adminUser.role);
      });

      it('should broadcast notification as admin', async () => {
        const notificationData = {
          message: 'Test system notification',
          type: 'info',
          audience: 'all',
          title: 'Test Title'
        };

        const response = await request(app)
          .post('/api/realtime/broadcast')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(notificationData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.notification.message).toBe(notificationData.message);
        expect(response.body.data.audience).toBe('all');
      });

      it('should fail for non-admin users', async () => {
        const response = await request(app)
          .post('/api/realtime/broadcast')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            message: 'Unauthorized broadcast',
            type: 'info'
          });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Admin privileges required to broadcast notifications');
      });

      it('should validate required fields', async () => {
        const response = await request(app)
          .post('/api/realtime/broadcast')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            type: 'info'
            // Missing message
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Notification message is required');
      });
    });

    describe('POST /api/realtime/test-event', () => {
      let adminUser, adminToken;

      beforeEach(async () => {
        adminUser = await createTestUser({ 
          email: 'admin@test.com',
          role: 'admin' 
        });
        adminToken = generateTestToken(adminUser._id, adminUser.role);
      });

      it('should send test event as admin', async () => {
        const eventData = {
          eventType: 'custom-test',
          data: { test: 'data' },
          targetRoom: 'admin'
        };

        const response = await request(app)
          .post('/api/realtime/test-event')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(eventData);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.event.type).toBe('custom-test');
        expect(response.body.data.targetRoom).toBe('admin');
      });

      it('should fail for non-admin users', async () => {
        const response = await request(app)
          .post('/api/realtime/test-event')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            eventType: 'test',
            data: {}
          });

        expect(response.status).toBe(403);
      });
    });
  });

  describe('RealtimeController Class', () => {
    it('should track connected users', () => {
      const initialStats = realtimeController.getConnectionStats();
      expect(initialStats.connectedUsers).toBe(0);
      expect(initialStats.connections).toEqual([]);
    });

    it('should broadcast tree updates', () => {
      const treeId = '507f1f77bcf86cd799439011';
      const updateData = { species: 'Oak', height: 2.5 };

      // Mock io.to method
      const mockEmit = jest.fn();
      const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
      realtimeController.io.to = mockTo;

      realtimeController.broadcastTreeUpdate(treeId, updateData, 'tree:updated');

      expect(mockTo).toHaveBeenCalledWith(`tree:${treeId}`);
      expect(mockEmit).toHaveBeenCalledWith('tree:updated', {
        treeId,
        data: updateData,
        timestamp: expect.any(Date)
      });
    });

    it('should broadcast forest updates', () => {
      const forestId = '507f1f77bcf86cd799439012';
      const updateData = { name: 'Updated Forest' };

      // Mock io.to method
      const mockEmit = jest.fn();
      const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
      realtimeController.io.to = mockTo;

      realtimeController.broadcastForestUpdate(forestId, updateData, 'forest:updated');

      expect(mockTo).toHaveBeenCalledWith(`forest:${forestId}`);
      expect(mockEmit).toHaveBeenCalledWith('forest:updated', {
        forestId,
        data: updateData,
        timestamp: expect.any(Date)
      });
    });

    it('should broadcast system notifications', () => {
      const notification = {
        type: 'info',
        message: 'System maintenance scheduled',
        level: 'warning'
      };

      // Mock io.emit method
      const mockEmit = jest.fn();
      realtimeController.io.emit = mockEmit;

      realtimeController.broadcastSystemNotification(notification, 'all');

      expect(mockEmit).toHaveBeenCalledWith('notification:system', {
        id: expect.any(String),
        ...notification,
        timestamp: expect.any(Date)
      });
    });

    it('should broadcast image uploads', () => {
      const treeId = '507f1f77bcf86cd799439011';
      const imageData = {
        filename: 'test-image.jpg',
        url: '/uploads/trees/test-image.jpg'
      };

      // Mock io.to method
      const mockEmit = jest.fn();
      const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
      realtimeController.io.to = mockTo;

      realtimeController.broadcastImageUpload(treeId, imageData);

      expect(mockTo).toHaveBeenCalledWith(`tree:${treeId}`);
      expect(mockEmit).toHaveBeenCalledWith('tree:image-uploaded', {
        treeId,
        image: imageData,
        timestamp: expect.any(Date)
      });
    });
  });

  describe('SSE (Server-Sent Events)', () => {
    it('should establish SSE connection', (done) => {
      const req = request(app)
        .get('/api/realtime/events')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream');

      req.expect(200)
        .expect('Content-Type', /text\/event-stream/)
        .end((err) => {
          if (err) return done(err);
          done();
        });
    });

    it('should fail SSE without authentication', (done) => {
      request(app)
        .get('/api/realtime/events')
        .expect(401, done);
    });
  });
});