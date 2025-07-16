import { body } from 'express-validator';

// Common validation patterns
const commonValidators = {
  email: () => body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  password: () => body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  passwordLogin: () => body('password')
    .notEmpty()
    .withMessage('Password is required'),

  firstName: (required = true) => {
    const validator = body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('First name can only contain letters and spaces');
    
    return required ? validator : validator.optional();
  },

  lastName: (required = true) => {
    const validator = body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Last name can only contain letters and spaces');
    
    return required ? validator : validator.optional();
  },

  coordinates: () => [
    body('location.coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of [longitude, latitude]'),
    body('location.coordinates.*')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Coordinates must be valid numbers')
  ],

  mongoId: (field) => body(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId`),

  positiveFloat: (field, message) => body(field)
    .isFloat({ min: 0 })
    .withMessage(message || `${field} must be a positive number`),

  optionalPositiveFloat: (field, message) => body(field)
    .optional()
    .isFloat({ min: 0 })
    .withMessage(message || `${field} must be a positive number`),

  isoDate: (field, message) => body(field)
    .isISO8601()
    .withMessage(message || `${field} must be a valid date`),

  trimmedString: (field, min, max, message) => body(field)
    .trim()
    .isLength({ min, max })
    .withMessage(message || `${field} must be between ${min} and ${max} characters`),

  optionalString: (field, max, message) => body(field)
    .optional()
    .isLength({ max })
    .withMessage(message || `${field} cannot exceed ${max} characters`)
};

// Validation rules for user registration
export const validateRegister = [
  commonValidators.email(),
  commonValidators.password(),
  commonValidators.firstName(),
  commonValidators.lastName()
];

// Validation rules for user login
export const validateLogin = [
  commonValidators.email(),
  commonValidators.passwordLogin()
];

// Validation rules for profile update
export const validateProfileUpdate = [
  commonValidators.firstName(false),
  commonValidators.lastName(false)
];

// Validation rules for forest creation
export const validateForestCreate = [
  commonValidators.trimmedString('name', 1, 100, 'Forest name must be between 1 and 100 characters'),
  commonValidators.trimmedString('region', 1, 100, 'Region must be between 1 and 100 characters'),
  ...commonValidators.coordinates(),
  commonValidators.positiveFloat('area', 'Area must be a positive number'),
  body('areaUnit')
    .optional()
    .isIn(['hectares', 'acres', 'sq_km', 'sq_miles'])
    .withMessage('Area unit must be one of: hectares, acres, sq_km, sq_miles'),
  commonValidators.isoDate('establishedDate', 'Established date must be a valid date'),
  commonValidators.optionalString('description', 500, 'Description cannot exceed 500 characters')
];

// Validation rules for tree creation
export const validateTreeCreate = [
  commonValidators.trimmedString('treeId', 1, 50, 'Tree ID must be between 1 and 50 characters'),
  commonValidators.mongoId('forestId'),
  commonValidators.trimmedString('species', 1, 100, 'Species must be between 1 and 100 characters'),
  ...commonValidators.coordinates(),
  commonValidators.isoDate('plantedDate', 'Planted date must be a valid date')
];

// Validation rules for tree measurement
export const validateMeasurement = [
  commonValidators.positiveFloat('height', 'Height must be a positive number'),
  commonValidators.optionalPositiveFloat('diameter', 'Diameter must be a positive number'),
  commonValidators.optionalPositiveFloat('co2Absorption', 'CO₂ absorption must be a positive number'),
  body('healthStatus')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor', 'critical'])
    .withMessage('Health status must be one of: excellent, good, fair, poor, critical'),
  commonValidators.optionalString('notes', 500, 'Notes cannot exceed 500 characters')
];

// Validation rules for admin user creation
export const validateUserCreate = [
  commonValidators.email(),
  commonValidators.password(),
  commonValidators.firstName(),
  commonValidators.lastName(),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

// Validation rules for admin user update
export const validateUserUpdate = [
  commonValidators.firstName(false),
  commonValidators.lastName(false),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];