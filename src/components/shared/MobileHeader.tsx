import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

import MobileSidebar from "./MobileSidebar";
import Logo from "../../assets/logo4.svg";

interface MobileHeaderProps {
  title?: string;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
  onTabChange?: (tab: string) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = "Status",
  selectedTab,
  setSelectedTab,
  isProviderDashboard,
  onTabChange,
}) => {
  return (
    <Box>
      {/* Main Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "secondary.dark",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        {/* Left: Hamburger Menu + Logo + Title */}
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
          <MobileSidebar
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            isProviderDashboard={isProviderDashboard}
            onTabChange={onTabChange}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginBottom: "8px",
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="11Fire Logo"
              sx={{ width: 24, height: 35 }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#000000",
                fontSize: "1.2rem",
                marginTop: "8px",
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        {/* Right: Avatar */}
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 32,
            height: 32,
            fontSize: "0.875rem",
            color: "#ffffff",
          }}
        >
          N
        </Avatar>
      </Box>
    </Box>
  );
};

export default MobileHeader;
