export const userSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password'],
  properties: {
    _id: {
      type: 'string',
      description: 'User ID'
    },
    firstName: {
      type: 'string',
      maxLength: 50,
      description: 'User first name'
    },
    lastName: {
      type: 'string',
      maxLength: 50,
      description: 'User last name'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address'
    },
    role: {
      type: 'string',
      enum: ['user', 'admin'],
      default: 'user',
      description: 'User role'
    },
    isActive: {
      type: 'boolean',
      default: true,
      description: 'Whether user account is active'
    },
    lastLogin: {
      type: 'string',
      format: 'date-time',
      description: 'Last login timestamp'
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Account creation timestamp'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Account last update timestamp'
    }
  }
};