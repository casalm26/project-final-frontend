import { useState, useCallback } from 'react';

export const useMapControls = () => {
  const [zoom, setZoom] = useState(13);
  const [selectedTree, setSelectedTree] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  const handleTreeClick = useCallback((tree, onTreeSelect) => {
    setSelectedTree(tree);
    if (onTreeSelect) {
      onTreeSelect(tree);
    }
  }, []);

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

  const centerMap = useCallback((filteredTrees) => {
    if (filteredTrees.length === 0) return;
    
    // Calculate center point of all filtered trees
    const totalLat = filteredTrees.reduce((sum, tree) => sum + tree.lat, 0);
    const totalLng = filteredTrees.reduce((sum, tree) => sum + tree.lng, 0);
    const centerLat = totalLat / filteredTrees.length;
    const centerLng = totalLng / filteredTrees.length;
    
    // This would need to be implemented with a map ref in a real implementation
    console.log('Center map at:', centerLat, centerLng);
  }, []);

  const fitBounds = useCallback((filteredTrees) => {
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
  }, []);

  return {
    zoom,
    selectedTree,
    mapLoading,
    mapError,
    handleTreeClick,
    handleZoomChange,
    handleMapReady,
    handleMapError,
    retryMap,
    centerMap,
    fitBounds
  };
};