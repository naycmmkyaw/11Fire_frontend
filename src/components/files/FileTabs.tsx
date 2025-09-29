import React from "react";
import { Box, Tabs, Tab, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface FileTabsProps {
  isMobile: boolean;
  activeTab: 'my-files' | 'shared-with-me';
  onTabChange: (tab: 'my-files' | 'shared-with-me') => void;
}

const FileTabs: React.FC<FileTabsProps> = ({ isMobile, activeTab, onTabChange }) => {
  const tabLabels = [
    { label: "My files", value: "my-files" as const },
    { label: "Shared with me", value: "shared-with-me" as const }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    const selectedTab = tabLabels[newValue].value;
    onTabChange(selectedTab);
  };

  const currentTabIndex = tabLabels.findIndex(tab => tab.value === activeTab);

  if (isMobile) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          sx={{ 
            '& .MuiTabs-indicator': {
              display: 'none'
            }
          }}
        >
          {tabLabels.map((tab, index) => {
            const isSelected = tab.value === activeTab;
            return (
              <Tab
                key={index}
                label={
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: isSelected ? "#EB6464" : "#000000",
                      textTransform: "none",
                      fontSize: "1.2rem",
                    }}
                  >
                    {tab.label}
                  </Typography>
                }
              />
            );
          })}
        </Tabs>
        
        <IconButton
          sx={{
            bgcolor: "#f5f5f5",
            width: 40,
            height: 40,
            color: "#666",
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Tabs
      value={currentTabIndex}
      onChange={handleTabChange}
      textColor="inherit"
      indicatorColor="primary"
      sx={{ 
        mb: 2,
        '& .MuiTabs-indicator': {
          display: 'none'
        }
      }}
    >
      {tabLabels.map((tab, index) => {
        const isSelected = tab.value === activeTab;
        return (
          <Tab
            key={index}
            label={
              <Typography
                sx={{
                  fontWeight: 500,
                  color: isSelected ? "#EB6464" : "#000000",
                  textTransform: "none",
                  fontSize: "1.2rem",
                }}
              >
                {tab.label}
              </Typography>
            }
          />
        );
      })}
    </Tabs>
  );
};

export default FileTabs;
