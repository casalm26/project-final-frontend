import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

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

export default MapLoadingHandler;