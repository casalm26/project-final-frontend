import styled from 'styled-components';

// Common styled components for charts
export const ChartContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  height: 450px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const CustomTooltipContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

// Chart percentage display components
export const PercentageDisplay = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const PercentageValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  line-height: 1;
`;

export const PercentageLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

// Chart legend components
export const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
`;

export const LegendDot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${props => props.color};
`;

export const LegendText = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

// Helper function to format tooltip values
const formatTooltipValue = (value, valueFormatter, unit) => {
  if (valueFormatter) {
    return valueFormatter(value);
  }
  return `${value}${unit}`;
};

// Reusable tooltip component with enhanced multi-series support
export const ChartTooltip = ({ active, payload, label, valueFormatter, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-gray-600">
            {formatTooltipValue(entry.value, valueFormatter, unit)}
          </p>
        ))}
      </CustomTooltipContainer>
    );
  }
  return null;
};

// Reusable percentage display component
export const ChartPercentageDisplay = ({ value, label }) => (
  <PercentageDisplay>
    <PercentageValue>{value}%</PercentageValue>
    <PercentageLabel>{label}</PercentageLabel>
  </PercentageDisplay>
);

// Reusable chart legend component
export const ChartLegend = ({ data }) => (
  <LegendContainer>
    {data.map((item, index) => (
      <LegendItem key={index}>
        <LegendDot color={item.color} />
        <LegendText>{item.name} ({item.value}%)</LegendText>
      </LegendItem>
    ))}
  </LegendContainer>
);