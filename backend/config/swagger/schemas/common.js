export const errorSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false
    },
    message: {
      type: 'string',
      description: 'Error message'
    },
    error: {
      type: 'string',
      description: 'Detailed error information (development only)'
    },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string' },
          message: { type: 'string' }
        }
      },
      description: 'Validation errors'
    }
  }
};

export const successResponseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: true
    },
    message: {
      type: 'string',
      description: 'Success message'
    },
    data: {
      type: 'object',
      description: 'Response data'
    }
  }
};