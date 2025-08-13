import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartHeader, ChartTitle } from '../ui/ChartComponents';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useState, useEffect, useMemo } from 'react';
import { dashboardAPI } from '../../lib/api';

export const EnvironmentalRiskMatrixChart = ({ filters = {}, chartType = 'scatter' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Risk level color mapping
  const riskColors = useMemo(() => ({
    low: '#10b981',      // green-500
    moderate: '#f59e0b',  // amber-500
    high: '#ef4444',     // red-500
    extreme: '#dc2626'   // red-600
  }), []);

  // Risk level numeric mapping for scatter plot
  const riskLevels = useMemo(() => ({
    low: 1,
    moderate: 2,
    high: 3,
    extreme: 4
  }), []);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats which includes fire risk data
        const response = await dashboardAPI.getStats(filters);
        const fireRiskData = response.data?.manager?.fireRisk?.distribution || [];
        
        if (chartType === 'scatter') {
          // Transform data for scatter plot (risk level vs area affected)
          const scatterData = fireRiskData
            .filter(item => item.riskLevel && item.totalArea > 0)
            .map((item) => ({
              x: riskLevels[item.riskLevel?.toLowerCase()] || 0,
              y: item.totalArea,
              riskLevel: item.riskLevel,
              forestCount: item.forestCount,
              fill: riskColors[item.riskLevel?.toLowerCase()] || '#6b7280',
              // Vary bubble size based on forest count
              r: Math.max(8, Math.min(20, item.forestCount * 3))
            }));
          
          setData(scatterData);
        } else {
          // Transform data for bar chart
          const barData = fireRiskData
            .filter(item => item.riskLevel)
            .map(item => ({
              riskLevel: item.riskLevel,
              forestCount: item.forestCount || 0,
              totalArea: item.totalArea || 0,
              fill: riskColors[item.riskLevel?.toLowerCase()] || '#6b7280'
            }));
          
          // Sort by risk level
          const riskOrder = ['low', 'moderate', 'high', 'extreme'];
          barData.sort((a, b) => {
            const aIndex = riskOrder.indexOf(a.riskLevel?.toLowerCase());
            const bIndex = riskOrder.indexOf(b.riskLevel?.toLowerCase());
            return aIndex - bIndex;
          });

          setData(barData);
        }
      } catch (err) {
        console.error('Error fetching environmental risk data:', err);
        setError(err.message || 'Failed to load environmental risk data');
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [filters, chartType, riskColors, riskLevels]);

  const formatRiskLevel = (level) => {
    if (typeof level === 'number') {
      const levelNames = { 1: 'Low', 2: 'Moderate', 3: 'High', 4: 'Extreme' };
      return levelNames[level] || 'Unknown';
    }
    return level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Unknown';
  };

  const formatArea = (area) => {
    return `${area.toFixed(1)} ha`;
  };

  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {`Risk Level: ${formatRiskLevel(data.riskLevel)}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {`Area: ${formatArea(data.y)}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {`Forests: ${data.forestCount}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {`Risk Level: ${formatRiskLevel(label)}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {`Forests: ${data.payload.forestCount}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {`Total Area: ${formatArea(data.payload.totalArea)}`}
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
          <ChartTitle>Environmental Risk Matrix</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <LoadingSpinner size="32px" text="Loading risk data..." />
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Environmental Risk Matrix</ChartTitle>
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
          <ChartTitle>Environmental Risk Matrix</ChartTitle>
        </ChartHeader>
        <div className="flex justify-center items-center h-72">
          <p className="text-gray-500">No environmental risk data available</p>
        </div>
      </ChartContainer>
    );
  }

  if (chartType === 'scatter') {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Environmental Risk Matrix</ChartTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Risk Level vs Affected Area (bubble size = forest count)
          </p>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              type="number"
              dataKey="x"
              domain={[0.5, 4.5]}
              ticks={[1, 2, 3, 4]}
              tickFormatter={formatRiskLevel}
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="number"
              dataKey="y"
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={formatArea}
            />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter data={data} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center mt-4 gap-4">
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {level}
              </span>
            </div>
          ))}
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Fire Risk Distribution</ChartTitle>
      </ChartHeader>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="riskLevel" 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={formatRiskLevel}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<BarTooltip />} />
          <Bar dataKey="forestCount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2" 
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatRiskLevel(item.riskLevel)} ({item.forestCount})
            </span>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
};

export default EnvironmentalRiskMatrixChart;