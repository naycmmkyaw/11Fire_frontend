import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InstallationStep from './InstallationStep';
import type { ProviderInstructionData } from '../../data/installationInstructions';

interface ProviderContentProps {
  data: ProviderInstructionData;
  osName: string;
  onDownloadToken: () => void;
  isDownloading: boolean;
  user: any;
}

const ProviderContent: React.FC<ProviderContentProps> = ({ 
  data, 
  osName, 
  onDownloadToken, 
  isDownloading, 
  user 
}) => (
  <Box>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#EF4444', mb: 2 }}>
      {osName}
    </Typography>
    
    {/* Step 1: Download Provider Claim Token */}
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 700 }}>
        1. Download the Provider Claim Token
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: '#374151', fontSize: '0.95rem' }}>
        {data.downloadToken}
      </Typography>
      <Button
        variant="contained"
        startIcon={<DownloadIcon sx={{ fontSize: 20 }} />}
        onClick={onDownloadToken}
        disabled={isDownloading || !user}
        sx={{
          bgcolor: '#EF4444',
          color: 'white',
          px: 3,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2), 0 2px 4px -1px rgba(239, 68, 68, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: '#DC2626',
            boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -2px rgba(239, 68, 68, 0.2)',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          },
          '&:disabled': {
            bgcolor: '#9CA3AF',
            color: '#6B7280',
            boxShadow: 'none',
            transform: 'none'
          }
        }}
      >
        {isDownloading ? 'Downloading...' : !user ? 'Please Sign In' : 'Download 11Fire Token'}
      </Button>
    </Box>
    
    {/* Step 2: Download Provider Listener Binary */}
    <InstallationStep 
      stepNumber={2} 
      description="Download the Provider Listener Binary" 
      code={data.downloadBinary} 
      language="Terminal" 
    />
    
    {/* Step 3: Place the Provider Claim Token */}
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 700 }}>
        3. Place the Provider Claim Token
      </Typography>
      <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.95rem' }}>
        {data.placeToken}
      </Typography>
    </Box>
    
    {/* Step 4: Run the Provider Listener */}
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 700 }}>
        4. Run the Provider Listener
      </Typography>
      <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.95rem' }}>
        {data.runProvider}
      </Typography>
    </Box>
  </Box>
);

export default ProviderContent;
