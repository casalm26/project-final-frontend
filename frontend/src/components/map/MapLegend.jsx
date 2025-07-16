import React from 'react';

const MapLegend = ({ filteredTrees, totalTrees, zoom }) => {
  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>Healthy Trees</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
          <span>Warning</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>Critical</span>
        </div>
        <div className="flex items-center text-gray-500">
          <span>Showing {filteredTrees.length} of {totalTrees} trees</span>
        </div>
        <div className="flex items-center text-gray-500">
          <span>Zoom level: {zoom}</span>
          {zoom < 12 && <span className="ml-4 text-xs">(Clustering enabled)</span>}
        </div>
      </div>
    </div>
  );
};

export default MapLegend;