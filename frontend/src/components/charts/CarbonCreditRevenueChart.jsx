import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../lib/api';

export const CarbonCreditRevenueChart = ({ filters = {}, chartType = 'line' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats to get carbon credit data
        const response = await dashboardAPI.getStats(filters);
        const stats = response.data;
        
        // Create time-series revenue data
        // In a real implementation, this would be historical data from the database
        const currentYear = new Date().getFullYear();
        const carbonData = stats?.investor?.carbonCredits;
        
        // Generate quarterly revenue data based on current carbon credits
        const baseRevenue = (carbonData?.totalSold || 0) * (carbonData?.averagePrice || 0);
        const mockRevenueData = [];
        
        for (let year = currentYear - 2; year <= currentYear; year++) {
          for (let quarter = 1; quarter <= 4; quarter++) {
            // Simulate realistic revenue growth over time
            const growthFactor = ((year - (currentYear - 2)) * 4 + quarter) / 12;
            const seasonalVariation = Math.sin((quarter - 1) * Math.PI / 2) * 0.2 + 0.8;
            const randomVariation = Math.random() * 0.3 + 0.85;
            
            const revenue = baseRevenue * growthFactor * seasonalVariation * randomVariation;
            const creditsTraded = Math.floor((carbonData?.totalSold || 100) * growthFactor * randomVariation / 3);
            const avgPrice = revenue / (creditsTraded || 1);
            
            mockRevenueData.push({
              period: `${year} Q${quarter}`,
              year,
              quarter,
              revenue: Math.round(revenue),
              creditsTraded,
              averagePrice: Math.round(avgPrice * 100) / 100,
              cumulativeRevenue: mockRevenueData.reduce((sum, item) => sum + item.revenue, revenue)
            });
          }
        }
        
        setData(mockRevenueData);
      } catch (err) {
        console.error('Error fetching carbon credit revenue data:', err);
        setError(err.message || 'Failed to load revenue data');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [filters]);

  const formatCurrency = (value) => {
    if (!value) return '0 SEK';
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  const formatLargeCurrency = (value) => {
    if (!value) return '0 SEK';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M SEK`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K SEK`;
    }
    return formatCurrency(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-600 dark:text-green-400">
              Revenue: {formatLargeCurrency(data.revenue)}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Credits Traded: {data.creditsTraded.toLocaleString()}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Avg Price: {formatCurrency(data.averagePrice)}/credit
            </p>
            {chartType === 'line' && data.cumulativeRevenue && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Cumulative: {formatLargeCurrency(data.cumulativeRevenue)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Carbon Credit Revenue Trends</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading revenue data..." />
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Carbon Credit Revenue Trends</ChartTitle>
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
          <ChartTitle>Carbon Credit Revenue Trends</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <p className="text-gray-500">No revenue data available</p>
        </div>
      </ChartContainer>
    );
  }

  if (chartType === 'bar') {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Carbon Credit Revenue by Quarter</ChartTitle>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="period" 
              className="text-xs"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={formatLargeCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="revenue" 
              fill="#10b981" 
              name="Revenue (SEK)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Carbon Credit Revenue Trends</ChartTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Quarterly revenue from carbon credit sales
        </p>
      </ChartHeader>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="period" 
            className="text-xs"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatLargeCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#10b981" 
            strokeWidth={3}
            name="Quarterly Revenue"
            dot={{ r: 4, fill: '#10b981' }}
          />
          <Line 
            type="monotone" 
            dataKey="averagePrice" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Average Price/Credit"
            dot={{ r: 3, fill: '#3b82f6' }}
            yAxisId="price"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CarbonCreditRevenueChart;