import { useState, useEffect } from 'react';

const mockTrees = [
  { id: 1, name: 'Tree A-001', species: 'Pine', height: 2.4, health: 'healthy', lat: 59.3293, lng: 18.0686 },
  { id: 2, name: 'Tree A-002', species: 'Oak', height: 2.1, health: 'healthy', lat: 59.3300, lng: 18.0690 },
  { id: 3, name: 'Tree A-003', species: 'Birch', height: 1.8, health: 'warning', lat: 59.3285, lng: 18.0675 },
  { id: 4, name: 'Tree A-004', species: 'Spruce', height: 1.5, health: 'critical', lat: 59.3310, lng: 18.0700 },
  { id: 5, name: 'Tree A-005', species: 'Pine', height: 2.7, health: 'healthy', lat: 59.3275, lng: 18.0660 },
  { id: 6, name: 'Tree A-006', species: 'Oak', height: 2.3, health: 'healthy', lat: 59.3320, lng: 18.0710 },
  { id: 7, name: 'Tree A-007', species: 'Birch', height: 1.9, health: 'warning', lat: 59.3265, lng: 18.0650 },
  { id: 8, name: 'Tree A-008', species: 'Spruce', height: 2.5, health: 'healthy', lat: 59.3330, lng: 18.0720 },
];

const mockMeasurementHistory = [
  { date: '2024-01-15', height: 2.4, diameter: 8.2, health: 'healthy' },
  { date: '2024-02-15', height: 2.3, diameter: 8.1, health: 'healthy' },
  { date: '2024-03-15', height: 2.2, diameter: 8.0, health: 'healthy' },
  { date: '2024-04-15', height: 2.1, diameter: 7.9, health: 'warning' },
  { date: '2024-05-15', height: 2.0, diameter: 7.8, health: 'warning' },
  { date: '2024-06-15', height: 1.9, diameter: 7.7, health: 'warning' },
  { date: '2024-07-15', height: 1.8, diameter: 7.6, health: 'critical' },
  { date: '2024-08-15', height: 1.7, diameter: 7.5, health: 'critical' },
  { date: '2024-09-15', height: 1.6, diameter: 7.4, health: 'critical' },
  { date: '2024-10-15', height: 1.5, diameter: 7.3, health: 'critical' },
];

export const useTreeDetail = (id) => {
  const [tree, setTree] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const treeData = mockTrees.find(t => t.id === parseInt(id));
        if (!treeData) {
          setError('Tree not found');
          return;
        }
        
        setTree(treeData);
        setMeasurements(mockMeasurementHistory);
      } catch (err) {
        setError('Failed to load tree data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTreeData();
    }
  }, [id]);

  // TODO: Consider moving tree data state to Zustand store for better state management
  // This hook could fetch from API in real implementation

  return {
    tree,
    measurements,
    loading,
    error,
    trees: mockTrees // Used for navigation
  };
};