import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CustomTooltip = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

export const AverageHeightChart = ({ 
  data = [
    { month: 'Jan', height: 1.2 },
    { month: 'Feb', height: 1.4 },
    { month: 'Mar', height: 1.6 },
    { month: 'Apr', height: 1.8 },
    { month: 'May', height: 2.0 },
    { month: 'Jun', height: 2.2 },
    { month: 'Jul', height: 2.4 },
    { month: 'Aug', height: 2.6 },
    { month: 'Sep', height: 2.8 },
    { month: 'Oct', height: 3.0 },
    { month: 'Nov', height: 3.2 },
    { month: 'Dec', height: 3.4 }
  ] 
}) => {
  const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">
            Average Height: {payload[0].value}m
          </p>
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Average Tree Height Over Time</ChartTitle>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="height" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}; 