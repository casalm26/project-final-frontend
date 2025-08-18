import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Dot
} from 'recharts';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ChartContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const MetricsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
`;

const MetricCard = styled.div`
  flex: 1;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.$positive ? '#10b981' : props.$negative ? '#ef4444' : '#1f2937'};
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.$trend === 'up' ? '#d1fae5' :
    props.$trend === 'down' ? '#fee2e2' :
    '#f3f4f6'};
  color: ${props => props.$trend === 'up' ? '#065f46' :
    props.$trend === 'down' ? '#991b1b' :
    '#6b7280'};
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div style={{
      background: 'white',
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <p style={{ fontWeight: '600', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '14px', color: '#10b981' }}>
        Survival Rate: <strong>{data.survivalRate?.toFixed(1)}%</strong>
      </p>
      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
        Trees Planted: {data.totalPlanted}
      </p>
      <p style={{ fontSize: '12px', color: '#6b7280' }}>
        Trees Surviving: {data.surviving}
      </p>
      {data.benchmark && (
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          Benchmark: {data.benchmark}%
        </p>
      )}
    </div>
  );
};

const EnhancedSurvivalRateChart = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    currentRate: 0,
    trend: 'stable',
    trendValue: 0,
    avgRate: 0,
    benchmark: 85
  });

  useEffect(() => {
    const fetchSurvivalData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          groupBy: 'month'
        });

        if (filters?.forestId) params.append('forestId', filters.forestId);
        if (filters?.dateRange?.startDate) params.append('startDate', filters.dateRange.startDate);
        if (filters?.dateRange?.endDate) params.append('endDate', filters.dateRange.endDate);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/charts/survival-rate?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch survival rate data');
        }

        const result = await response.json();
        
        if (result.success && result.data?.chartData) {
          const chartData = result.data.chartData;
          
          // Add benchmark to each data point
          const processedData = chartData.map(item => ({
            ...item,
            benchmark: 85 // Industry standard benchmark
          }));

          setData(processedData);
          
          // Calculate metrics
          if (processedData.length > 0) {
            const currentRate = processedData[processedData.length - 1].survivalRate;
            const previousRate = processedData.length > 1 ? 
              processedData[processedData.length - 2].survivalRate : currentRate;
            const avgRate = processedData.reduce((sum, item) => sum + item.survivalRate, 0) / processedData.length;
            
            const trendValue = currentRate - previousRate;
            let trend = 'stable';
            if (trendValue > 0.5) trend = 'up';
            else if (trendValue < -0.5) trend = 'down';
            
            setMetrics({
              currentRate,
              trend,
              trendValue,
              avgRate,
              benchmark: 85
            });
          }
        }
      } catch (err) {
        console.error('Error fetching survival rate data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvivalData();
  }, [filters]);

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={16} />;
    if (trend === 'down') return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  if (loading) {
    return (
      <ChartContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p>Loading survival rate data...</p>
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p style={{ color: '#ef4444' }}>Error: {error}</p>
        </div>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Tree Survival Rate Analysis</ChartTitle>
        </ChartHeader>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p style={{ color: '#6b7280' }}>No survival data available for the selected period</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Tree Survival Rate Analysis</ChartTitle>
        <TrendIndicator $trend={metrics.trend}>
          {getTrendIcon(metrics.trend)}
          <span>{Math.abs(metrics.trendValue).toFixed(1)}%</span>
        </TrendIndicator>
      </ChartHeader>

      <MetricsRow>
        <MetricCard>
          <MetricValue $positive={metrics.currentRate >= metrics.benchmark}>
            {metrics.currentRate.toFixed(1)}%
          </MetricValue>
          <MetricLabel>Current Rate</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{metrics.avgRate.toFixed(1)}%</MetricValue>
          <MetricLabel>Average Rate</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{metrics.benchmark}%</MetricValue>
          <MetricLabel>Industry Benchmark</MetricLabel>
        </MetricCard>
      </MetricsRow>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            label={{ value: 'Survival Rate (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <ReferenceLine 
            y={85} 
            stroke="#9ca3af" 
            strokeDasharray="5 5"
            label={{ value: "Industry Benchmark (85%)", position: "right" }}
          />
          
          <Area
            type="monotone"
            dataKey="survivalRate"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            strokeWidth={2}
            name="Survival Rate"
            dot={{ fill: '#047857', r: 4 }}
          />
          
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke="#9ca3af"
            strokeDasharray="5 5"
            dot={false}
            name="Benchmark"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: metrics.currentRate >= metrics.benchmark ? '#d1fae5' : '#fef3c7',
        borderRadius: '6px',
        fontSize: '14px',
        color: metrics.currentRate >= metrics.benchmark ? '#065f46' : '#92400e'
      }}>
        {metrics.currentRate >= metrics.benchmark ? (
          <span>✓ Survival rate is above industry benchmark. Forest health is excellent.</span>
        ) : (
          <span>⚠ Survival rate is below industry benchmark. Consider investigating potential issues.</span>
        )}
      </div>
    </ChartContainer>
  );
};

export default EnhancedSurvivalRateChart;