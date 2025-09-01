import React, { useState } from 'react';
import { Box } from '@mui/material';
import ResponsiveHeader from '../../components/shared/ResponsiveHeader';
import InstallationSection from '../../components/installTab/InstallationSection';

interface InstallTabProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
  onTabChange?: (tab: string) => void;
}

const InstallTab: React.FC<InstallTabProps> = ({ 
  selectedTab, 
  setSelectedTab, 
  isProviderDashboard, 
  onTabChange 
}) => {
  const [kuboTabValue, setKuboTabValue] = useState(0);
  const [fireTabValue, setFireTabValue] = useState(0);

  const handleKuboTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setKuboTabValue(newValue);
  };

  const handleFireTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setFireTabValue(newValue);
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

  // Installation data for 11Fire
  const fireInstallationData = {
    windows: {
      download: "wget https://dist.ipfs.tech/kubo/v0.34.1/kubo_v0.34.1_windows-amd64.zip -Outfile kubo_v0.34.1_windows-amd64.zip",
      extract: "Expand-Archive -Path kubo_v0.34.1_windows-amd64.zip -DestinationPath .",
      navigate: "cd kubo",
      run: ".\\11fire.exe --version"
    },
    macos: {
      download: "curl -O https://dist.ipfs.tech/kubo/v0.34.1/kubo_v0.34.1_darwin-amd64.tar.gz",
      extract: "tar -xzf kubo_v0.34.1_darwin-amd64.tar.gz",
      navigate: "cd kubo",
      run: "./11fire --version"
    },
    linux: {
      download: "wget https://dist.ipfs.tech/kubo/v0.34.1/kubo_v0.34.1_linux-amd64.tar.gz",
      extract: "tar -xzf kubo_v0.34.1_linux-amd64.tar.gz",
      navigate: "cd kubo",
      run: "./11fire --version"
    }
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
        title="Kubo Installation"
        description="For installation instructions for your operating system, select the appropriate tab."
        tabValue={kuboTabValue}
        onTabChange={handleKuboTabChange}
        installationData={kuboInstallationData}
        showDistLink={true}
      />

      <InstallationSection
        title="11Fire Installation"
        description="This section describes how to download and install the 11fire binary on Windows, MacOS, and Linux operating systems."
        tabValue={fireTabValue}
        onTabChange={handleFireTabChange}
        installationData={fireInstallationData}
        showDistLink={false}
      />
    </Box>
  );
};

export default InstallTab;
