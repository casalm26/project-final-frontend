import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
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
  filters = {}
}) => {
  const [zoom, setZoom] = useState(13);
  const [selectedTree, setSelectedTree] = useState(null);

  // Filter trees based on applied filters
  const filteredTrees = trees.filter(tree => {
    // TODO: Apply date and forest filters when backend is ready
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

  const centerMap = useCallback(() => {
    // TODO: Center map on selected forest or all trees
  }, []);

  const fitBounds = useCallback(() => {
    // TODO: Fit map to show all trees
  }, []);

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
          
          <MapController onZoomChange={handleZoomChange} />
          
          {filteredTrees.map(tree => (
            <Marker
              key={tree.id}
              position={[tree.lat, tree.lng]}
              icon={createTreeIcon(tree.health)}
              eventHandlers={{
                click: () => handleTreeClick(tree)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-gray-900">{tree.name}</h4>
                  <p className="text-sm text-gray-600">Species: {tree.species}</p>
                  <p className="text-sm text-gray-600">Height: {tree.height}m</p>
                  <p className="text-sm text-gray-600">Health: 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      tree.health === 'healthy' ? 'bg-green-100 text-green-800' :
                      tree.health === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tree.health}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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
            <span>Zoom level: {zoom}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 