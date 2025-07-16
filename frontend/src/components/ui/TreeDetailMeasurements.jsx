import styled from 'styled-components';
import { HealthBadge } from './HealthBadge';
import { formatDate } from '@utils/dateUtils';

const InfoCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`;

const MeasurementTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.thead`
  background: #f9fafb;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  color: #111827;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

export const TreeDetailMeasurements = ({ measurements }) => (
  <InfoCard>
    <CardTitle>Measurement History</CardTitle>
    <MeasurementTable>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Height (m)</TableHeaderCell>
          <TableHeaderCell>Diameter (cm)</TableHeaderCell>
          <TableHeaderCell>Health</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <tbody>
        {measurements.slice(0, 10).map((measurement, index) => (
          <TableRow key={index}>
            <TableCell>{formatDate(measurement.date)}</TableCell>
            <TableCell>{measurement.height}</TableCell>
            <TableCell>{measurement.diameter}</TableCell>
            <TableCell>
              <HealthBadge health={measurement.health}>{measurement.health}</HealthBadge>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </MeasurementTable>
  </InfoCard>
);