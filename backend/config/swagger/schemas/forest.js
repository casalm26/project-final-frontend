export const forestSchema = {
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
};