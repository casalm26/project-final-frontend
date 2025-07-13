import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nanwa Forestry API',
      version: '1.0.0',
      description: 'A comprehensive API for forest and tree management, monitoring, and data visualization',
      contact: {
        name: 'API Support',
        email: 'support@nanwa-forestry.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Development server'
      },
      {
        url: 'https://api-staging.nanwa-forestry.com/api',
        description: 'Staging server'
      },
      {
        url: 'https://api.nanwa-forestry.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
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
        },
        Forest: {
          type: 'object',
          required: ['name', 'region', 'location', 'area', 'establishedDate'],
          properties: {
            _id: {
              type: 'string',
              description: 'Forest ID'
            },
            name: {
              type: 'string',
              maxLength: 100,
              description: 'Forest name'
            },
            region: {
              type: 'string',
              maxLength: 100,
              description: 'Geographic region'
            },
            location: {
              type: 'object',
              description: 'GeoJSON Point location',
              properties: {
                type: {
                  type: 'string',
                  enum: ['Point']
                },
                coordinates: {
                  type: 'array',
                  items: {
                    type: 'number'
                  },
                  minItems: 2,
                  maxItems: 2,
                  description: '[longitude, latitude]'
                }
              }
            },
            area: {
              type: 'number',
              minimum: 0,
              description: 'Forest area'
            },
            areaUnit: {
              type: 'string',
              enum: ['hectares', 'acres', 'sq_km', 'sq_miles'],
              default: 'hectares',
              description: 'Unit of area measurement'
            },
            establishedDate: {
              type: 'string',
              format: 'date',
              description: 'Date forest was established'
            },
            description: {
              type: 'string',
              maxLength: 500,
              description: 'Forest description'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Whether forest is active'
            },
            metadata: {
              type: 'object',
              properties: {
                soilType: { type: 'string' },
                climate: { type: 'string' },
                elevation: { type: 'number' },
                avgRainfall: { type: 'number' },
                avgTemperature: { type: 'number' }
              },
              description: 'Additional forest metadata'
            }
          }
        },
        Tree: {
          type: 'object',
          required: ['forestId', 'species', 'plantedDate', 'location'],
          properties: {
            _id: {
              type: 'string',
              description: 'Tree ID'
            },
            forestId: {
              type: 'string',
              description: 'ID of the forest this tree belongs to'
            },
            species: {
              type: 'string',
              description: 'Tree species'
            },
            plantedDate: {
              type: 'string',
              format: 'date',
              description: 'Date tree was planted'
            },
            location: {
              type: 'object',
              description: 'GeoJSON Point location',
              properties: {
                type: {
                  type: 'string',
                  enum: ['Point']
                },
                coordinates: {
                  type: 'array',
                  items: {
                    type: 'number'
                  },
                  minItems: 2,
                  maxItems: 2
                }
              }
            },
            isAlive: {
              type: 'boolean',
              default: true,
              description: 'Whether tree is alive'
            },
            measurements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  height: { type: 'number', description: 'Height in meters' },
                  diameter: { type: 'number', description: 'Diameter in meters' },
                  healthStatus: {
                    type: 'string',
                    enum: ['healthy', 'stressed', 'diseased', 'dead'],
                    description: 'Tree health status'
                  },
                  co2Absorption: { type: 'number', description: 'CO2 absorption in kg' },
                  measuredAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Measurement timestamp'
                  },
                  notes: { type: 'string', description: 'Additional notes' }
                }
              },
              description: 'Tree measurements over time'
            }
          }
        },
        Error: {
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
        },
        SuccessResponse: {
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
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJSDoc(options);

export default specs;