import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../lib/api';

export const MaintenanceCostAnalysisChart = ({ filters = {}, chartType = 'composed' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats to get maintenance budget data
        const response = await dashboardAPI.getStats(filters);
        const stats = response.data;
        
        const maintenanceData = stats?.investor?.maintenance;
        
        if (chartType === 'pie') {
          // Create budget breakdown pie chart data
          const totalBudget = maintenanceData?.totalBudget || 100000;
          const totalSpent = maintenanceData?.totalSpent || 0;
          const remaining = totalBudget - totalSpent;
          
          const pieData = [
            {
              name: 'Spent',
              value: totalSpent,
              fill: '#ef4444'
            },
            {
              name: 'Remaining',
              value: Math.max(0, remaining),
              fill: '#10b981'
            }
          ];
          
          if (remaining < 0) {
            pieData.push({
              name: 'Over Budget',
              value: Math.abs(remaining),
              fill: '#dc2626'
            });
          }
          
          setData(pieData);
        } else {
          // Create time-series maintenance data by forest/category
          const mockMaintenanceData = [];
          const categories = ['Equipment', 'Labor', 'Materials', 'Infrastructure', 'Emergency'];
          const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
          
          // Generate monthly data for the last 12 months
          const currentDate = new Date();
          for (let i = 11; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            
            const monthlyBudget = (maintenanceData?.totalBudget || 100000) / 12;
            const seasonalFactor = Math.sin((date.getMonth() + 3) * Math.PI / 6) * 0.3 + 1; // Higher in spring/summer
            
            let totalSpent = 0;
            const monthData = {
              period: monthName,
              budget: Math.round(monthlyBudget),
              utilization: 0
            };
            
            categories.forEach((category, index) => {
              const baseAmount = monthlyBudget * (0.1 + Math.random() * 0.3); // 10-40% of monthly budget per category
              const categorySpent = Math.round(baseAmount * seasonalFactor * (0.7 + Math.random() * 0.6));
              monthData[category.toLowerCase()] = categorySpent;
              totalSpent += categorySpent;
            });
            
            monthData.totalSpent = totalSpent;
            monthData.utilization = Math.round((totalSpent / monthlyBudget) * 100);
            monthData.efficiency = Math.round((Math.random() * 20 + 80)); // 80-100% efficiency
            
            mockMaintenanceData.push(monthData);
          }
          
          setData(mockMaintenanceData);
        }
        
      } catch (err) {
        console.error('Error fetching maintenance cost data:', err);
        setError(err.message || 'Failed to load maintenance data');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [filters, chartType]);

  const formatCurrency = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {
                  entry.name.includes('%') || entry.name === 'utilization' || entry.name === 'efficiency'
                    ? formatPercentage(entry.value)
                    : formatCurrency(entry.value)
                }
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = payload[0].payload.totalValue || data.payload.value * 2; // Estimate total
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.payload.name}: {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {((data.value / total) * 100).toFixed(1)}% of budget
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
          <ChartTitle>Maintenance Cost Analysis</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading maintenance data..." />
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Maintenance Cost Analysis</ChartTitle>
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
          <ChartTitle>Maintenance Cost Analysis</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <p className="text-gray-500">No maintenance data available</p>
        </div>
      </ChartContainer>
    );
  }

  if (chartType === 'pie') {
    const totalBudget = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Budget Utilization</ChartTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Budget: {formatCurrency(totalBudget)}
          </p>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
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
        <ChartTitle>Maintenance Costs & Budget Utilization</ChartTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monthly spend vs budget with utilization trends
        </p>
      </ChartHeader>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="period" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="cost"
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <YAxis 
            yAxisId="percent"
            orientation="right"
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatPercentage}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Budget line */}
          <Bar 
            yAxisId="cost"
            dataKey="budget" 
            fill="#e5e7eb" 
            name="Monthly Budget"
            opacity={0.6}
          />
          
          {/* Actual spending */}
          <Bar 
            yAxisId="cost"
            dataKey="totalSpent" 
            fill="#3b82f6" 
            name="Total Spent"
          />
          
          {/* Utilization percentage line */}
          <Line 
            yAxisId="percent"
            type="monotone" 
            dataKey="utilization" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Budget Utilization %"
            dot={{ r: 4, fill: '#ef4444' }}
          />
          
          {/* Efficiency line */}
          <Line 
            yAxisId="percent"
            type="monotone" 
            dataKey="efficiency" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Efficiency %"
            dot={{ r: 3, fill: '#10b981' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MaintenanceCostAnalysisChart;