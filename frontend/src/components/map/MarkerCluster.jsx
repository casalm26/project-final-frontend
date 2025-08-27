import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { createTreeIcon, createClusterIcon, getTreePopupContent } from '@/utils/mapIcons';

const MarkerCluster = ({ trees, onTreeClick, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !trees.length) return;
    
    // Clear prior marker layers (cluster groups and layer groups)
    map.eachLayer(layer => {
      if (layer instanceof L.MarkerClusterGroup || layer instanceof L.LayerGroup) {
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
          return createClusterIcon(count);
        }
      });
      
      // Add markers to cluster group
      trees.forEach(tree => {
        const marker = L.marker([tree.lat, tree.lng], {
          icon: createTreeIcon(tree.health)
        });
        
        marker.bindPopup(getTreePopupContent(tree));
        marker.on('click', () => onTreeClick(tree));
        clusterGroup.addLayer(marker);
      });
      
      map.addLayer(clusterGroup);
    } else {
      // For zoom >= 12, show individual markers inside a layer group
      const layerGroup = L.layerGroup();
      trees.forEach(tree => {
        const marker = L.marker([tree.lat, tree.lng], {
          icon: createTreeIcon(tree.health)
        });
        marker.bindPopup(getTreePopupContent(tree));
        marker.on('click', () => onTreeClick(tree));
        layerGroup.addLayer(marker);
      });
      layerGroup.addTo(map);
    }
    
    // Cleanup function
    return () => {
      map.eachLayer(layer => {
        if (layer instanceof L.MarkerClusterGroup || layer instanceof L.LayerGroup) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, trees, onTreeClick, zoom]);
  
  return null;
};

export default MarkerCluster;