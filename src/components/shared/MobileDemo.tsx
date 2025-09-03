import React, { useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import ResponsiveHeader from "./ResponsiveHeader";
import useIsMobile from "../../hooks/useMobile";

const MobileDemo: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("status");
  const isMobile = useIsMobile();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const getTabContent = () => {
    switch (currentTab) {
      case "status":
        return "Status Tab Content - Connection and metrics information";
      case "files":
        return "Files Tab Content - File management and storage";
      case "install":
        return "Install Tab Content - Installation instructions";
      case "profile":
        return "Profile Tab Content - User profile and settings";
      default:
        return "Select a tab from the sidebar";
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FFFAF4" }}>
      <ResponsiveHeader
        title="STATUS"
        onTabChange={handleTabChange}
      />

      <Box sx={{ p: 3 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            bgcolor: "#FFFFFF",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#000000" }}>
            Current Tab: {currentTab.toUpperCase()}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: "#6b7280" }}>
            {getTabContent()}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 1 }}>
              Device Info:
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Is Mobile: {isMobile ? "Yes" : "No"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Screen Width: {window.innerWidth}px
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Screen Height: {window.innerHeight}px
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            {isMobile
              ? "📱 Mobile view: Use the hamburger menu to open the sidebar"
              : "💻 Desktop view: Sidebar is integrated into the header"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileDemo;
