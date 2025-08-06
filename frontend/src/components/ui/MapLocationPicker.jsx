import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

export const MapLocationPicker = ({ 
  latitude, 
  longitude, 
  onLocationChange,
  height = '300px',
  className = '' 
}) => {
  const [position, setPosition] = useState(null);

  // Initialize position from props
  useEffect(() => {
    if (latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
      setPosition([parseFloat(latitude), parseFloat(longitude)]);
    }
  }, [latitude, longitude]);

  // Update parent when position changes
  useEffect(() => {
    if (position && onLocationChange) {
      onLocationChange({
        latitude: position[0].toString(),
        longitude: position[1].toString()
      });
    }
  }, [position, onLocationChange]);

  const handleCoordinateChange = (lat, lng) => {
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    
    if (!isNaN(numLat) && !isNaN(numLng)) {
      if (numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180) {
        setPosition([numLat, numLng]);
      }
    }
  };

  // Default center (Stockholm, Sweden)
  const defaultCenter = [59.3293, 18.0686];
  const mapCenter = position || defaultCenter;

  return (
    <div className={className}>
      {/* Coordinate Input Fields */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={position ? position[0] : latitude || ''}
            onChange={(e) => handleCoordinateChange(e.target.value, position ? position[1] : longitude)}
            className="form-input w-full"
            placeholder="e.g., 59.3293"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={position ? position[1] : longitude || ''}
            onChange={(e) => handleCoordinateChange(position ? position[0] : latitude, e.target.value)}
            className="form-input w-full"
            placeholder="e.g., 18.0686"
          />
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Click on the map to set the tree location, or enter coordinates manually above.
      </p>

      {/* Map */}
      <div 
        className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <MapContainer
          center={mapCenter}
          zoom={position ? 15 : 10}
          style={{ height: '100%', width: '100%' }}
          key={mapCenter.join(',')} // Force re-render when center changes
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* Current Location Display */}
      {position && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Selected Location:</strong> {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};