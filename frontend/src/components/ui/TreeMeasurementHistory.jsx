import styled from 'styled-components';
import { Table, TableRow, TableHeaderCell, TableCell } from './Table';
import { HealthBadge } from './HealthBadge';
import { formatDate } from '@utils/dateUtils';

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const MeasurementTable = styled(Table)`
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: #f3f4f6;
`;

export const TreeMeasurementHistory = ({ measurementHistory }) => (
  <Section>
    <SectionTitle>Measurement History (Last 10 Entries)</SectionTitle>
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
        {measurementHistory.slice(0, 10).map((measurement, index) => (
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
  </Section>
);