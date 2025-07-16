import styled from 'styled-components';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useTreeMeasurements } from '../../hooks/useTreeMeasurements';
import { useTreeShare } from '../../hooks/useTreeShare';
import { Modal } from './Modal';
import { TreeBasicInfo } from './TreeBasicInfo';
import { TreeLocationInfo } from './TreeLocationInfo';
import { TreeMeasurementHistory } from './TreeMeasurementHistory';
import { ImageGallery } from './ImageGallery';
import { TreeActionButtons } from './TreeActionButtons';

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

export const TreeDetailModal = ({ tree, isOpen, onClose }) => {
  // TODO: Consider moving modal state to Zustand store for better state management
  const { containerRef } = useKeyboardNavigation({
    onEscape: onClose,
    trapFocus: true,
    autoFocus: true,
  });

  const measurementHistory = useTreeMeasurements(tree, isOpen);
  const handleShare = useTreeShare(tree);

  if (!tree) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tree.name}
      containerRef={containerRef}
    >
      <InfoGrid>
        <TreeBasicInfo tree={tree} />
        <TreeLocationInfo tree={tree} />
      </InfoGrid>

      <TreeMeasurementHistory measurementHistory={measurementHistory} />

      <Section>
        <SectionTitle>Tree Images</SectionTitle>
        <ImageGallery />
      </Section>

      <TreeActionButtons tree={tree} onShare={handleShare} />
    </Modal>
  );
}; 