import React, { useState } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import ResponsiveHeader from '../../components/shared/ResponsiveHeader';
import InstallationSection from '../../components/installTab/InstallationSection';
import { providerNodeService } from '../../services/providerNodeService';
import { useAuth } from '../../hooks/useAuth';
import { installationInstructions, providerInstructions } from '../../data/installationInstructions';

interface InstallTabProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
  onTabChange?: (tab: string) => void;
}

const InstallTab: React.FC<InstallTabProps> = ({ 
  selectedTab, 
  setSelectedTab, 
  isProviderDashboard
}) => {
  const [kuboTabValue, setKuboTabValue] = useState(0);
  const [providerTabValue, setProviderTabValue] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleKuboTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setKuboTabValue(newValue);
  };

  const handleProviderTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setProviderTabValue(newValue);
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


  return (
    <Box>
      <ResponsiveHeader 
        title="INSTALL" 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
      />

      <InstallationSection
        title="11Fire IPFS Setup"
        description="Follow these steps to set up IPFS with 11Fire. Select your operating system tab below."
        tabValue={kuboTabValue}
        onTabChange={handleKuboTabChange}
        installationData={installationInstructions}
        showDistLink={false}
      />

      {/* Provider Claim Token and Binary Section */}
      <InstallationSection
        title="Provider Claim Token & Binary Setup"
        description="Download your provider token and binary to start providing services. Select your operating system tab below."
        tabValue={providerTabValue}
        onTabChange={handleProviderTabChange}
        installationData={providerInstructions}
        showDistLink={false}
        isProviderSection={true}
        onDownloadToken={downloadProviderToken}
        isDownloading={isDownloading}
        user={user}
      />

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
