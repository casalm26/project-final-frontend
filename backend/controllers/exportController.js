import { Tree, Forest } from '../models/index.js';
import XLSX from 'xlsx';
import {
  processTreesForExport,
  generateCSVContent,
  generateExportFilename,
  setCSVResponseHeaders,
  setXLSXResponseHeaders,
  calculateForestAnalytics,
  generateExportStatistics,
  transformTreeToExportRow
} from '../utils/exportHelpers.js';
import { handleDashboardError } from '../utils/dashboardUtils.js';

// Export trees data to CSV
export const exportTreesCSV = async (req, res) => {
  try {
    // Extract all field selection parameters from query
    const fieldOptions = { ...req.query };

    // Get ALL trees from database
    const trees = await Tree.find({}).lean();
    
    // Manually populate forestId information for valid references
    const forestIds = [...new Set(trees.map(t => t.forestId).filter(Boolean))];
    const forests = await Forest.find(
      { _id: { $in: forestIds } },
      { name: 1, region: 1 }
    ).lean();
    
    const forestMap = new Map(forests.map(f => [f._id.toString(), f]));
    
    // Attach forest info to trees
    trees.forEach(tree => {
      if (tree.forestId) {
        tree.forestId = forestMap.get(tree.forestId.toString()) || null;
      }
    });


    if (trees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trees found matching the criteria'
      });
    }

    // Process trees data for export with all field options
    const csvData = processTreesForExport(trees, fieldOptions);

    // Generate CSV content
    const csvContent = generateCSVContent(csvData);

    // Set response headers and send
    const filename = generateExportFilename('nanwa_trees_export', 'csv');
    setCSVResponseHeaders(res, filename, csvContent);
    res.send(csvContent);
  } catch (error) {
    handleDashboardError(res, error, 'Failed to export data');
  }
};

// Export trees data to XLSX
export const exportTreesXLSX = async (req, res) => {
  try {
    // Extract all field selection parameters from query
    const fieldOptions = { ...req.query };

    // Get ALL trees from database
    const trees = await Tree.find({}).lean();
    
    // Manually populate forestId information for valid references
    const forestIds = [...new Set(trees.map(t => t.forestId).filter(Boolean))];
    const forests = await Forest.find(
      { _id: { $in: forestIds } },
      { name: 1, region: 1 }
    ).lean();
    
    const forestMap = new Map(forests.map(f => [f._id.toString(), f]));
    
    // Attach forest info to trees
    trees.forEach(tree => {
      if (tree.forestId) {
        tree.forestId = forestMap.get(tree.forestId.toString()) || null;
      }
    });


    if (trees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trees found matching the criteria'
      });
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare trees summary data using helper with all field options
    const treesData = trees.map(tree => transformTreeToExportRow(tree, fieldOptions));

    // Add trees summary sheet
    const treesWorksheet = XLSX.utils.json_to_sheet(treesData);
    XLSX.utils.book_append_sheet(workbook, treesWorksheet, 'Trees Summary');

    // Add measurements sheet if requested
    if (fieldOptions.measurements === 'true') {
      const measurementsData = [];
      
      trees.forEach(tree => {
        tree.measurements.forEach((measurement, index) => {
          measurementsData.push({
            'Tree ID': tree.treeId,
            'Forest Name': tree.forestId?.name || 'Unknown',
            'Species': tree.species,
            'Measurement #': index + 1,
            'Height (m)': measurement.height,
            'Diameter (cm)': measurement.diameter || '',
            'CO2 Absorption (kg)': measurement.co2Absorption || '',
            'Health Status': measurement.healthStatus,
            'Measurement Date': measurement.measuredAt.toISOString().split('T')[0],
            'Notes': measurement.notes || ''
          });
        });
      });

      if (measurementsData.length > 0) {
        const measurementsWorksheet = XLSX.utils.json_to_sheet(measurementsData);
        XLSX.utils.book_append_sheet(workbook, measurementsWorksheet, 'Measurements');
      }
    }

    // Add statistics sheet using helper
    const statistics = generateExportStatistics(trees);
    const statsData = Object.entries(statistics).map(([key, value]) => ({
      'Metric': key,
      'Value': value
    }));

    const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Statistics');

    // Convert workbook to buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers and send
    const filename = generateExportFilename('nanwa_trees_export', 'xlsx');
    setXLSXResponseHeaders(res, filename, buffer);
    res.send(buffer);
  } catch (error) {
    handleDashboardError(res, error, 'Failed to export data');
  }
};


// Export forest analytics data (not being used at the moment)
export const exportForestAnalytics = async (req, res) => {
  try {
    const { format = 'xlsx' } = req.query;

    // Get all forests with their tree statistics
    const forests = await Forest.find({ isActive: true }).lean();
    
    const forestAnalytics = await Promise.all(
      forests.map(async (forest) => {
        const totalTrees = await Tree.countDocuments({ forestId: forest._id });
        const aliveTrees = await Tree.countDocuments({ forestId: forest._id, isAlive: true });

        // Get average height from latest measurements
        const avgHeightResult = await Tree.aggregate([
          { $match: { forestId: forest._id, isAlive: true } },
          { $unwind: '$measurements' },
          { $sort: { 'measurements.measuredAt': -1 } },
          { $group: { 
            _id: '$_id', 
            latestHeight: { $first: '$measurements.height' } 
          }},
          { $group: { 
            _id: null, 
            avgHeight: { $avg: '$latestHeight' } 
          }}
        ]);

        const avgHeight = avgHeightResult.length > 0 ? avgHeightResult[0].avgHeight : 0;

        // Get total CO2 absorption
        const co2Result = await Tree.aggregate([
          { $match: { forestId: forest._id, isAlive: true } },
          { $unwind: '$measurements' },
          { $group: { 
            _id: null, 
            totalCO2: { $sum: '$measurements.co2Absorption' } 
          }}
        ]);

        const totalCO2 = co2Result.length > 0 ? co2Result[0].totalCO2 : 0;

        // Use helper to calculate analytics
        return calculateForestAnalytics(forest, totalTrees, aliveTrees, avgHeight, totalCO2);
      })
    );

    if (format === 'csv') {
      // Export as CSV using helper
      const csvContent = generateCSVContent(forestAnalytics);
      const filename = generateExportFilename('nanwa_forest_analytics', 'csv');
      setCSVResponseHeaders(res, filename, csvContent);
      res.send(csvContent);
    } else {
      // Export as XLSX
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(forestAnalytics);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Forest Analytics');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      const filename = generateExportFilename('nanwa_forest_analytics', 'xlsx');
      setXLSXResponseHeaders(res, filename, buffer);
      res.send(buffer);
    }
  } catch (error) {
    handleDashboardError(res, error, 'Failed to export forest analytics');
  }
};