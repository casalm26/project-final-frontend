import { body } from 'express-validator';

// Validation rules for user registration
export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces')
];

// Validation rules for user login
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for profile update
export const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces')
];

// Validation rules for forest creation
export const validateForestCreate = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Forest name must be between 1 and 100 characters'),
  
  body('region')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Region must be between 1 and 100 characters'),
  
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
  
  body('location.coordinates.*')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Coordinates must be valid numbers'),
  
  body('area')
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number'),
  
  body('areaUnit')
    .optional()
    .isIn(['hectares', 'acres', 'sq_km', 'sq_miles'])
    .withMessage('Area unit must be one of: hectares, acres, sq_km, sq_miles'),
  
  body('establishedDate')
    .isISO8601()
    .withMessage('Established date must be a valid date'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

// Validation rules for tree creation
export const validateTreeCreate = [
  body('treeId')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tree ID must be between 1 and 50 characters'),
  
  body('forestId')
    .isMongoId()
    .withMessage('Forest ID must be a valid MongoDB ObjectId'),
  
  body('species')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Species must be between 1 and 100 characters'),
  
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
  
  body('location.coordinates.*')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Coordinates must be valid numbers'),
  
  body('plantedDate')
    .isISO8601()
    .withMessage('Planted date must be a valid date')
];

// Validation rules for tree measurement
export const validateMeasurement = [
  body('height')
    .isFloat({ min: 0 })
    .withMessage('Height must be a positive number'),
  
  body('diameter')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Diameter must be a positive number'),
  
  body('co2Absorption')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('CO₂ absorption must be a positive number'),
  
  body('healthStatus')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor', 'critical'])
    .withMessage('Health status must be one of: excellent, good, fair, poor, critical'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

// Validation rules for admin user creation
export const validateUserCreate = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

// Validation rules for admin user update
export const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];