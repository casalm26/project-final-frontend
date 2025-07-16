import { InfoCard, InfoCardItem } from './InfoCard';
import { HealthBadge } from './HealthBadge';

export const TreeBasicInfo = ({ tree }) => (
  <InfoCard title="Basic Information">
    <InfoCardItem label="Tree ID">
      {tree.name}
    </InfoCardItem>
    <InfoCardItem label="Species">
      {tree.species}
    </InfoCardItem>
    <InfoCardItem label="Current Height">
      {tree.height}m
    </InfoCardItem>
    <InfoCardItem label="Health Status">
      <HealthBadge health={tree.health}>{tree.health}</HealthBadge>
    </InfoCardItem>
    <InfoCardItem label="Planted Date">
      March 15, 2023
    </InfoCardItem>
  </InfoCard>
);