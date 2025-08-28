import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { Icon } from '@iconify/react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '../../assets/logo3.png';

interface MobileSidebarProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
  onTabChange?: (tab: string) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  selectedTab, 
  setSelectedTab, 
  isProviderDashboard, 
  onTabChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
    setIsOpen(false);
  };

  const getTabStyles = (tab: string) => ({
    bgcolor: selectedTab === tab ? "#FFF7ED" : "transparent",
    pl: 4,
    py: 2,
    "&:hover": {
      bgcolor: selectedTab === tab ? "#FFF7ED" : "#FFFAF4",
    },
  });

  const getIconColor = (tab: string) =>
    selectedTab === tab ? "#EF4444" : "#EF4444";

  const getTextColor = (tab: string) =>
    selectedTab === tab ? "#EF4444" : "#EF4444";



  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: '#FFFAF4' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          bgcolor: '#FFFAF4',
        }}
      >
        {/* Left: Logo and Branding */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={Logo}
            alt="11Fire Logo"
            sx={{ width: 40, height: 58 }}
          />
        </Box>
        
        {/* Right: Close Button */}
        <IconButton 
          onClick={handleDrawerToggle} 
          sx={{ 
            color: '#EF4444',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ width: "100%" }}>
        {isProviderDashboard && (
          <>
            {/* Install Tab */}
            <Box
              sx={{
                bgcolor: selectedTab === "install" ? "#FFF7ED" : "transparent",
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedTab === "install"}
                  onClick={() => handleTabChange("install")}
                  sx={getTabStyles("install")}
                >
                  <ListItemIcon sx={{ color: getIconColor("install"), minWidth: 40 }}>
                    <Icon icon="qlementine-icons:page-setup-16" width={25} height={25} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: getTextColor("install"), fontWeight: 500 }}>
                        Install
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Box>

            {/* Status Tab */}
            <Box
              sx={{
                bgcolor: selectedTab === "status" ? "#FFF7ED" : "transparent",
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedTab === "status"}
                  onClick={() => handleTabChange("status")}
                  sx={getTabStyles("status")}
                >
                  <ListItemIcon sx={{ color: getIconColor("status"), minWidth: 40 }}>
                    <Icon icon="mdi:monitor-dashboard" width={25} height={25} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: getTextColor("status"), fontWeight: 500 }}>
                        Status
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Box>
          </>
        )}



        {/* Files Tab */}
        <Box
          sx={{
            bgcolor: selectedTab === "files" ? "#FFF7ED" : "transparent",
          }}
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedTab === "files"}
              onClick={() => handleTabChange("files")}
              sx={getTabStyles("files")}
            >
              <ListItemIcon sx={{ color: getIconColor("files"), minWidth: 40 }}>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ color: getTextColor("files"), fontWeight: 500 }}>
                    Files
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </Box>

        {/* Profile Tab */}
        <Box
          sx={{
            bgcolor: selectedTab === "profile" ? "#FFF7ED" : "transparent",
          }}
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedTab === "profile"}
              onClick={() => handleTabChange("profile")}
              sx={getTabStyles("profile")}
            >
              <ListItemIcon sx={{ color: getIconColor("profile"), minWidth: 40 }}>
                <AccountCircleOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ color: getTextColor("profile"), fontWeight: 500 }}>
                    Profile
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </List>
    </Box>
  );

  return (
    <>
      {/* Hamburger Menu Button */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          color: '#EF4444',
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <Icon icon="lucide:square-menu" width={30} height={30} />
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default MobileSidebar;
