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
import API from '@lib/api';

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

const HealthBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.$status === 'excellent' ? '#d1fae5' :
    props.$status === 'good' ? '#dbeafe' :
    props.$status === 'fair' ? '#fef3c7' :
    '#fee2e2'};
  color: ${props => props.$status === 'excellent' ? '#065f46' :
    props.$status === 'good' ? '#1e3a8a' :
    props.$status === 'fair' ? '#92400e' :
    '#991b1b'};
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  const getHealthScore = (distribution) => {
    if (!distribution || distribution.length === 0) return 0;
    
    const weights = { excellent: 100, good: 75, fair: 50, poor: 25 };
    const totalWeight = distribution.reduce((sum, item) => 
      sum + (weights[item.status] || 0) * item.count, 0
    );
    const totalCount = distribution.reduce((sum, item) => sum + item.count, 0);
    
    return totalCount > 0 ? Math.round(totalWeight / totalCount) : 0;
  };

  const healthScore = getHealthScore(data.healthDistribution);
  const getHealthLevel = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  };

  return (
    <div style={{
      background: 'white',
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <p style={{ fontWeight: '600', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
        Health Score: <strong>{healthScore}</strong>
      </p>
      {data.healthDistribution && (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          <p style={{ marginBottom: '4px' }}>Distribution:</p>
          {data.healthDistribution.map(item => (
            <div key={item.status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ textTransform: 'capitalize' }}>{item.status}:</span>
              <span>{item.count} trees</span>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
        Total Measurements: {data.totalMeasurements}
      </p>
    </div>
  );
};

const ForestHealthIndexChart = ({ forestId, dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallHealth, setOverallHealth] = useState('good');

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          groupBy: 'month'
        });

        if (forestId) params.append('forestId', forestId);
        if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
        if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/charts/health-status?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch health data');
        }

        const result = await response.json();
        
        if (result.success && result.data?.chartData) {
          // Calculate health score for each period
          const processedData = result.data.chartData.map(item => {
            const healthScore = calculateHealthScore(item.healthDistribution);
            return {
              ...item,
              healthScore,
              benchmark: 75 // Industry benchmark
            };
          });

          setData(processedData);
          
          // Calculate overall health
          if (processedData.length > 0) {
            const avgScore = processedData.reduce((sum, item) => sum + item.healthScore, 0) / processedData.length;
            setOverallHealth(getHealthLevel(avgScore));
          }
        }
      } catch (err) {
        console.error('Error fetching health data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [forestId, dateRange]);

  const calculateHealthScore = (distribution) => {
    if (!distribution || distribution.length === 0) return 0;
    
    const weights = { excellent: 100, good: 75, fair: 50, poor: 25 };
    const totalWeight = distribution.reduce((sum, item) => 
      sum + (weights[item.status] || 0) * item.count, 0
    );
    const totalCount = distribution.reduce((sum, item) => sum + item.count, 0);
    
    return totalCount > 0 ? Math.round(totalWeight / totalCount) : 0;
  };

  const getHealthLevel = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  };

  if (loading) {
    return (
      <ChartContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <p>Loading health data...</p>
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <p style={{ color: '#ef4444' }}>Error: {error}</p>
        </div>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Forest Health Index</ChartTitle>
        </ChartHeader>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <p style={{ color: '#6b7280' }}>No health data available for the selected period</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Forest Health Index</ChartTitle>
        <HealthBadge $status={overallHealth}>
          Overall: {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}
        </HealthBadge>
      </ChartHeader>
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
            label={{ value: 'Health Score', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine 
            y={75} 
            stroke="#9ca3af" 
            strokeDasharray="5 5"
            label={{ value: "Industry Benchmark", position: "right" }}
          />
          <Bar 
            dataKey="healthScore" 
            fill="#10b981" 
            name="Health Score"
            radius={[8, 8, 0, 0]}
          />
          <Line 
            type="monotone" 
            dataKey="healthScore" 
            stroke="#059669" 
            strokeWidth={2}
            dot={{ fill: '#047857', r: 4 }}
            name="Trend"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ForestHealthIndexChart;