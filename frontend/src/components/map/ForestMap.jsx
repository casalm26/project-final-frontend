import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapContainerStyled = styled.div`
  height: 600px;
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  position: relative;
`;

const MapHeader = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MapTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const MapControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  padding: 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 0.75rem;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 0.75rem;
`;

const ErrorContent = styled.div`
  text-align: center;
  padding: 2rem;
  max-width: 300px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Custom tree marker icon
const createTreeIcon = (type = 'healthy') => {
  const colors = {
    healthy: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444'
  };
  
  return L.divIcon({
    className: 'custom-tree-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${colors[type]};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      ">
        🌳
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Custom MarkerCluster component
const MarkerCluster = ({ trees, onTreeClick, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !trees.length) return;
    
    // Remove existing cluster layer if it exists
    map.eachLayer(layer => {
      if (layer instanceof L.MarkerClusterGroup) {
        map.removeLayer(layer);
      }
    });
    
    // Only use clustering for zoom levels < 12
    if (zoom < 12) {
      // Create cluster group
      const clusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          let size = 'small';
          if (count > 10) size = 'medium';
          if (count > 50) size = 'large';
          
          return L.divIcon({
            html: `<div style="
              background: #10b981;
              border: 3px solid white;
              border-radius: 50%;
              width: ${size === 'small' ? '30px' : size === 'medium' ? '40px' : '50px'};
              height: ${size === 'small' ? '30px' : size === 'medium' ? '40px' : '50px'};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: ${size === 'small' ? '12px' : size === 'medium' ? '14px' : '16px'};
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">${count}</div>`,
            className: 'custom-cluster-icon',
            iconSize: [30, 30]
          });
        }
      });
      
      // Add markers to cluster group
      trees.forEach(tree => {
        const marker = L.marker([tree.lat, tree.lng], {
          icon: createTreeIcon(tree.health)
        });
        
        marker.bindPopup(`
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 8px 0; font-weight: 600;">${tree.name}</h4>
            <p style="margin: 4px 0; font-size: 14px;">Species: ${tree.species}</p>
            <p style="margin: 4px 0; font-size: 14px;">Height: ${tree.height}m</p>
            <p style="margin: 4px 0; font-size: 14px;">Health: 
              <span style="padding: 2px 8px; border-radius: 12px; font-size: 12px; ${
                tree.health === 'healthy' ? 'background: #d1fae5; color: #065f46;' :
                tree.health === 'warning' ? 'background: #fef3c7; color: #92400e;' :
                'background: #fee2e2; color: #991b1b;'
              }">${tree.health}</span>
            </p>
          </div>
        `);
        
        marker.on('click', () => onTreeClick(tree));
        clusterGroup.addLayer(marker);
      });
      
      map.addLayer(clusterGroup);
    } else {
      // For zoom >= 12, show individual markers without clustering
      trees.forEach(tree => {
        const marker = L.marker([tree.lat, tree.lng], {
          icon: createTreeIcon(tree.health)
        });
        
        marker.bindPopup(`
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 8px 0; font-weight: 600;">${tree.name}</h4>
            <p style="margin: 4px 0; font-size: 14px;">Species: ${tree.species}</p>
            <p style="margin: 4px 0; font-size: 14px;">Height: ${tree.height}m</p>
            <p style="margin: 4px 0; font-size: 14px;">Health: 
              <span style="padding: 2px 8px; border-radius: 12px; font-size: 12px; ${
                tree.health === 'healthy' ? 'background: #d1fae5; color: #065f46;' :
                tree.health === 'warning' ? 'background: #fef3c7; color: #92400e;' :
                'background: #fee2e2; color: #991b1b;'
              }">${tree.health}</span>
            </p>
          </div>
        `);
        
        marker.on('click', () => onTreeClick(tree));
        marker.addTo(map);
      });
    }
    
    // Cleanup function
    return () => {
      map.eachLayer(layer => {
        if (layer instanceof L.MarkerClusterGroup) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, trees, onTreeClick, zoom]);
  
  return null;
};

// Map loading handler component
const MapLoadingHandler = ({ onMapReady, onMapError }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleMapReady = () => {
      if (onMapReady) {
        onMapReady();
      }
    };
    
    const handleMapError = (error) => {
      console.error('Map error:', error);
      if (onMapError) {
        onMapError(error);
      }
    };
    
    // Map is ready when tiles are loaded
    map.whenReady(() => {
      handleMapReady();
    });
    
    // Handle tile errors
    map.on('tileerror', handleMapError);
    
    return () => {
      map.off('tileerror', handleMapError);
    };
  }, [map, onMapReady, onMapError]);
  
  return null;
};

// Map controller component - FIXED: removed function dependency from useEffect
const MapController = ({ onZoomChange }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleZoomEnd = () => {
      if (onZoomChange) {
        onZoomChange(map.getZoom());
      }
    };
    
    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]); // Only depend on map, not the callback function
  
  return null;
};

export const ForestMap = ({ 
  trees = [
    { id: 1, lat: 59.3293, lng: 18.0686, name: 'Tree A-001', health: 'healthy', height: 2.4, species: 'Pine' },
    { id: 2, lat: 59.3300, lng: 18.0690, name: 'Tree A-002', health: 'healthy', height: 2.1, species: 'Oak' },
    { id: 3, lat: 59.3285, lng: 18.0675, name: 'Tree A-003', health: 'warning', height: 1.8, species: 'Birch' },
    { id: 4, lat: 59.3310, lng: 18.0700, name: 'Tree A-004', health: 'critical', height: 1.5, species: 'Spruce' },
    { id: 5, lat: 59.3275, lng: 18.0660, name: 'Tree A-005', health: 'healthy', height: 2.7, species: 'Pine' },
    { id: 6, lat: 59.3320, lng: 18.0710, name: 'Tree A-006', health: 'healthy', height: 2.3, species: 'Oak' },
    { id: 7, lat: 59.3265, lng: 18.0650, name: 'Tree A-007', health: 'warning', height: 1.9, species: 'Birch' },
    { id: 8, lat: 59.3330, lng: 18.0720, name: 'Tree A-008', health: 'healthy', height: 2.5, species: 'Spruce' }
  ],
  onTreeSelect,
  filters = {},
  loading = false,
  error = null
}) => {
  const [zoom, setZoom] = useState(13);
  const [selectedTree, setSelectedTree] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // Filter trees based on applied filters
  const filteredTrees = trees.filter(tree => {
    // Apply forest filters if selected forests exist
    if (filters.selectedForests && filters.selectedForests.length > 0) {
      // For now, assume tree has a forestId property (will be updated when backend is ready)
      // Currently using a mock forestId based on tree position
      const mockForestId = tree.id <= 4 ? 1 : 2; // Mock forest assignment
      if (!filters.selectedForests.includes(mockForestId)) {
        return false;
      }
    }
    
    // Apply date range filters if specified
    if (filters.dateRange) {
      // For now, assume tree has a plantedDate property (will be updated when backend is ready)
      // Currently using a mock date based on tree ID
      const mockPlantedDate = new Date(2023, tree.id % 12, tree.id % 28 + 1); // Mock planting date
      if (mockPlantedDate < filters.dateRange.startDate || mockPlantedDate > filters.dateRange.endDate) {
        return false;
      }
    }
    
    return true;
  });

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