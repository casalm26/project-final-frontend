import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import styled from 'styled-components';

const ExportContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #059669;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:focus {
    outline: none;
    background: #f0fdf4;
  }
`;

const ProgressOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
`;

const ProgressSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatusMessage = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  z-index: 50;
  
  ${props => props.type === 'success' && `
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  `}
  
  ${props => props.type === 'error' && `
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`;

export const ExportButtonComponent = ({ 
  data = [], 
  fileName = 'export', 
  filters = {},
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const filteredData = data.filter(item => {
    // Apply filters here - for now using basic filtering
    if (filters.selectedForests && filters.selectedForests.length > 0) {
      const mockForestId = item.id <= 4 ? 1 : 2;
      if (!filters.selectedForests.includes(mockForestId)) {
        return false;
      }
    }
    
    if (filters.dateRange) {
      const mockDate = new Date(2023, item.id % 12, item.id % 28 + 1);
      if (mockDate < filters.dateRange.startDate || mockDate > filters.dateRange.endDate) {
        return false;
      }
    }
    
    return true;
  });

  const showStatus = (message, type) => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportCSV = async () => {
    setIsOpen(false);
    setIsExporting(true);
    
    try {
      if (onExportStart) onExportStart();
      
      // Simulate processing delay for large datasets
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Prepare data for CSV export
      const csvData = filteredData.map(item => ({
        'Tree ID': item.name,
        'Species': item.species,
        'Height (m)': item.height,
        'Health': item.health,
        'Latitude': item.lat,
        'Longitude': item.lng,
        'Forest': item.id <= 4 ? 'Forest A' : 'Forest B',
        'Export Date': new Date().toISOString().split('T')[0]
      }));
      
      // Generate CSV
      const csv = Papa.unparse(csvData);
      
      // Create and trigger download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showStatus(`CSV exported successfully (${filteredData.length} records)`, 'success');
      if (onExportComplete) onExportComplete('csv', filteredData.length);
      
    } catch (error) {
      console.error('CSV export error:', error);
      showStatus('CSV export failed', 'error');
      if (onExportError) onExportError(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportXLSX = async () => {
    setIsOpen(false);
    setIsExporting(true);
    
    try {
      if (onExportStart) onExportStart();
      
      // Simulate processing delay for large datasets
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Prepare data for XLSX export
      const xlsxData = filteredData.map(item => ({
        'Tree ID': item.name,
        'Species': item.species,
        'Height (m)': item.height,
        'Health': item.health,
        'Latitude': item.lat,
        'Longitude': item.lng,
        'Forest': item.id <= 4 ? 'Forest A' : 'Forest B',
        'Export Date': new Date().toISOString().split('T')[0]
      }));
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(xlsxData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Tree Data');
      
      // Generate and trigger download
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      showStatus(`XLSX exported successfully (${filteredData.length} records)`, 'success');
      if (onExportComplete) onExportComplete('xlsx', filteredData.length);
      
    } catch (error) {
      console.error('XLSX export error:', error);
      showStatus('XLSX export failed', 'error');
      if (onExportError) onExportError(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleToggleDropdown = () => {
    if (!isExporting) {
      setIsOpen(!isOpen);
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.export-container')) {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }

  return (
    <ExportContainer className="export-container">
      <ExportButton onClick={handleToggleDropdown} disabled={isExporting}>
        {isExporting ? (
          <>
            <ProgressSpinner />
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </ExportButton>

      {isOpen && (
        <DropdownMenu>
          <DropdownItem onClick={handleExportCSV}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <div className="font-medium">Export as CSV</div>
              <div className="text-xs text-gray-500">
                {filteredData.length} records • Comma-separated values
              </div>
            </div>
          </DropdownItem>
          <DropdownItem onClick={handleExportXLSX}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <div className="font-medium">Export as XLSX</div>
              <div className="text-xs text-gray-500">
                {filteredData.length} records • Excel spreadsheet
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      )}

      {statusMessage && (
        <StatusMessage type={statusMessage.type}>
          {statusMessage.message}
        </StatusMessage>
      )}
    </ExportContainer>
  );
}; 