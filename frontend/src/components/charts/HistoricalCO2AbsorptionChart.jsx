import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import styled from 'styled-components';
import { Calendar, TrendingUp, Target } from 'lucide-react';

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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%);
  border-radius: 8px;
  border: 1px solid #c8e6c9;
`;

const MetricCard = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #047857;
  margin-bottom: 4px;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TimeRangeButton = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${props => props.$active ? '#10b981' : '#e5e7eb'};
  background: ${props => props.$active ? '#10b981' : 'white'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #10b981;
    background: ${props => props.$active ? '#059669' : '#f0fdf4'};
  }
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
        Annual CO₂: <strong>{data.totalCO2?.toFixed(1)} tons</strong>
      </p>
      <p style={{ fontSize: '14px', color: '#059669', marginTop: '4px' }}>
        Cumulative: <strong>{data.cumulativeCO2?.toFixed(1)} tons</strong>
      </p>
      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
        Trees Planted: {data.treeCount || 'N/A'}
      </p>
      <p style={{ fontSize: '12px', color: '#6b7280' }}>
        Avg per Tree: {data.avgCO2PerTree?.toFixed(2) || 'N/A'} tons
      </p>
      {data.target && (
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          Target: {data.target} tons
        </p>
      )}
    </div>
  );
};

const HistoricalCO2AbsorptionChart = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('10Y'); // 10Y, 5Y, 3Y, 1Y
  const [metrics, setMetrics] = useState({
    totalCO2: 0,
    avgAnnual: 0,
    growthRate: 0,
    carbonCredits: 0,
    projectedNext: 0
  });

  useEffect(() => {
    const fetchCO2Data = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate date range based on selected time range
        const endDate = new Date();
        const startDate = new Date();
        
        switch(timeRange) {
          case '10Y':
            startDate.setFullYear(endDate.getFullYear() - 10);
            break;
          case '5Y':
            startDate.setFullYear(endDate.getFullYear() - 5);
            break;
          case '3Y':
            startDate.setFullYear(endDate.getFullYear() - 3);
            break;
          case '1Y':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
          default:
            startDate.setFullYear(2015); // Default to 2015 for full historical view
        }

        const params = new URLSearchParams({
          groupBy: 'year',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        });

        if (filters?.forestId) params.append('forestId', filters.forestId);
        if (filters?.species) params.append('species', filters.species);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/charts/co2-absorption?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch CO2 absorption data');
        }

        const result = await response.json();
        
        if (result.success && result.data?.chartData) {
          const chartData = result.data.chartData;
          
          // Add targets based on carbon credit goals (example: 10% annual increase)
          let baseTarget = 100; // Starting target
          const processedData = chartData.map((item, index) => {
            const target = Math.round(baseTarget * Math.pow(1.1, index));
            return {
              ...item,
              target,
              year: item.period // Ensure year is visible
            };
          });

          setData(processedData);
          
          // Calculate metrics
          if (processedData.length > 0) {
            const totalCO2 = processedData[processedData.length - 1].cumulativeCO2 || 0;
            const avgAnnual = totalCO2 / processedData.length;
            
            // Calculate growth rate
            let growthRate = 0;
            if (processedData.length > 1) {
              const firstYear = processedData[0].totalCO2 || 1;
              const lastYear = processedData[processedData.length - 1].totalCO2 || 1;
              growthRate = ((lastYear - firstYear) / firstYear) * 100;
            }
            
            // Carbon credits (assuming 1 ton CO2 = 1 credit, $20 per credit)
            const carbonCredits = Math.round(totalCO2 * 20);
            
            // Projected next year (based on average growth)
            const recentGrowth = processedData.length > 1 ? 
              processedData[processedData.length - 1].totalCO2 - processedData[processedData.length - 2].totalCO2 : 0;
            const projectedNext = processedData[processedData.length - 1].totalCO2 + recentGrowth;
            
            setMetrics({
              totalCO2,
              avgAnnual,
              growthRate,
              carbonCredits,
              projectedNext
            });
          }
        }
      } catch (err) {
        console.error('Error fetching CO2 data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCO2Data();
  }, [filters, timeRange]);

  if (loading) {
    return (
      <ChartContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p>Loading historical CO₂ data...</p>
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
          <ChartTitle>Historical CO₂ Absorption (2015-2025)</ChartTitle>
        </ChartHeader>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <p style={{ color: '#6b7280' }}>No CO₂ data available for the selected period</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} />
            Historical CO₂ Absorption Trends
          </span>
        </ChartTitle>
        <TimeRangeSelector>
          <TimeRangeButton $active={timeRange === '1Y'} onClick={() => setTimeRange('1Y')}>
            1Y
          </TimeRangeButton>
          <TimeRangeButton $active={timeRange === '3Y'} onClick={() => setTimeRange('3Y')}>
            3Y
          </TimeRangeButton>
          <TimeRangeButton $active={timeRange === '5Y'} onClick={() => setTimeRange('5Y')}>
            5Y
          </TimeRangeButton>
          <TimeRangeButton $active={timeRange === '10Y'} onClick={() => setTimeRange('10Y')}>
            10Y
          </TimeRangeButton>
        </TimeRangeSelector>
      </ChartHeader>

      <MetricsRow>
        <MetricCard>
          <MetricValue>{metrics.totalCO2.toFixed(1)}t</MetricValue>
          <MetricLabel>Total Absorbed</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{metrics.avgAnnual.toFixed(1)}t</MetricValue>
          <MetricLabel>Avg Annual</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <TrendingUp size={16} />
              {metrics.growthRate.toFixed(1)}%
            </span>
          </MetricValue>
          <MetricLabel>Growth Rate</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>${(metrics.carbonCredits / 1000).toFixed(1)}K</MetricValue>
          <MetricLabel>Carbon Credits</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Target size={16} />
              {metrics.projectedNext.toFixed(1)}t
            </span>
          </MetricValue>
          <MetricLabel>Next Year Proj.</MetricLabel>
        </MetricCard>
      </MetricsRow>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="year" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            label={{ value: 'Annual CO₂ (tons)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            tick={{ fontSize: 12 }}
            label={{ value: 'Cumulative CO₂ (tons)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Bar 
            yAxisId="left"
            dataKey="totalCO2" 
            fill="#8b5cf6" 
            name="Annual CO₂ Absorption"
            radius={[8, 8, 0, 0]}
          />
          
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="cumulativeCO2" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#047857', r: 4 }}
            name="Cumulative CO₂"
          />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="target"
            stroke="#fbbf24"
            strokeDasharray="5 5"
            dot={false}
            name="Target"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: 'linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%)',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#047857',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <TrendingUp size={16} />
        <span>
          Forest has absorbed <strong>{metrics.totalCO2.toFixed(1)} tons</strong> of CO₂ over the selected period, 
          equivalent to <strong>${(metrics.carbonCredits / 1000).toFixed(1)}K</strong> in carbon credits at current market rates.
        </span>
      </div>
    </ChartContainer>
  );
};

export default HistoricalCO2AbsorptionChart;