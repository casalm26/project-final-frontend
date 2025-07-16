import React from 'react';
import { MapHeader as StyledMapHeader, MapTitle, MapControls, ControlButton } from './ForestMap.styles';

const MapHeader = ({ onCenterMap, onFitBounds }) => {
  return (
    <StyledMapHeader>
      <MapTitle>Forest Map</MapTitle>
      <MapControls>
        <ControlButton onClick={onCenterMap} title="Center Map">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </ControlButton>
        <ControlButton onClick={onFitBounds} title="Fit to Bounds">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </ControlButton>
      </MapControls>
    </StyledMapHeader>
  );
};

export default MapHeader;