import React from 'react';
import { Tab } from '@mui/material';

interface OSTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const OSTab: React.FC<OSTabProps> = ({ label, isActive, onClick }) => (
  <Tab 
    label={label} 
    onClick={onClick}
    sx={{
      color: isActive ? '#EB6464' : '#000000',
      textTransform: 'none' as const,
      minHeight: 'auto',
      padding: '6px 16px',
      borderRadius: '6px',
      bgcolor: 'transparent',
      '&:hover': {
        bgcolor: 'transparent'
      }
    }}
  />
);

export default OSTab;
