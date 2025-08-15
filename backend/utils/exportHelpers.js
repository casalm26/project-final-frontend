// Export utility functions for data transformation and formatting
import { buildTreeQuery, roundToTwo } from './dashboardUtils.js';

/**
 * Build query conditions for tree exports with additional export-specific filters
 * @param {Object} queryParams - Query parameters from request
 * @param {string} queryParams.forestId - Forest ID filter
 * @param {string} queryParams.species - Species filter
 * @param {string} queryParams.isAlive - Alive status filter
 * @param {string} queryParams.startDate - Start date filter
 * @param {string} queryParams.endDate - End date filter
 * @returns {Object} Query conditions for tree export
 */
export const buildExportTreeQuery = (queryParams) => {
  const { isAlive, ...baseFilters } = queryParams;
  
  const query = buildTreeQuery(baseFilters);

  // Add export-specific isAlive filter
  if (isAlive !== undefined) {
    query.isAlive = isAlive === 'true';
  }

  return query;
};

/**
 * Transform tree data into export row format
 * @param {Object} tree - Tree document from database
 * @param {Object} options - Export options with field selections
 * @returns {Object} Formatted tree row data
 */
export const transformTreeToExportRow = (tree, options = {}) => {
  const row = {};
  
  // Basic Information - always included
  if (options.basicInfo !== 'false') {
    row['Tree ID'] = tree.treeId;
    row['Forest Name'] = tree.forestId?.name || 'Unknown';
    row['Region'] = tree.forestId?.region || 'Unknown';
    row['Species'] = tree.species;
    row['Planted Date'] = tree.plantedDate ? new Date(tree.plantedDate).toISOString().split('T')[0] : '';
    row['Is Alive'] = tree.isAlive ? 'Yes' : 'No';
    row['Age (Days)'] = tree.plantedDate ? Math.floor((new Date() - new Date(tree.plantedDate)) / (1000 * 60 * 60 * 24)) : 0;
    
    if (!tree.isAlive) {
      row['Death Date'] = tree.deathDate ? new Date(tree.deathDate).toISOString().split('T')[0] : '';
      row['Death Cause'] = tree.deathCause || '';
    }
  }
  
  // Location
  if (options.location === 'true') {
    row['Longitude'] = tree.location?.coordinates?.[0] || '';
    row['Latitude'] = tree.location?.coordinates?.[1] || '';
  }
  
  // Health Status & Latest Measurements
  if (options.health === 'true' || options.measurements === 'true') {
    if (tree.measurements && tree.measurements.length > 0) {
      const latestMeasurement = tree.measurements
        .sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
      
      if (options.health === 'true') {
        row['Current Health Status'] = latestMeasurement.healthStatus || '';
      }
      
      if (options.measurements === 'true') {
        row['Current Height (m)'] = latestMeasurement.height || '';
        row['Current Diameter (cm)'] = latestMeasurement.diameter || '';
        row['Current CO2 Absorption (kg)'] = latestMeasurement.co2Absorption || '';
        row['Latest Measurement Date'] = latestMeasurement.measuredAt ? new Date(latestMeasurement.measuredAt).toISOString().split('T')[0] : '';
        row['Measurement Notes'] = latestMeasurement.notes || '';
      }
    }
  }
  
  // Images
  if (options.images === 'true' && tree.images && tree.images.length > 0) {
    row['Image URLs'] = tree.images.map(img => img.url).join('; ');
    row['Image Count'] = tree.images.length;
  }
  
  // Genetics
  if (options.genetics === 'true' && tree.genetics) {
    row['Seed Source'] = tree.genetics.seedSource || '';
    row['Cultivar'] = tree.genetics.cultivar || '';
    row['Parent Tree ID'] = tree.genetics.parentTreeId || '';
    row['Genetic Diversity'] = tree.genetics.geneticDiversity || '';
    row['Provenance Region'] = tree.genetics.provenanceRegion || '';
  }
  
  // Growth Model
  if (options.growthModel === 'true' && tree.growthModel) {
    row['Expected Height at 15 Years (m)'] = tree.growthModel.expectedHeightAt15Years || '';
    row['Expected Diameter at 15 Years (cm)'] = tree.growthModel.expectedDiameterAt15Years || '';
    row['Growth Rate'] = tree.growthModel.growthRate || '';
    row['Site Index'] = tree.growthModel.siteIndex || '';
    row['Maturity Age (years)'] = tree.growthModel.maturityAge || '';
    row['Max Height (m)'] = tree.growthModel.maxHeight || '';
    row['Max Diameter (cm)'] = tree.growthModel.maxDiameter || '';
  }
  
  // Economic Value
  if (options.economicValue === 'true' && tree.economicValue) {
    row['Current Timber Value'] = tree.economicValue.currentTimberValue || '';
    row['Carbon Credit Value'] = tree.economicValue.carbonCreditValue || '';
    row['Last Valuation Date'] = tree.economicValue.lastValuation ? new Date(tree.economicValue.lastValuation).toISOString().split('T')[0] : '';
    row['Valuation Method'] = tree.economicValue.valuationMethod || '';
    row['Market Price per m³'] = tree.economicValue.marketPricePerCubicMeter || '';
  }
  
  // Canopy
  if (options.canopy === 'true' && tree.canopy) {
    row['Canopy Diameter (m)'] = tree.canopy.diameter || '';
    row['Canopy Area (m²)'] = tree.canopy.area || '';
    row['Canopy Density'] = tree.canopy.density || '';
    row['Canopy Condition'] = tree.canopy.condition || '';
    row['Leaf Area Index'] = tree.canopy.leafArea || '';
    if (tree.canopy.seasonalChanges) {
      row['Spring Bud Break'] = tree.canopy.seasonalChanges.springBudBreak ? new Date(tree.canopy.seasonalChanges.springBudBreak).toISOString().split('T')[0] : '';
      row['Fall Color Change'] = tree.canopy.seasonalChanges.fallColorChange ? new Date(tree.canopy.seasonalChanges.fallColorChange).toISOString().split('T')[0] : '';
      row['Leaf Drop'] = tree.canopy.seasonalChanges.leafDrop ? new Date(tree.canopy.seasonalChanges.leafDrop).toISOString().split('T')[0] : '';
    }
  }
  
  // Ecological Benefits
  if (options.ecologicalBenefits === 'true' && tree.ecologicalBenefits) {
    // Stormwater
    if (tree.ecologicalBenefits.stormwaterIntercepted) {
      row['Stormwater Intercepted (gallons)'] = tree.ecologicalBenefits.stormwaterIntercepted.gallons || '';
      row['Stormwater Value'] = tree.ecologicalBenefits.stormwaterIntercepted.value || '';
    }
    // CO2
    if (tree.ecologicalBenefits.co2Sequestered) {
      row['CO2 Sequestered (lbs)'] = tree.ecologicalBenefits.co2Sequestered.pounds || '';
      row['CO2 Sequestered Value'] = tree.ecologicalBenefits.co2Sequestered.value || '';
    }
    if (tree.ecologicalBenefits.co2Stored) {
      row['CO2 Stored (lbs)'] = tree.ecologicalBenefits.co2Stored.pounds || '';
      row['CO2 Stored Value'] = tree.ecologicalBenefits.co2Stored.value || '';
    }
    // Air quality
    if (tree.ecologicalBenefits.airPollutantsRemoved) {
      row['Air Pollutants Removed (lbs)'] = tree.ecologicalBenefits.airPollutantsRemoved.pounds || '';
      row['Air Pollutants Value'] = tree.ecologicalBenefits.airPollutantsRemoved.value || '';
    }
    // Soil
    if (tree.ecologicalBenefits.soilStabilization) {
      row['Root Area (m²)'] = tree.ecologicalBenefits.soilStabilization.rootArea || '';
      row['Erosion Prevention (tons/year)'] = tree.ecologicalBenefits.soilStabilization.erosionPrevention || '';
    }
    // Wildlife
    if (tree.ecologicalBenefits.wildlifeHabitat) {
      row['Nesting Sites'] = tree.ecologicalBenefits.wildlifeHabitat.nestingSites || '';
      row['Food Production (kg/year)'] = tree.ecologicalBenefits.wildlifeHabitat.foodProduction || '';
      row['Biodiversity Support'] = tree.ecologicalBenefits.wildlifeHabitat.biodiversitySupport || '';
    }
  }
  
  // Environmental Factors
  if (options.environmentalFactors === 'true' && tree.environmentalFactors) {
    if (tree.environmentalFactors.microclimate) {
      row['Avg Temperature'] = tree.environmentalFactors.microclimate.avgTemperature || '';
      row['Humidity'] = tree.environmentalFactors.microclimate.humidity || '';
      row['Wind Exposure'] = tree.environmentalFactors.microclimate.windExposure || '';
    }
    if (tree.environmentalFactors.siteConditions) {
      row['Slope'] = tree.environmentalFactors.siteConditions.slope || '';
      row['Aspect'] = tree.environmentalFactors.siteConditions.aspect || '';
      row['Drainage'] = tree.environmentalFactors.siteConditions.drainage || '';
      row['Competition Index'] = tree.environmentalFactors.siteConditions.competitionIndex || '';
    }
    row['Forest Position'] = tree.environmentalFactors.forestPosition || '';
  }
  
  // Maintenance
  if (options.maintenance === 'true' && tree.maintenance) {
    // Latest fertilization
    if (tree.maintenance.fertilization && tree.maintenance.fertilization.length > 0) {
      const latestFert = tree.maintenance.fertilization
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      row['Last Fertilization Date'] = latestFert.date ? new Date(latestFert.date).toISOString().split('T')[0] : '';
      row['Fertilization Type'] = latestFert.type || '';
      row['NPK Ratio'] = latestFert.npkRatio || '';
    }
    // Latest pest control
    if (tree.maintenance.pestControl && tree.maintenance.pestControl.length > 0) {
      const latestPest = tree.maintenance.pestControl
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      row['Last Pest Control Date'] = latestPest.date ? new Date(latestPest.date).toISOString().split('T')[0] : '';
      row['Pest Type'] = latestPest.pestType || '';
      row['Treatment'] = latestPest.treatment || '';
    }
    // Latest damage report
    if (tree.maintenance.damageReports && tree.maintenance.damageReports.length > 0) {
      const latestDamage = tree.maintenance.damageReports
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      row['Last Damage Date'] = latestDamage.date ? new Date(latestDamage.date).toISOString().split('T')[0] : '';
      row['Damage Type'] = latestDamage.type || '';
      row['Damage Severity'] = latestDamage.severity || '';
    }
    // Pruning
    if (tree.maintenance.pruning) {
      row['Last Pruned'] = tree.maintenance.pruning.lastPruned ? new Date(tree.maintenance.pruning.lastPruned).toISOString().split('T')[0] : '';
      row['Next Pruning Scheduled'] = tree.maintenance.pruning.nextScheduled ? new Date(tree.maintenance.pruning.nextScheduled).toISOString().split('T')[0] : '';
    }
  }
  
  // Metadata
  if (options.metadata === 'true') {
    if (tree.metadata) {
      row['Soil Condition'] = tree.metadata.soilCondition || '';
      row['Sunlight Exposure'] = tree.metadata.sunlightExposure || '';
      row['Water Access'] = tree.metadata.waterAccess || '';
      row['Seedling Source'] = tree.metadata.seedlingSource || '';
      row['Planting Method'] = tree.metadata.plantingMethod || '';
      row['Initial Spacing (m)'] = tree.metadata.initialSpacing || '';
      row['Management Objective'] = tree.metadata.managementObjective || '';
    }
    row['Created At'] = tree.createdAt ? new Date(tree.createdAt).toISOString() : '';
    row['Updated At'] = tree.updatedAt ? new Date(tree.updatedAt).toISOString() : '';
  }
  
  return row;
};

