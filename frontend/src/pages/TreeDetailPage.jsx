import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  TreeDetailHeader,
  TreeDetailInfo,
  TreeDetailSidebar,
  TreeDetailMeasurements,
  PageContainer,
  MainContent,
  TreeHeader,
  TreeTitle,
  TreeSubtitle,
  ContentGrid,
  MainSection
} from '../components/ui';
import { useTreeDetail } from '../hooks/useTreeDetail';
import { useTreeNavigation } from '../hooks/useTreeNavigation';
import { useTreeShare } from '../hooks/useTreeShare';
import styled from 'styled-components';

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  text-align: center;
`;

export const TreeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  // Custom hooks for data fetching and navigation
  const { tree, measurements, loading, error, trees } = useTreeDetail(id);
  const { hasPrevious, hasNext, handlePreviousTree, handleNextTree } = useTreeNavigation(id, trees);
  const handleShare = useTreeShare(tree);

  if (loading) {
    return (
      <PageContainer>
        <TreeDetailHeader 
          onPrevious={handlePreviousTree}
          onNext={handleNextTree}
          onShare={handleShare}
          hasPrevious={false}
          hasNext={false}
        />
        <MainContent>
          <LoadingSpinner text="Loading tree details..." />
        </MainContent>
      </PageContainer>
    );
  }

  if (error || !tree) {
    return (
      <PageContainer>
        <TreeDetailHeader 
          onPrevious={handlePreviousTree}
          onNext={handleNextTree}
          onShare={handleShare}
          hasPrevious={false}
          hasNext={false}
        />
        <MainContent>
          <ErrorMessage>
            {error || 'Tree not found'}
          </ErrorMessage>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TreeDetailHeader 
        onPrevious={handlePreviousTree}
        onNext={handleNextTree}
        onShare={handleShare}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />

      <MainContent>
        <TreeHeader>
          <TreeTitle>{tree.name}</TreeTitle>
          <TreeSubtitle>{tree.species} • Forest {tree.id <= 4 ? 'A' : 'B'}</TreeSubtitle>
        </TreeHeader>

        <ContentGrid>
          <MainSection>
            <TreeDetailInfo tree={tree} />
            <TreeDetailMeasurements measurements={measurements} />
          </MainSection>

          <TreeDetailSidebar tree={tree} />
        </ContentGrid>
      </MainContent>
    </PageContainer>
  );
}; 