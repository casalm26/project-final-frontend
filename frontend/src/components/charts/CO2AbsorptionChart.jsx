import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

export const CO2AbsorptionChart = ({ 
  data = [
    { month: 'Jan', co2: 0.8 },
    { month: 'Feb', co2: 1.2 },
    { month: 'Mar', co2: 1.6 },
    { month: 'Apr', co2: 2.0 },
    { month: 'May', co2: 2.4 },
    { month: 'Jun', co2: 2.8 },
    { month: 'Jul', co2: 3.2 },
    { month: 'Aug', co2: 3.6 },
    { month: 'Sep', co2: 4.0 },
    { month: 'Oct', co2: 4.4 },
    { month: 'Nov', co2: 4.8 },
    { month: 'Dec', co2: 5.2 }
  ] 
}) => {
  const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-600">
            CO₂ Absorption: {payload[0].value} tons
          </p>
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>CO₂ Absorption Over Time</ChartTitle>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'CO₂ (tons)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltipContent />} />
          <Bar 
            dataKey="co2" 
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}; 