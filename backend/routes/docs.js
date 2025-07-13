import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '../config/swagger.js';

const router = express.Router();

// Swagger UI setup
const swaggerOptions = {
  explorer: true,
  customCss: `
    .topbar-wrapper .link {
      content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAABQCAYAAABnDyOPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABf1JREFUeNrt3V1oFGcYBuDJJhKNxvxIYzSJsZoQE22DFsRCLYRWwYul9qK9sYVeWFpK6U0vtFfttb1pb1ov2ovWC4uttFJKL1qwYKEVLFRQsGAtVKyIJjbG/E1sNJtsZp6dnZ2ZnZ2ZPXsO3wMPyexmZ2dnv3e+n+87s1EqlYKHh4dzkM4L3LbT7xz/IWbkHW8QdOdv9PlfAnDBMAhYKOgB1NBAaOQHMbafGK1d5Qs/eo8DXq');
      height: 40px;
    }
    .swagger-ui .topbar { background-color: #2d5016; }
    .swagger-ui .info .title { color: #2d5016; }
  `,
  customSiteTitle: 'Nanwa Forestry API Documentation',
  customfavIcon: '/favicon.ico'
};

// Serve API documentation
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpecs, swaggerOptions));

// JSON endpoint for the OpenAPI spec
router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// YAML endpoint for the OpenAPI spec
router.get('/yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  // Convert JSON to YAML (simplified)
  const yaml = JSON.stringify(swaggerSpecs, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, '')
    .replace(/,$/gm, '')
    .replace(/^\s*[\{\}]/gm, '');
  res.send(yaml);
});

export default router;