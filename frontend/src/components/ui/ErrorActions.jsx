import React from 'react';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';

export const ErrorActions = ({ onRetry, onReload, onReportError }) => {
  return (
    <ButtonGroup className="flex gap-4 justify-center flex-wrap">
      <Button onClick={onRetry} variant="primary">
        Try Again
      </Button>
      <Button onClick={onReload} variant="secondary">
        Refresh Page
      </Button>
      <Button onClick={onReportError} variant="secondary">
        Report Error
      </Button>
    </ButtonGroup>
  );
};