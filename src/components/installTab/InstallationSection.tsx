import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InstallationCard from './InstallationCard';
import InstallationContent from './InstallationContent';
import ProviderContent from './ProviderContent';
import type { InstallationInstructions, ProviderInstructions } from '../../data/installationInstructions';

interface InstallationSectionProps {
  title: string;
  description: string;
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  installationData: InstallationInstructions | ProviderInstructions;
  showDistLink?: boolean;
  isProviderSection?: boolean;
  onDownloadToken?: () => void;
  isDownloading?: boolean;
  user?: unknown;
}

const InstallationSection: React.FC<InstallationSectionProps> = ({
  title,
  description,
  tabValue,
  onTabChange,
  installationData,
  showDistLink = false,
  isProviderSection = false,
  onDownloadToken,
  isDownloading = false,
  user
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
      {isProviderSection ? (
        <>
          {tabValue === 0 && (
            <ProviderContent 
              data={(installationData as ProviderInstructions).windows} 
              osName="Windows" 
              onDownloadToken={onDownloadToken!}
              isDownloading={isDownloading}
              user={user}
            />
          )}
          {tabValue === 1 && (
            <ProviderContent 
              data={(installationData as ProviderInstructions).macos} 
              osName="MacOS" 
              onDownloadToken={onDownloadToken!}
              isDownloading={isDownloading}
              user={user}
            />
          )}
          {tabValue === 2 && (
            <ProviderContent 
              data={(installationData as ProviderInstructions).linux} 
              osName="Linux" 
              onDownloadToken={onDownloadToken!}
              isDownloading={isDownloading}
              user={user}
            />
          )}
        </>
      ) : (
        <>
          {tabValue === 0 && <InstallationContent data={(installationData as InstallationInstructions).windows} osName="Windows" />}
          {tabValue === 1 && <InstallationContent data={(installationData as InstallationInstructions).macos} osName="MacOS" />}
          {tabValue === 2 && <InstallationContent data={(installationData as InstallationInstructions).linux} osName="Linux" />}
        </>
      )}
    </InstallationCard>
  </Box>
);

export default InstallationSection;
