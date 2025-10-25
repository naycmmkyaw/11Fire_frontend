import React from "react";
import { Box, Typography } from "@mui/material";
import MobileSidebar from "./MobileSidebar";
import Logo from "../../assets/logo4.svg";
import { useAuth } from "../../hooks/useAuth";
import AvatarMenu from "./AvatarMenu";

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
  const { user, logout } = useAuth();
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
          mb: 2,
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
        <AvatarMenu user={user} onLogout={logout} />
      </Box>
    </Box>
  );
};

export default MobileHeader;
