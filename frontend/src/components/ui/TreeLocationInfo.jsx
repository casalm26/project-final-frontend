import { InfoCard, InfoCardItem } from './InfoCard';

export const TreeLocationInfo = ({ tree }) => (
  <InfoCard title="Location & Contract">
    <InfoCardItem label="Latitude">
      {tree.lat.toFixed(6)}
    </InfoCardItem>
    <InfoCardItem label="Longitude">
      {tree.lng.toFixed(6)}
    </InfoCardItem>
    <InfoCardItem label="Forest">
      Forest {tree.id <= 4 ? 'A' : 'B'}
    </InfoCardItem>
    <InfoCardItem label="Contract Status">
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
        Active
      </span>
    </InfoCardItem>
    <InfoCardItem label="Last Inspection">
      Jan 15, 2024
    </InfoCardItem>
  </InfoCard>
);