import styled from 'styled-components';
import { useDarkMode } from '../../contexts/DarkModeContext';

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageCard = styled.div`
  background: ${props => props.$isDarkMode ? '#374151' : '#f9fafb'};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid ${props => props.$isDarkMode ? '#4b5563' : '#e5e7eb'};
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100px;
  background: ${props => props.$isDarkMode ? '#4b5563' : '#e5e7eb'};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDarkMode ? '#9ca3af' : '#6b7280'};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ImageCardItem = ({ caption }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <ImageCard $isDarkMode={isDarkMode}>
      <ImagePlaceholder $isDarkMode={isDarkMode} role="img" aria-label={`${caption} placeholder image`}>
        <ImageIcon />
      </ImagePlaceholder>
      <div style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{caption}</div>
    </ImageCard>
  );
};

export const ImageGallery = () => (
  <Gallery>
    <ImageCardItem caption="Latest Photo" />
    <ImageCardItem caption="Growth Progress" />
    <ImageCardItem caption="Planting Day" />
  </Gallery>
);