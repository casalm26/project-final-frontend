import { useState, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTreeFiltering } from '@/hooks/useTreeFiltering';
import { useMapControls } from '@/hooks/useMapControls';
import MarkerCluster from './MarkerCluster';
import MapLoadingHandler from './MapLoadingHandler';
import MapController from './MapController';
import { 
  MapContainerStyled, 
  MapHeader,
  MapTitle,
  MapControls,
  ControlButton,
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
  filters = {},
  loading = false,
  error = null
}) => {
  const [zoom, setZoom] = useState(13);
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

  const centerMap = useCallback(() => {
    if (filteredTrees.length === 0) return;
    
    // Calculate center point of all filtered trees
    const totalLat = filteredTrees.reduce((sum, tree) => sum + tree.lat, 0);
    const totalLng = filteredTrees.reduce((sum, tree) => sum + tree.lng, 0);
    const centerLat = totalLat / filteredTrees.length;
    const centerLng = totalLng / filteredTrees.length;
    
    // This would need to be implemented with a map ref in a real implementation
    console.log('Center map at:', centerLat, centerLng);
  }, [filteredTrees]);

  const fitBounds = useCallback(() => {
    if (filteredTrees.length === 0) return;
    
    // Calculate bounds of all filtered trees
    const bounds = filteredTrees.reduce((acc, tree) => {
      return {
        minLat: Math.min(acc.minLat, tree.lat),
        maxLat: Math.max(acc.maxLat, tree.lat),
        minLng: Math.min(acc.minLng, tree.lng),
        maxLng: Math.max(acc.maxLng, tree.lng)
      };
    }, {
      minLat: filteredTrees[0].lat,
      maxLat: filteredTrees[0].lat,
      minLng: filteredTrees[0].lng,
      maxLng: filteredTrees[0].lng
    });
    
    // This would need to be implemented with a map ref in a real implementation
    console.log('Fit bounds:', bounds);
  }, [filteredTrees]);

  return (
    <div>
      <MapHeader>
        <MapTitle>Forest Map</MapTitle>
        <MapControls>
          <ControlButton onClick={centerMap} title="Center Map">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </ControlButton>
          <ControlButton onClick={fitBounds} title="Fit to Bounds">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </ControlButton>
        </MapControls>
      </MapHeader>
      
      <MapContainerStyled>
        <MapContainer
          center={[59.3293, 18.0686]}
          zoom={13}
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
              >
                Retry
              </button>
            </ErrorContent>
          </ErrorOverlay>
        )}
      </MapContainerStyled>
      
      {/* Map Legend */}
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
            <span>Showing {filteredTrees.length} of {trees.length} trees</span>
          </div>
          <div className="flex items-center text-gray-500">
            <span>Zoom level: {zoom}</span>
            {zoom < 12 && <span className="ml-4 text-xs">(Clustering enabled)</span>}
          </div>
        </div>
      </div>
    </div>
  );
}; 