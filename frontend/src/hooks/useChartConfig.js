import { useMemo } from 'react';

export const useChartConfig = (chartType = 'line') => {
  const config = useMemo(() => {
    const baseConfig = {
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
      gridProps: {
        strokeDasharray: "3 3",
        stroke: "#f3f4f6"
      },
      axisProps: {
        stroke: "#6b7280",
        fontSize: 12
      }
    };

    const typeSpecificConfig = {
      line: {
        strokeWidth: 3,
        dot: { strokeWidth: 2, r: 4 },
        activeDot: { r: 6, strokeWidth: 2 }
      },
      bar: {
        radius: [4, 4, 0, 0]
      },
      pie: {
        innerRadius: 60,
        outerRadius: 80,
        paddingAngle: 5
      }
    };

    return {
      ...baseConfig,
      ...typeSpecificConfig[chartType]
    };
  }, [chartType]);

  return config;
};