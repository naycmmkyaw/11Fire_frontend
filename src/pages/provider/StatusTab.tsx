import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import UptimeGraph from "../../components/statusTab/UptimeGraph";
import StorageCard from "../../components/statusTab/StorageCard";
import ConnectionStatusCard from "../../components/statusTab/ConnectionStatusCard";
import ResponsiveHeader from "../../components/shared/ResponsiveHeader";
import MetricsGrid from "../../components/statusTab/MetricsGrid";
import MetricCard from "../../components/statusTab/MetricCard";

interface StatusTabProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
  onTabChange?: (tab: string) => void;
}

const StatusTab: React.FC<StatusTabProps> = ({ 
  selectedTab, 
  setSelectedTab, 
  isProviderDashboard, 
  onTabChange 
}) => {
  // State to track connection status
  const [isConnected] = useState(true);

  // State for storage values
  const [totalStorage, setTotalStorage] = useState("0.00 B");
  const [remainingStorage, setRemainingStorage] = useState("0.0 B");
  const [usedStorage, setUsedStorage] = useState(0);

  // Function to update storage usage (for demonstration)
  const updateStorageUsage = () => {
    if (totalStorage !== "0.00 B" && usedStorage > 0) {
      const newUsedPercentage = Math.min(usedStorage + Math.random() * 5, 95);
      setUsedStorage(Math.round(newUsedPercentage));

      const totalGB = parseFloat(totalStorage.replace(/[^\d.]/g, ""));
      const usedGB = (totalGB * newUsedPercentage) / 100;
      const remainingGB = totalGB - usedGB;
      setRemainingStorage(`${remainingGB.toFixed(1)} GB`);
    }
  };



  const handleSetupClick = () => {
    if (onTabChange) {
      onTabChange("install");
    }
  };

  const handleStorageUpdate = (newStorage: string) => {
    setTotalStorage(newStorage);
    const usedPercentage = Math.floor(Math.random() * 30) + 10;
    setUsedStorage(usedPercentage);

    const totalGB = parseFloat(newStorage.replace(/[^\d.]/g, ""));
    const usedGB = (totalGB * usedPercentage) / 100;
    const remainingGB = totalGB - usedGB;
    setRemainingStorage(`${remainingGB.toFixed(1)} GB`);
  };

  // Effect to periodically update storage usage
  useEffect(() => {
    if (totalStorage !== "0.00 B" && usedStorage > 0) {
      const interval = setInterval(updateStorageUsage, 10000);
      return () => clearInterval(interval);
    }
  }, [totalStorage, usedStorage]);



  return (
    <Box sx={{ p: 0 }}>
      <ResponsiveHeader 
        title="STATUS" 
        avatarText="N" 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
        onTabChange={onTabChange}
      />

      <ConnectionStatusCard 
        isConnected={isConnected}
        onSetupClick={handleSetupClick}
      />

      <MetricsGrid>
        <MetricCard>
          <StorageCard
            totalStorage={totalStorage}
            remainingStorage={remainingStorage}
            usedStorage={usedStorage}
            onStorageUpdate={handleStorageUpdate}
          />
        </MetricCard>

        <MetricCard>
            <UptimeGraph />
        </MetricCard>
      </MetricsGrid>
    </Box>
  );
};

export default StatusTab;
