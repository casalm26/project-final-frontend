import styled from 'styled-components';
import { Table, TableRow, TableHeaderCell, TableCell } from './Table';
import { HealthBadge } from './HealthBadge';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { formatDate } from '@utils/dateUtils';

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  margin: 0 0 1rem 0;
`;

const MeasurementTable = styled(Table)`
  border-radius: 0.5rem;
  overflow: hidden;
`;

const TableHeader = styled.thead``;

export const TreeMeasurementHistory = ({ measurementHistory }) => {
  const { isDarkMode } = useDarkMode();
  
  // Sort measurements by date in descending order (most recent first)
  const sortedMeasurements = [...measurementHistory].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return (
    <Section>
      <SectionTitle $isDarkMode={isDarkMode}>Measurement History (Last 10 Entries)</SectionTitle>
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
          {sortedMeasurements.slice(0, 10).map((measurement, index) => (
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
};