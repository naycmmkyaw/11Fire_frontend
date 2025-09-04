import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Icon } from "@iconify/react";
import Logo from "../assets/logo2.png";
import renderTabContent from "./RenderTab";
import useIsMobile from "../hooks/useMobile";

const AppLayout = () => {
  // Initialize with a function to get the initial tab from localStorage or default
  const [selectedTab, setSelectedTab] = useState(() => {
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab && (savedTab === 'files' || savedTab === 'profile' || savedTab === 'install' || savedTab === 'status')) {
      return savedTab;
    }
    // Default based on current path
    const currentPath = window.location.pathname;
    return currentPath === "/provider-dashboard" ? "install" : "files";
  });
  const [isProviderDashboard, setIsProviderDashboard] = useState(false);
  const isMobile = useIsMobile();

  // Check if current route is provider dashboard
  useEffect(() => {
    const currentPath = window.location.pathname;
    const isProviderRoute = currentPath === "/provider-dashboard";
    setIsProviderDashboard(isProviderRoute);

  }, []);

  // Save tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab);
  }, [selectedTab]);

  const getTabStyles = (tab: string) => ({
    bgcolor: selectedTab === tab ? "#FFF7ED" : "#EF4444",
    pl: 4,
    "&:hover": {
      bgcolor: selectedTab === tab ? "#FFF7ED" : "#e53e3e",
    },
  });

  const getIconColor = (tab: string) =>
    selectedTab === tab ? "#EF4444" : "#FFFFFF";

  const getTextColor = (tab: string) =>
    selectedTab === tab ? "#EF4444" : "#FFFFFF";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <Box
          sx={{
            width: 200,
            bgcolor: "#EF4444",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 4,
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto"
          }}
        >
        <Box
          component="img"
          src={Logo}
          alt="11Fire Logo"
          sx={{ width: 55, height: 80, mb: 1 }}
        />
        <Typography
          variant="h6"
          fontWeight={600}
          color="#000"
          gutterBottom
          mb={2}
        >
          11Fire
        </Typography>
        <List sx={{ width: "100%" }}>
          {isProviderDashboard && (
            <>
              <Box
                sx={{
                  bgcolor: selectedTab === "install" ? "#FFF7ED" : "#EF4444",
                }}
              >
                <ListItemButton
                  selected={selectedTab === "install"}
                  onClick={() => setSelectedTab("install")}
                  sx={getTabStyles("install")}
                >
                  <ListItemIcon sx={{ color: getIconColor("install") }}>
                    <Icon icon="qlementine-icons:page-setup-16" width={25} height={25} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: getTextColor("install") }}>
                        Install
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Box>

              <Box
                sx={{
                  bgcolor: selectedTab === "status" ? "#FFF7ED" : "#EF4444",
                }}
              >
                <ListItemButton
                  selected={selectedTab === "status"}
                  onClick={() => setSelectedTab("status")}
                  sx={getTabStyles("status")}
                >
                  <ListItemIcon sx={{ color: getIconColor("status") }}>
                    <Icon icon="mdi:monitor-dashboard" width={25} height={25} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: getTextColor("status") }}>
                        Status
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Box>
            </>
          )}
          <Box
            sx={{ bgcolor: selectedTab === "files" ? "#FFF7ED" : "#EF4444" }}
          >
            <ListItemButton
              selected={selectedTab === "files"}
              onClick={() => setSelectedTab("files")}
              sx={getTabStyles("files")}
            >
              <ListItemIcon sx={{ color: getIconColor("files") }}>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ color: getTextColor("files") }}>
                    Files
                  </Typography>
                }
              />
            </ListItemButton>
          </Box>

          <Box
            sx={{ bgcolor: selectedTab === "profile" ? "#FFF7ED" : "#EF4444" }}
          >
            <ListItemButton
              selected={selectedTab === "profile"}
              onClick={() => setSelectedTab("profile")}
              sx={getTabStyles("profile")}
            >
              <ListItemIcon sx={{ color: getIconColor("profile") }}>
                <AccountCircleOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ color: getTextColor("profile") }}>
                    Profile
                  </Typography>
                }
              />
            </ListItemButton>
          </Box>
        </List>
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        bgcolor: "secondary.main", 
        p: isMobile ? 2 : 4,
        overflowY: "auto",
        minHeight: "100vh",
        width: isMobile ? "100%" : "auto"
      }}>
        {renderTabContent(selectedTab, setSelectedTab, isProviderDashboard)}
      </Box>
    </Box>
  );
};

export default AppLayout;
