import styled from 'styled-components';
import { useDarkMode } from '../../contexts/DarkModeContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  outline: none;
`;

const ModalContent = styled.div`
  background: ${props => props.$isDarkMode ? '#1f2937' : 'white'};
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  outline: none;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.$isDarkMode ? '#374151' : '#e5e7eb'};
  background: ${props => props.$isDarkMode ? '#111827' : '#f9fafb'};
  border-radius: 0.75rem 0.75rem 0 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  margin: 0;
`;

const CloseButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.$isDarkMode ? '#374151' : '#f3f4f6'};
    color: ${props => props.$isDarkMode ? '#f9fafb' : '#111827'};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const Modal = ({ isOpen, onClose, title, children, containerRef }) => {
  const { isDarkMode } = useDarkMode();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick} role="presentation">
      <ModalContent ref={containerRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex="-1" $isDarkMode={isDarkMode}>
        <ModalHeader $isDarkMode={isDarkMode}>
          <ModalTitle id="modal-title" $isDarkMode={isDarkMode}>{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close modal" type="button" $isDarkMode={isDarkMode}>
            <CloseIcon />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};