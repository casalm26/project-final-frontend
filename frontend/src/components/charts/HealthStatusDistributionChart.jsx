import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useState, useEffect, useMemo } from 'react';
import { dashboardAPI } from '../../lib/api';

export const HealthStatusDistributionChart = ({ filters = {}, chartType = 'bar' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Health status color mapping
  const healthColors = useMemo(() => ({
    excellent: '#10b981', // green-500
    good: '#3b82f6',      // blue-500
    fair: '#f59e0b',      // amber-500
    poor: '#ef4444',      // red-500
    critical: '#dc2626'   // red-600
  }), []);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats which includes health distribution
        const response = await dashboardAPI.getStats(filters);
        const healthDistribution = response.data?.distributions?.health || [];
        
        // Transform the data for chart display
        const transformedData = healthDistribution.map(item => ({
          status: item._id || 'Unknown',
          count: item.count || 0,
          fill: healthColors[item._id?.toLowerCase()] || '#6b7280'
        }));

        // Sort by status priority (excellent -> critical)
        const statusOrder = ['excellent', 'good', 'fair', 'poor', 'critical'];
        transformedData.sort((a, b) => {
          const aIndex = statusOrder.indexOf(a.status.toLowerCase());
          const bIndex = statusOrder.indexOf(b.status.toLowerCase());
          return aIndex - bIndex;
        });

        setData(transformedData);
      } catch (err) {
        console.error('Error fetching health distribution data:', err);
        setError(err.message || 'Failed to load health distribution data');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [filters, healthColors]);

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {`${formatStatus(label || data.payload.status)}: ${data.value} trees`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {`${((data.value / data.payload.total) * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const totalTrees = data.payload.totalTrees || 
        data.payload.data?.reduce((sum, item) => sum + item.count, 0) || 0;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {`${formatStatus(data.payload.status)}: ${data.value} trees`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totalTrees > 0 ? `${((data.value / totalTrees) * 100).toFixed(1)}%` : '0%'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Tree Health Status Distribution</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading health data..." />
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Tree Health Status Distribution</ChartTitle>
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
          <ChartTitle>Tree Health Status Distribution</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <p className="text-gray-500">No health status data available</p>
        </div>
      </ChartContainer>
    );
  }

  // Calculate total for percentage calculations
  const totalTrees = data.reduce((sum, item) => sum + item.count, 0);
  const dataWithTotal = data.map(item => ({ ...item, total: totalTrees }));

  if (chartType === 'pie') {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Tree Health Status Distribution</ChartTitle>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ status, percent }) => 
                `${formatStatus(status)}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {dataWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Tree Health Status Distribution</ChartTitle>
      </ChartHeader>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataWithTotal} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="status" 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatStatus}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {dataWithTotal.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2" 
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatStatus(item.status)} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
};

export default HealthStatusDistributionChart;