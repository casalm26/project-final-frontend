import { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MarkerCluster from './MarkerCluster';
import MapLoadingHandler from './MapLoadingHandler';
import MapController from './MapController';
import { 
  MapContainerStyled, 
  LoadingOverlay, 
  ErrorOverlay, 
  ErrorContent 
} from './ForestMap.styles';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const ForestMap = ({ 
  trees = [],
  onTreeSelect,
  loading = false,
  error = null
}) => {
  const [zoom, setZoom] = useState(5);
  const [selectedTree, setSelectedTree] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // Trees are already filtered by the parent component
  const filteredTrees = trees;

  const handleTreeClick = useCallback((tree) => {
    setSelectedTree(tree);
    if (onTreeSelect) {
      onTreeSelect(tree);
    }
  }, [onTreeSelect]);

  const handleZoomChange = useCallback((newZoom) => {
    setZoom(newZoom);
  }, []);

  const handleMapReady = useCallback(() => {
    setMapLoading(false);
    setMapError(null);
  }, []);

  const handleMapError = useCallback((error) => {
    setMapLoading(false);
    setMapError(error?.message || 'Failed to load map');
  }, []);

  const retryMap = useCallback(() => {
    setMapLoading(true);
    setMapError(null);
    // In a real implementation, this would reload the map
    setTimeout(() => {
      setMapLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <MapContainerStyled>
        <MapContainer
          center={[59.3293, 18.0686]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapLoadingHandler onMapReady={handleMapReady} onMapError={handleMapError} />
          <MapController onZoomChange={handleZoomChange} />
          <MarkerCluster trees={filteredTrees} onTreeClick={handleTreeClick} zoom={zoom} />
        </MapContainer>
        
        {/* Loading overlay */}
        {(mapLoading || loading) && (
          <LoadingOverlay>
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-2 text-sm text-gray-600">Loading map...</p>
            </div>
          </LoadingOverlay>
        )}
        
        {/* Error overlay */}
        {(mapError || error) && (
          <ErrorOverlay>
            <ErrorContent>
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Map Error</h4>
              <p className="text-sm text-gray-600 mb-4">{mapError || error}</p>
              <button
                onClick={retryMap}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                aria-label="Retry loading map"
              >
                Retry
              </button>
            </ErrorContent>
          </ErrorOverlay>
        )}
      </MapContainerStyled>
      
      {/* Map Legend */}
      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200" role="region" aria-label="Map legend">
        <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm text-gray-900">
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
          <div className="flex items-center">
            <span>Showing {filteredTrees.length} of {trees.length} trees</span>
          </div>
          <div className="flex items-center">
            <span aria-live="polite">Zoom level: {zoom}</span>
            {zoom < 12 && <span className="ml-4 text-xs">(Clustering enabled)</span>}
          </div>
        </div>
      </div>
    </div>
  );
}; 