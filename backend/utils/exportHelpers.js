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
 * @param {Object} options - Export options
 * @param {boolean} options.includeHealthStatus - Include health status data
 * @returns {Object} Formatted tree row data
 */
export const transformTreeToExportRow = (tree, options = {}) => {
  const { includeHealthStatus } = options;
  
  const baseRow = {
    'Tree ID': tree.treeId,
    'Forest Name': tree.forestId?.name || 'Unknown',
    'Region': tree.forestId?.region || 'Unknown',
    'Species': tree.species,
    'Planted Date': tree.plantedDate.toISOString().split('T')[0],
    'Is Alive': tree.isAlive ? 'Yes' : 'No',
    'Longitude': tree.location.coordinates[0],
    'Latitude': tree.location.coordinates[1],
    'Age (Days)': Math.floor((new Date() - tree.plantedDate) / (1000 * 60 * 60 * 24))
  };

  // Add death information for dead trees
  if (!tree.isAlive) {
    baseRow['Death Date'] = tree.deathDate ? tree.deathDate.toISOString().split('T')[0] : '';
    baseRow['Death Cause'] = tree.deathCause || '';
  }

  // Add health status information if requested and available
  if (includeHealthStatus === 'true' && tree.measurements.length > 0) {
    const latestMeasurement = tree.measurements
      .sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))[0];
    
    baseRow['Current Height (m)'] = latestMeasurement.height || '';
    baseRow['Current Health Status'] = latestMeasurement.healthStatus || '';
    baseRow['Latest Measurement Date'] = latestMeasurement.measuredAt.toISOString().split('T')[0];
  }

  return baseRow;
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
 * Process trees data for CSV export with measurements
 * @param {Array} trees - Array of tree documents
 * @param {Object} options - Processing options
 * @param {boolean} options.includeMeasurements - Include measurements data
 * @param {boolean} options.includeHealthStatus - Include health status data
 * @returns {Array} Array of formatted export rows
 */
export const processTreesForExport = (trees, options = {}) => {
  const { includeMeasurements, includeHealthStatus } = options;
  const exportData = [];

  trees.forEach(tree => {
    const baseRow = transformTreeToExportRow(tree, { includeHealthStatus });

    if (includeMeasurements === 'true') {
      if (tree.measurements.length === 0) {
        exportData.push(baseRow);
      } else {
        tree.measurements.forEach((measurement, index) => {
          const measurementRow = transformMeasurementToExportRow(tree, measurement, index);
          exportData.push({ ...baseRow, ...measurementRow });
        });
      }
    } else {
      exportData.push(baseRow);
    }
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