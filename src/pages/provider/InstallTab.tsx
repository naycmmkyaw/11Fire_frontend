import React, { useState } from 'react';
import { Box, Typography, Button, Alert, Snackbar } from '@mui/material';
import ResponsiveHeader from '../../components/shared/ResponsiveHeader';
import InstallationSection from '../../components/installTab/InstallationSection';
import DownloadIcon from '@mui/icons-material/Download';
import { providerNodeService } from '../../services/providerNodeService';
import { useAuth } from '../../hooks/useAuth';

interface InstallTabProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
}

const InstallTab: React.FC<InstallTabProps> = ({ 
  selectedTab, 
  setSelectedTab, 
  isProviderDashboard
}) => {
  const [kuboTabValue, setKuboTabValue] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleKuboTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setKuboTabValue(newValue);
  };

  const downloadProviderToken = async () => {
    try {
      setIsDownloading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!user) {
        setError('You must be logged in to download the provider token. Please sign in first.');
        return;
      }
      
      // Call the API to get the provider claim token
      const response = await providerNodeService.mintProviderClaimToken();
      
      // Create the file content with the token
      const fileContent = response.token;
      
      // Create a blob and download the file
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'provider.token';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error: unknown) {
      console.error('Failed to download provider token:', error);
      
      // Provide user-friendly error messages
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        setError('Authentication failed. Please sign in again to download the provider token.');
      } else if (axiosError.response?.status === 403) {
        setError('You do not have permission to download the provider token.');
      } else if (axiosError.response?.status && axiosError.response.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to download provider token. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Installation data for Kubo
  const kuboInstallationData = {
    windows: {
      download: "wget https://dist.ipfs.tech/kubo/v0.36.0/kubo_v0.36.0_windows-amd64.zip -Outfile kubo_v0.36.0_windows-amd64.zip",
      extract: "Expand-Archive -Path kubo_v0.36.0_windows-amd64.zip -DestinationPath .",
      navigate: "cd kubo",
      run: ".\\ipfs.exe --version"
    },
    macos: {
      download: "curl -O https://dist.ipfs.tech/kubo/v0.36.0/kubo_v0.36.0_darwin-amd64.tar.gz",
      extract: "tar -xzf kubo_v0.36.0_darwin-amd64.tar.gz",
      navigate: "cd kubo",
      run: "./ipfs --version"
    },
    linux: {
      download: "wget https://dist.ipfs.tech/kubo/v0.36.0/kubo_v0.36.0_linux-amd64.tar.gz",
      extract: "tar -xzf kubo_v0.36.0_linux-amd64.tar.gz",
      navigate: "cd kubo",
      run: "./ipfs --version"
    }
  };

  return (
    <Box>
      <ResponsiveHeader 
        title="INSTALL" 
        avatarText="N" 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
      />

      <InstallationSection
        title="Kubo Installation"
        description="For installation instructions for your operating system, select the appropriate tab."
        tabValue={kuboTabValue}
        onTabChange={handleKuboTabChange}
        installationData={kuboInstallationData}
        showDistLink={true}
      />

      {/* 11Fire Binary Download Section */}
      <Box sx={{ mb: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: "#000000", 
              mb: 1,
              fontSize: '1.5rem',
              letterSpacing: '-0.025em'
            }}
          >
            11 Fire Binary Download Guide
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#6B7280", 
              mb: 0,
              fontSize: '1rem',
              lineHeight: 1.5,
              maxWidth: '600px'
            }}
          >
            Download the 11Fire binary for your system. The binary is automatically optimized for your operating system and architecture.
          </Typography>
        </Box>
        
        {/* Download Card */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 5,
          bgcolor: "secondary.main",
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          minHeight: "280px",
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Icon and Description */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 4,
            textAlign: 'center'
          }}>
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: "#000000", 
                mb: 1,
                fontSize: '1.125rem'
              }}
            >
              Ready to Download
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#000000", 
                maxWidth: '400px',
                lineHeight: 1.5,
                opacity: 0.8
              }}
            >
              Click the button below to download the latest version of 11Fire binary for your system
            </Typography>
          </Box>
          
          {/* Download Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            {/* Download Token Button */}
            <Button
              variant="contained"
              startIcon={<DownloadIcon sx={{ fontSize: 20 }} />}
              onClick={downloadProviderToken}
              disabled={isDownloading || !user}
              sx={{
                bgcolor: '#EF4444',
                color: 'white',
                px: 6,
                py: 2.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.125rem',
                minWidth: '240px',
                height: '56px',
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

            {/* Download Binary Button */}
            <Button
              variant="contained"
              startIcon={<DownloadIcon sx={{ fontSize: 20 }} />}
              onClick={() => window.open('https://example.com/11fire-binary', '_blank')}
              sx={{
                bgcolor: '#EF4444',
                color: 'white',
                px: 6,
                py: 2.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.125rem',
                minWidth: '240px',
                height: '56px',
                boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2), 0 2px 4px -1px rgba(239, 68, 68, 0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: '#DC2626',
                  boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3), 0 4px 6px -2px rgba(239, 68, 68, 0.2)',
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              Download 11Fire Binary
            </Button>
          </Box>
          
          {/* Additional Info */}
          <Box sx={{ 
            mt: 4, 
            textAlign: 'center',
            opacity: 0.7
          }}>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: "#000000",
                fontSize: '0.75rem'
              }}
            >
              Compatible with Windows, macOS, and Linux
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstallTab;