/**
 * Transform tree measurement data into export row format
 * @param {Object} tree - Tree document from database
 * @param {Object} measurement - Measurement data
 * @param {number} measurementIndex - Index of measurement
 * @returns {Object} Formatted measurement row data
 */
export const transformMeasurementToExportRow = (tree, measurement, measurementIndex) => {
  return {
    'Tree ID': tree.treeId,
    'Forest Name': tree.forestId?.name || 'Unknown',
    'Species': tree.species,
    'Measurement #': measurementIndex + 1,
    'Height (m)': measurement.height,
    'Diameter (cm)': measurement.diameter || '',
    'CO2 Absorption (kg)': measurement.co2Absorption || '',
    'Health Status': measurement.healthStatus,
    'Measurement Date': measurement.measuredAt.toISOString().split('T')[0],
    'Notes': measurement.notes || ''
  };
};

/**
 * Process trees data for CSV export
 * @param {Array} trees - Array of tree documents
 * @param {Object} options - Processing options with field selections
 * @returns {Array} Array of formatted export rows
 */
export const processTreesForExport = (trees, options = {}) => {
  const exportData = [];

  trees.forEach(tree => {
    // Transform each tree with all field options
    const row = transformTreeToExportRow(tree, options);
    exportData.push(row);
  });

  return exportData;
};

