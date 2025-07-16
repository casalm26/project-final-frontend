export const treeSchema = {
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
};