import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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

const PercentageDisplay = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const PercentageValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  line-height: 1;
`;

const PercentageLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const CustomTooltip = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

export const SurvivalRateChart = ({ data = { survived: 95.2, lost: 4.8 } }) => {
  const chartData = [
    { name: 'Survived', value: data.survived, color: '#10b981' },
    { name: 'Lost', value: data.lost, color: '#ef4444' }
  ];

  const CustomTooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value}%</p>
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Tree Survival Rate</ChartTitle>
      </ChartHeader>
      
      <PercentageDisplay>
        <PercentageValue>{data.survived}%</PercentageValue>
        <PercentageLabel>Survival Rate</PercentageLabel>
      </PercentageDisplay>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Survived ({data.survived}%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Lost ({data.lost}%)</span>
        </div>
      </div>
    </ChartContainer>
  );
}; 