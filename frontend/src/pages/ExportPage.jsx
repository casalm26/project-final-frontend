import { useState, useCallback } from 'react';
import { DashboardHeader } from '../components/ui/DashboardHeader';
import { DashboardSidebar } from '../components/ui/DashboardSidebar';
import { GlobalFilters } from '../components/filters';
import { useSidebarState } from '../hooks/useSidebarState';
import { useToast } from '../contexts/ToastContext';
import { exportAPI } from '../lib/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export const ExportPage = () => {
  const { sidebarOpen, toggleSidebar } = useSidebarState();
  const { showToast } = useToast();
  const [filters, setFilters] = useState({});
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('filtered');
  const [includeOptions, setIncludeOptions] = useState({
    // Basic Information
    basicInfo: true,
    location: true,
    health: true,
    measurements: true,
    images: false,
    
    // Advanced Data
    genetics: false,
    growthModel: false,
    maintenance: false,
    economicValue: false,
    canopy: false,
    ecologicalBenefits: false,
    environmentalFactors: false,
    metadata: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleIncludeOptionChange = (option) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportParams = {
        format: exportFormat,
        scope: exportScope,
        ...includeOptions
      };

      // Add filters if using filtered scope
      if (exportScope === 'filtered') {
        if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
          exportParams.startDate = filters.dateRange.startDate.toISOString();
          exportParams.endDate = filters.dateRange.endDate.toISOString();
        }
        if (filters.selectedForests?.length > 0) {
          exportParams.forestIds = filters.selectedForests.join(',');
        }
      }

      // The downloadFile method in ApiClient handles the download automatically
      await exportAPI.exportTrees(exportParams);
      
      showToast('Export completed successfully!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export failed. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const getExportPreview = () => {
    const includeCount = Object.values(includeOptions).filter(v => v).length;
    let recordEstimate = 'all records';
    
    if (exportScope === 'filtered') {
      if (filters.selectedForests?.length > 0) {
        recordEstimate = `records from ${filters.selectedForests.length} forest(s)`;
      }
      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        const startStr = filters.dateRange.startDate.toLocaleDateString();
        const endStr = filters.dateRange.endDate.toLocaleDateString();
        recordEstimate += ` between ${startStr} - ${endStr}`;
      }
    }

    return { includeCount, recordEstimate };
  };

  const { includeCount, recordEstimate } = getExportPreview();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onMenuClick={toggleSidebar} />
      
      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => toggleSidebar(false)} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Export</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Export your tree data in various formats with customizable options
              </p>
            </div>

            {/* Export Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Export Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* Export Scope */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Export Scope
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="all"
                        checked={exportScope === 'all'}
                        onChange={(e) => setExportScope(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300">
                        <span className="font-medium">All Data</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          Export entire database without any filters
                        </span>
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="filtered"
                        checked={exportScope === 'filtered'}
                        onChange={(e) => setExportScope(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Filtered Data</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          Export only data matching the filters below
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Filters (only show when filtered scope is selected) */}
                {exportScope === 'filtered' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <GlobalFilters onFiltersChange={handleFiltersChange} />
                  </div>
                )}

                {/* Data Fields to Include */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Data Fields to Include
                  </h2>
                  
                  {/* Basic Information */}
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries({
                        basicInfo: 'Basic Info (ID, Species, Forest)',
                        location: 'Location (Coordinates)',
                        health: 'Health Status',
                        measurements: 'Measurements (Height, Diameter, CO₂)',
                        images: 'Image URLs'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={includeOptions[key]}
                            onChange={() => handleIncludeOptionChange(key)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Data */}
                  <div>
                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                      Advanced Data
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries({
                        genetics: 'Genetics (Seed Source, Cultivar, Diversity)',
                        growthModel: 'Growth Model (Predictions, Rate, Index)',
                        maintenance: 'Maintenance (Fertilization, Pruning, Damage)',
                        economicValue: 'Economic Value (Timber, Carbon Credits)',
                        canopy: 'Canopy (Area, Density, Condition)',
                        ecologicalBenefits: 'Ecological Benefits (CO₂, Pollutants, Wildlife)',
                        environmentalFactors: 'Environmental (Climate, Site, Position)',
                        metadata: 'Metadata (Planting Method, Timestamps)'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={includeOptions[key]}
                            onChange={() => handleIncludeOptionChange(key)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className="ml-3 text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Export Format */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Export Format
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                      style={{ borderColor: exportFormat === 'csv' ? '#10b981' : '#e5e7eb' }}>
                      <input
                        type="radio"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900 dark:text-white">CSV</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          Comma-separated values, compatible with Excel
                        </span>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                      style={{ borderColor: exportFormat === 'xlsx' ? '#10b981' : '#e5e7eb' }}>
                      <input
                        type="radio"
                        value="xlsx"
                        checked={exportFormat === 'xlsx'}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900 dark:text-white">Excel (XLSX)</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          Native Excel format with formatting
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Export Preview & Action */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Export Preview
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Format:</span>
                      <span className="font-medium text-gray-900 dark:text-white uppercase">{exportFormat}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Scope:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{exportScope}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Fields:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{includeCount} selected</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Exporting:</span>
                      <span className="block font-medium text-gray-900 dark:text-white mt-1">
                        {recordEstimate}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleExport}
                    disabled={isExporting || includeCount === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                      isExporting || includeCount === 0
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isExporting ? (
                      <>
                        <LoadingSpinner size="small" className="mr-2" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Data
                      </>
                    )}
                  </button>

                  {includeCount === 0 && (
                    <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                      Please select at least one field to export
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};