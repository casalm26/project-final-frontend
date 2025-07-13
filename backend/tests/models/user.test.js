import { User } from '../../models/index.js';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'password123',
        role: 'user'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.isActive).toBe(true); // Default value
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should hash password before saving', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        password: 'plaintext123'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password.length).toBeGreaterThan(50); // Bcrypt hash length
      
      // Verify password can be compared
      const isMatch = await bcrypt.compare(userData.password, savedUser.password);
      expect(isMatch).toBe(true);
    });

    it('should hash password even if it looks pre-hashed', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: hashedPassword
      };

      const user = new User(userData);
      const savedUser = await user.save();

      // The password will be hashed again since the pre-save hook always runs
      expect(savedUser.password).not.toBe(hashedPassword);
      expect(savedUser.password.length).toBeGreaterThan(50);
    });
  });

  describe('Validation', () => {
    it('should require firstName', async () => {
      const userData = {
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'password123'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow(/firstName.*required/);
    });

    it('should require lastName', async () => {
      const userData = {
        firstName: 'John',
        email: 'john.doe@test.com',
        password: 'password123'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow(/lastName.*required/);
    });

    it('should require valid email format', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow(/email.*valid/);
    });

    it('should require unique email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'duplicate@test.com',
        password: 'password123'
      };

      // Create first user
      const user1 = new User(userData);
      await user1.save();

      // Try to create second user with same email
      const user2 = new User(userData);
      
      await expect(user2.save()).rejects.toThrow(/duplicate.*email/);
    });

    it('should require password', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow(/password.*required/);
    });

    it('should validate role enum', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'password123',
        role: 'invalid-role'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow(/role.*enum/);
    });

    it('should accept valid roles', async () => {
      const roles = ['user', 'admin']; // Only these two roles are valid
      
      for (const role of roles) {
        const userData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `john.${role}@test.com`,
          password: 'password123',
          role
        };

        const user = new User(userData);
        const savedUser = await user.save();
        
        expect(savedUser.role).toBe(role);
      }
    });
  });

  describe('Instance Methods', () => {
    let user;

    beforeEach(async () => {
      user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'password123'
      });
      await user.save();
    });

    it('should compare password correctly', async () => {
      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });

    it('should exclude password in JSON', () => {
      const userJSON = user.toJSON();
      expect(userJSON.password).toBeUndefined();
      expect(userJSON.firstName).toBe('John');
      expect(userJSON.lastName).toBe('Doe');
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'password123'
      });
    });

    it('should find user by email', async () => {
      const user = await User.findByEmail('john.doe@test.com');
      expect(user).toBeDefined();
      expect(user.email).toBe('john.doe@test.com');
    });

    it('should return null for non-existent email', async () => {
      const user = await User.findByEmail('nonexistent@test.com');
      expect(user).toBeNull();
    });

    it('should find active users', async () => {
      // Create inactive user
      await User.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        password: 'password123',
        isActive: false
      });

      const activeUsers = await User.find({ isActive: true });
      expect(activeUsers.length).toBe(1);
      expect(activeUsers[0].email).toBe('john.doe@test.com');
    });
  });
});