import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InstallationCard from './InstallationCard';
import InstallationContent from './InstallationContent';

interface InstallationSectionProps {
  title: string;
  description: string;
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  installationData: {
    windows: {
      download: string;
      extract: string;
      navigate: string;
      run: string;
    };
    macos: {
      download: string;
      extract: string;
      navigate: string;
      run: string;
    };
    linux: {
      download: string;
      extract: string;
      navigate: string;
      run: string;
    };
  };
  showDistLink?: boolean;
}

const InstallationSection: React.FC<InstallationSectionProps> = ({
  title,
  description,
  tabValue,
  onTabChange,
  installationData,
  showDistLink = false
}) => (
  <Box sx={{ mb: 4 }}>
    {showDistLink && (
      <Typography variant="body1" sx={{ mb: 2 }}>
        This section describes how to download and install the official Kubo binary from{' '}
        <Link 
          href="https://dist.ipfs.tech" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ 
            bgcolor: '#FFF7ED', 
            px: 1, 
            py: 0.5, 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          dist.ipfs.tech
          <OpenInNewIcon fontSize="small" />
        </Link>
        {' '}on Windows, MacOS, and Linux operating systems.
      </Typography>
    )}
    
    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
      {description}
    </Typography>

    <InstallationCard title={title} tabValue={tabValue} onTabChange={onTabChange}>
      {tabValue === 0 && <InstallationContent data={installationData.windows} osName="Windows" />}
      {tabValue === 1 && <InstallationContent data={installationData.macos} osName="MacOS" />}
      {tabValue === 2 && <InstallationContent data={installationData.linux} osName="Linux" />}
    </InstallationCard>
  </Box>
);

export default InstallationSection;
