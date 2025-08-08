import mongoose from 'mongoose';
import { User, Forest, Tree, Owner } from '../models/index.js';

// Extract enum values and required fields from a mongoose schema
const analyzeSchema = (Model, modelName) => {
  const schema = Model.schema;
  const analysis = {
    modelName,
    requiredFields: [],
    enumFields: {},
    validationRules: {}
  };

  // Helper function to recursively analyze schema paths
  const analyzePath = (schemaPath, pathName) => {
    if (schemaPath.isRequired) {
      analysis.requiredFields.push(pathName);
    }

    if (schemaPath.enumValues && schemaPath.enumValues.length > 0) {
      analysis.enumFields[pathName] = schemaPath.enumValues;
    }

    // Add other validation rules
    if (schemaPath.options) {
      const rules = {};
      if (schemaPath.options.min !== undefined) rules.min = schemaPath.options.min;
      if (schemaPath.options.max !== undefined) rules.max = schemaPath.options.max;
      if (schemaPath.options.minlength !== undefined) rules.minlength = schemaPath.options.minlength;
      if (schemaPath.options.maxlength !== undefined) rules.maxlength = schemaPath.options.maxlength;
      if (schemaPath.options.match) rules.match = schemaPath.options.match.toString();
      
      if (Object.keys(rules).length > 0) {
        analysis.validationRules[pathName] = rules;
      }
    }
  };

  // Analyze each path in the schema
  schema.eachPath((pathName, schemaPath) => {
    // Skip internal mongoose fields
    if (pathName.startsWith('_') || pathName === '__v') return;
    
    analyzePath(schemaPath, pathName);
  });

  return analysis;
};

// Analyze all models
const analyzeAllSchemas = () => {
  console.log('🔍 Analyzing Model Schemas for Seeder Compatibility\n');
  console.log('='.repeat(60));

  const models = [
    { Model: User, name: 'User' },
    { Model: Owner, name: 'Owner' },
    { Model: Forest, name: 'Forest' },
    { Model: Tree, name: 'Tree' }
  ];

  const allAnalysis = {};

  models.forEach(({ Model, name }) => {
    console.log(`\n📋 ${name.toUpperCase()} MODEL ANALYSIS:`);
    console.log('-'.repeat(40));
    
    const analysis = analyzeSchema(Model, name);
    allAnalysis[name] = analysis;

    // Print required fields
    if (analysis.requiredFields.length > 0) {
      console.log(`\n✅ Required fields (${analysis.requiredFields.length}):`);
      analysis.requiredFields.forEach(field => {
        console.log(`   • ${field}`);
      });
    }

    // Print enum fields
    const enumFieldNames = Object.keys(analysis.enumFields);
    if (enumFieldNames.length > 0) {
      console.log(`\n🎯 Enum fields (${enumFieldNames.length}):`);
      enumFieldNames.forEach(field => {
        console.log(`   • ${field}: [${analysis.enumFields[field].map(v => `'${v}'`).join(', ')}]`);
      });
    }

    // Print validation rules
    const ruleFieldNames = Object.keys(analysis.validationRules);
    if (ruleFieldNames.length > 0) {
      console.log(`\n📏 Validation rules (${ruleFieldNames.length}):`);
      ruleFieldNames.forEach(field => {
        const rules = analysis.validationRules[field];
        const ruleStrings = Object.entries(rules).map(([key, value]) => `${key}: ${value}`);
        console.log(`   • ${field}: {${ruleStrings.join(', ')}}`);
      });
    }
  });

  return allAnalysis;
};

// Generate seeder-friendly data templates
const generateDataTemplates = (analysis) => {
  console.log('\n\n📝 SEEDER DATA TEMPLATES:');
  console.log('='.repeat(60));

  const templates = {};

  Object.entries(analysis).forEach(([modelName, data]) => {
    console.log(`\n🏗️  ${modelName} Template:`);
    console.log('-'.repeat(30));
    
    const template = {};
    
    // Add required fields with example values
    data.requiredFields.forEach(field => {
      if (data.enumFields[field]) {
        template[field] = data.enumFields[field][0]; // Use first enum value
      } else {
        // Provide type-appropriate default values
        if (field.includes('email') || field.includes('Email')) {
          template[field] = 'example@domain.com';
        } else if (field.includes('password') || field.includes('Password')) {
          template[field] = 'password123';
        } else if (field.includes('Date') || field.endsWith('At')) {
          template[field] = 'new Date()';
        } else if (field.includes('name') || field.includes('Name')) {
          template[field] = 'Example Name';
        } else if (field.includes('Id') || field.includes('_id')) {
          template[field] = 'ObjectId reference';
        } else {
          template[field] = 'required value';
        }
      }
    });

    templates[modelName] = template;
    console.log(JSON.stringify(template, null, 2));
  });

  return templates;
};

// Main execution function
const validateSchemas = () => {
  try {
    const analysis = analyzeAllSchemas();
    const templates = generateDataTemplates(analysis);
    
    console.log('\n\n🎯 CRITICAL SEEDER REQUIREMENTS:');
    console.log('='.repeat(60));
    console.log('1. Forest.metadata.soilType must be one of:', analysis.Forest?.enumFields['metadata.soilType'] || 'Check schema');
    console.log('2. Forest.metadata.climate must be one of:', analysis.Forest?.enumFields['metadata.climate'] || 'Check schema');
    console.log('3. Owner.organizationType must be one of:', analysis.Owner?.enumFields['organizationType'] || 'Check schema');
    console.log('4. Owner.managementApproach.primaryObjective must be one of:', analysis.Owner?.enumFields['managementApproach.primaryObjective'] || 'Check schema');
    console.log('5. All Forest documents must have owner ObjectId reference');
    console.log('6. User email must match pattern:', analysis.User?.validationRules['email']?.match || 'Check schema');

    return { analysis, templates };
  } catch (error) {
    console.error('❌ Error analyzing schemas:', error);
    return null;
  }
};

// Export for use in other files
export { validateSchemas, analyzeSchema, analyzeAllSchemas, generateDataTemplates };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateSchemas();
}

export default validateSchemas;