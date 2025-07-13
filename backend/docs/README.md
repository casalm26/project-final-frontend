# Nanwa Forestry API Documentation

## Overview
The Nanwa Forestry API provides comprehensive endpoints for forest and tree management, monitoring, and data visualization. This RESTful API supports authentication, real-time data tracking, and advanced analytics for forestry operations.

## API Documentation Access

### Interactive Documentation (Swagger UI)
Access the interactive API documentation at:
- **Development**: [http://localhost:8080/docs](http://localhost:8080/docs)
- **Staging**: [https://api-staging.nanwa-forestry.com/docs](https://api-staging.nanwa-forestry.com/docs)
- **Production**: [https://api.nanwa-forestry.com/docs](https://api.nanwa-forestry.com/docs)

### OpenAPI Specification
Download the OpenAPI 3.0 specification:
- **JSON Format**: [/docs/json](http://localhost:8080/docs/json)
- **YAML Format**: [/docs/yaml](http://localhost:8080/docs/yaml)

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register` - Register new user account
- `POST /login` - User authentication
- `POST /logout` - Logout from current session
- `POST /refresh` - Refresh access token
- `GET /profile` - Get user profile information
- `PUT /profile` - Update user profile
- `POST /logout-all` - Logout from all devices

### Dashboard Analytics (`/api/dashboard`)
- `GET /stats` - Comprehensive dashboard statistics
- `GET /quick-stats` - Quick stats for widgets
- `GET /forest-comparison` - Forest comparison data

### Chart Data (`/api/charts`)
- `GET /survival-rate` - Tree survival rate over time
- `GET /height-growth` - Tree height growth trends
- `GET /co2-absorption` - CO2 absorption analytics
- `GET /health-status` - Tree health distribution
- `GET /combined` - All chart data combined

### Forests (`/api/forests`)
- Forest management endpoints (CRUD operations)
- Geospatial queries and filtering
- Forest metadata and statistics

### Trees (`/api/trees`)
- Tree management and tracking
- Measurement recording and history
- Species and health monitoring

### Data Export (`/api/exports`)
- CSV and Excel data export
- Customizable data ranges and filters
- Bulk data downloads

### Audit Logs (`/api/audit`)
- Activity tracking and logging
- Change history and accountability
- Administrative oversight

### User Management (`/api/users`)
- User administration (admin only)
- Role management
- Account activation/deactivation

## Authentication

The API uses JWT (JSON Web Token) based authentication:

```bash
# Login to get tokens
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Use the access token in subsequent requests
Authorization: Bearer <access_token>
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **General endpoints**: 100 requests per minute
- **Authentication endpoints**: 20 requests per minute  
- **Data-heavy endpoints**: 50 requests per minute

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Environment Endpoints

| Environment | Base URL | Status |
|-------------|----------|--------|
| Development | `http://localhost:8080/api` | 🟢 Active |
| Staging | `https://api-staging.nanwa-forestry.com/api` | 🟡 Preview |
| Production | `https://api.nanwa-forestry.com/api` | 🔴 Not deployed |

## Data Formats

### Date Handling
- All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Query parameters accept simplified dates: `YYYY-MM-DD`

### Geospatial Data
- Coordinates use GeoJSON format: `[longitude, latitude]`
- Geographic queries support radius and bounding box searches

### Pagination
```json
{
  "page": 1,
  "limit": 20,
  "total": 150,
  "pages": 8,
  "data": [...]
}
```

## Examples

### Get Dashboard Statistics
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8080/api/dashboard/stats?forestId=123&startDate=2024-01-01"
```

### Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }'
```

### Get Chart Data
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8080/api/charts/survival-rate?groupBy=month&forestId=123"
```

## Development

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Testing the API
```bash
# Run all tests
npm test

# Test specific endpoint
npm test -- --testNamePattern="auth"

# Generate coverage report
npm run test:coverage
```

## Support

- **Documentation Issues**: Submit issues to the [GitHub repository](https://github.com/your-org/nanwa-forestry)
- **API Support**: Contact [support@nanwa-forestry.com](mailto:support@nanwa-forestry.com)
- **Emergency**: For production issues, contact the on-call team

## Changelog

### Version 1.0.0
- Initial API release
- Complete authentication system
- Dashboard analytics endpoints
- Chart data APIs with time-series support
- Comprehensive test coverage
- OpenAPI 3.0 documentation