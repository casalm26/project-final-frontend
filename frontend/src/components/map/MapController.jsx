import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

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
  }, [map]);
  
  return null;
};

export default MapController;