/**
 * Generate CSV content from data array
 * @param {Array} data - Array of objects to convert to CSV
 * @returns {string} CSV formatted string
 */
export const generateCSVContent = (data) => {
  if (!data || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape values containing commas with quotes
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};

/**
 * Generate export filename with timestamp
 * @param {string} baseFilename - Base filename without extension
 * @param {string} extension - File extension (e.g., 'csv', 'xlsx')
 * @returns {string} Generated filename with timestamp
 */
export const generateExportFilename = (baseFilename, extension) => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${baseFilename}_${timestamp}.${extension}`;
};

/**
 * Set CSV response headers
 * @param {Object} res - Express response object
 * @param {string} filename - Filename for download
 * @param {string} content - CSV content for content-length header
 */
export const setCSVResponseHeaders = (res, filename, content) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', Buffer.byteLength(content));
};

/**
 * Set XLSX response headers
 * @param {Object} res - Express response object
 * @param {string} filename - Filename for download
 * @param {Buffer} buffer - XLSX buffer for content-length header
 */
export const setXLSXResponseHeaders = (res, filename, buffer) => {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', buffer.length);
};

/**
 * Calculate forest analytics statistics
 * @param {Object} forest - Forest document
 * @param {number} totalTrees - Total trees in forest
 * @param {number} aliveTrees - Alive trees in forest
 * @param {number} avgHeight - Average height of trees
 * @param {number} totalCO2 - Total CO2 absorption
 * @returns {Object} Formatted forest analytics data
 */
export const calculateForestAnalytics = (forest, totalTrees, aliveTrees, avgHeight, totalCO2) => {
  const deadTrees = totalTrees - aliveTrees;
  const survivalRate = totalTrees > 0 ? (aliveTrees / totalTrees) * 100 : 0;
  const treesPerHectare = totalTrees > 0 ? totalTrees / forest.area : 0;

  return {
    'Forest Name': forest.name,
    'Region': forest.region,
    'Area (hectares)': forest.area,
    'Established Date': forest.establishedDate.toISOString().split('T')[0],
    'Total Trees': totalTrees,
    'Alive Trees': aliveTrees,
    'Dead Trees': deadTrees,
    'Survival Rate (%)': roundToTwo(survivalRate),
    'Average Height (m)': roundToTwo(avgHeight),
    'Total CO2 Absorption (kg)': roundToTwo(totalCO2),
    'Trees per Hectare': roundToTwo(treesPerHectare)
  };
};

/**
 * Generate export statistics for XLSX files
 * @param {Array} trees - Array of tree data
 * @returns {Object} Statistics object
 */
export const generateExportStatistics = (trees) => {
  const aliveTrees = trees.filter(t => t.isAlive).length;
  const deadTrees = trees.length - aliveTrees;
  const survivalRate = trees.length > 0 ? (aliveTrees / trees.length) * 100 : 0;
  
  return {
    'Total Trees': trees.length,
    'Alive Trees': aliveTrees,
    'Dead Trees': deadTrees,
    'Survival Rate (%)': roundToTwo(survivalRate),
    'Export Date': new Date().toISOString().split('T')[0],
    'Unique Forests': [...new Set(trees.map(t => t.forestId?.name).filter(Boolean))].length,
    'Unique Species': [...new Set(trees.map(t => t.species))].length
  };
};