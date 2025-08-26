import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../lib/api';

export const ForestValueAppreciationChart = ({ filters = {}, dashboardData = null }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!dashboardData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If dashboard data is provided, use it directly
    if (dashboardData?.charts?.forestValue) {
      setData(dashboardData.charts.forestValue.chartData);
      setLoading(false);
      return;
    }

    const fetchValueData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats which now includes investor metrics
        const response = await dashboardAPI.getStats(filters);
        const stats = response.data;
        
        // Create mock time series data for demonstration
        // In a real implementation, you'd have historical value tracking
        const mockData = [
          { 
            period: '2020', 
            currentValue: (stats?.investor?.portfolio?.totalCurrentValue || 0) * 0.7,
            acquisitionCost: stats?.investor?.portfolio?.totalAcquisitionCost || 0
          },
          { 
            period: '2021', 
            currentValue: (stats?.investor?.portfolio?.totalCurrentValue || 0) * 0.8,
            acquisitionCost: stats?.investor?.portfolio?.totalAcquisitionCost || 0
          },
          { 
            period: '2022', 
            currentValue: (stats?.investor?.portfolio?.totalCurrentValue || 0) * 0.9,
            acquisitionCost: stats?.investor?.portfolio?.totalAcquisitionCost || 0
          },
          { 
            period: '2023', 
            currentValue: (stats?.investor?.portfolio?.totalCurrentValue || 0) * 0.95,
            acquisitionCost: stats?.investor?.portfolio?.totalAcquisitionCost || 0
          },
          { 
            period: '2024', 
            currentValue: stats?.investor?.portfolio?.totalCurrentValue || 0,
            acquisitionCost: stats?.investor?.portfolio?.totalAcquisitionCost || 0
          }
        ];
        
        setData(mockData);
      } catch (err) {
        console.error('Error fetching forest value data:', err);
        setError(err.message || 'Failed to load forest value data');
      } finally {
        setLoading(false);
      }
    };

    if (!dashboardData) {
      fetchValueData();
    }
  }, [filters, dashboardData]);

  const formatCurrency = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{`Year: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey === 'currentValue' ? 'Current Value' : 'Acquisition Cost'}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
          {payload.length === 2 && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
              Appreciation: {formatCurrency(payload[0].value - payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Forest Value Appreciation</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading value data..." />
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Forest Value Appreciation</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading chart data</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Forest Value Appreciation</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <p className="text-gray-500">No forest value data available</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Forest Value Appreciation</ChartTitle>
      </ChartHeader>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="period" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="acquisitionCost" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="Acquisition Cost"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="currentValue" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Current Value"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ForestValueAppreciationChart;