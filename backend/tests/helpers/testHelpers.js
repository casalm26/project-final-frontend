import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, Forest, Tree } from '../../models/index.js';

// Create test user with hashed password
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    password: 'password123',
    role: 'user',
    isActive: true
  };

  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

// Create test admin user
export const createTestAdmin = async (userData = {}) => {
  return createTestUser({ 
    ...userData, 
    role: 'admin',
    email: 'admin@test.com'
  });
};

// Generate valid JWT token for testing
export const generateTestToken = (userId, role = 'user') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Create test forest
export const createTestForest = async (forestData = {}) => {
  const defaultForest = {
    name: 'Test Forest',
    region: 'Test Region', // Added required region field
    location: {
      type: 'Point',
      coordinates: [18.0686, 59.3293] // Stockholm coordinates
    },
    description: 'A test forest for unit testing',
    area: 100.5,
    establishedDate: new Date('2020-01-01'),
    isActive: true
  };

  const forest = new Forest({ ...defaultForest, ...forestData });
  await forest.save();
  return forest;
};

// Create test tree
export const createTestTree = async (treeData = {}) => {
  const forest = treeData.forestId || await createTestForest();
  
  const defaultTree = {
    forestId: forest._id || forest,
    species: 'Pine',
    plantedDate: new Date('2021-01-01'),
    location: {
      type: 'Point',
      coordinates: [18.0686, 59.3293]
    },
    isAlive: true,
    measurements: [{
      height: 2.5,
      diameter: 0.1,
      healthStatus: 'healthy',
      co2Absorption: 10.5,
      measuredAt: new Date(),
      notes: 'Initial measurement'
    }]
  };

  const tree = new Tree({ ...defaultTree, ...treeData });
  await tree.save();
  return tree;
};

// Create multiple test trees for bulk operations
export const createTestTrees = async (count = 5, forestId = null) => {
  const forest = forestId || (await createTestForest())._id;
  const trees = [];
  
  for (let i = 0; i < count; i++) {
    const tree = await createTestTree({
      forestId: forest,
      species: i % 2 === 0 ? 'Pine' : 'Oak',
      isAlive: i < Math.floor(count * 0.8) // 80% survival rate
    });
    trees.push(tree);
  }
  
  return trees;
};

// Clean specific collections
export const cleanCollection = async (collectionName) => {
  const collection = mongoose.connection.collections[collectionName];
  if (collection) {
    await collection.deleteMany({});
  }
};

// Helper for API error validation
export const expectValidationError = (response, field = null) => {
  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toContain('validation');
  
  if (field) {
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.some(err => err.path === field)).toBe(true);
  }
};

// Helper for API authentication error
export const expectAuthError = (response) => {
  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toContain('authentication');
};

// Helper for API authorization error
export const expectAuthorizationError = (response) => {
  expect(response.status).toBe(403);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toContain('authorization');
};