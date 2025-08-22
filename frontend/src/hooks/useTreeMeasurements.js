import { useState, useEffect } from 'react';

const mockMeasurementHistory = [
  { date: '2024-01-15', height: 1.5, diameter: 7.3, health: 'healthy' },
  { date: '2024-02-15', height: 1.6, diameter: 7.4, health: 'healthy' },
  { date: '2024-03-15', height: 1.7, diameter: 7.5, health: 'healthy' },
  { date: '2024-04-15', height: 1.8, diameter: 7.6, health: 'healthy' },
  { date: '2024-05-15', height: 1.9, diameter: 7.7, health: 'healthy' },
  { date: '2024-06-15', height: 2.0, diameter: 7.8, health: 'healthy' },
  { date: '2024-07-15', height: 2.1, diameter: 7.9, health: 'healthy' },
  { date: '2024-08-15', height: 2.2, diameter: 8.0, health: 'healthy' },
  { date: '2024-09-15', height: 2.3, diameter: 8.1, health: 'healthy' },
  { date: '2024-10-15', height: 2.4, diameter: 8.2, health: 'healthy' },
];

export const useTreeMeasurements = (tree, isOpen) => {
  const [measurementHistory, setMeasurementHistory] = useState([]);

  useEffect(() => {
    if (tree && isOpen) {
      // TODO: In a real application, this would fetch from an API
      setMeasurementHistory(mockMeasurementHistory);
    }
  }, [tree, isOpen]);

  return measurementHistory;
};