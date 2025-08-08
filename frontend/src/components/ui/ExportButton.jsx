import { useState } from 'react';
import styled from 'styled-components';
import { formatDateForInput } from '@utils/dateUtils';
import { exportAPI } from '@/lib/api';

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
  color: #111827; /* ensure readable text on white in dark mode */
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
  color: #111827;
  
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
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Build export parameters (no filters applied - exports all trees)
  const buildExportParams = () => {
    // Only include export options, not filters
    // All trees in database will be exported
    return {};
  };

  const showStatus = (message, type) => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportCSV = async () => {
    setIsOpen(false);
    setIsExporting(true);
    
    try {
      if (onExportStart) onExportStart();
      
      const params = buildExportParams();
      const filename = `nanwa_trees_export_${formatDateForInput(new Date())}.csv`;
      
      await exportAPI.exportTreesCSV(params, filename);
      
      showStatus('CSV exported successfully', 'success');
      if (onExportComplete) onExportComplete('csv');
      
    } catch (error) {
      console.error('CSV export error:', error);
      showStatus(error.message || 'CSV export failed', 'error');
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
      
      const params = buildExportParams();
      const filename = `nanwa_trees_export_${formatDateForInput(new Date())}.xlsx`;
      
      await exportAPI.exportTreesXLSX(params, filename);
      
      showStatus('XLSX exported successfully', 'success');
      if (onExportComplete) onExportComplete('xlsx');
      
    } catch (error) {
      console.error('XLSX export error:', error);
      showStatus(error.message || 'XLSX export failed', 'error');
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
              <div className="text-xs">
                Comma-separated values
              </div>
            </div>
          </DropdownItem>
          <DropdownItem onClick={handleExportXLSX}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <div className="font-medium">Export as XLSX</div>
              <div className="text-xs">
                Excel spreadsheet
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