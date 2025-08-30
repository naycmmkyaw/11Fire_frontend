import React from "react";
import { Box, Tabs, Tab, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface FileTabsProps {
  isMobile: boolean;
}

const FileTabs: React.FC<FileTabsProps> = ({ isMobile }) => {
  const tabLabels = [
    { label: "My files", color: "#ef4444" },
    { label: "Shared with me", color: "#000" }
  ];

  if (isMobile) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Tabs
          value={0}
          textColor="inherit"
          indicatorColor="primary"
          sx={{ 
            '& .MuiTabs-indicator': {
              display: 'none'
            }
          }}
        >
          {tabLabels.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: tab.color,
                    textTransform: "none",
                    fontSize: "1.2rem",
                  }}
                >
                  {tab.label}
                </Typography>
              }
            />
          ))}
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
      value={0}
      textColor="inherit"
      indicatorColor="primary"
      sx={{ mb: 2 }}
    >
      {tabLabels.map((tab, index) => (
        <Tab
          key={index}
          label={
            <Typography
              sx={{
                fontWeight: 500,
                color: tab.color,
                textTransform: "none",
                fontSize: "1.2rem",
              }}
            >
              {tab.label}
            </Typography>
          }
        />
      ))}
    </Tabs>
  );
};

export default FileTabs;
