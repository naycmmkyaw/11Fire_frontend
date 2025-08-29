import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Divider 
} from "@mui/material";
import { Logout as LogoutIcon, Person as PersonIcon } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";

interface AppHeaderProps {
  /**
   * Whether to show the user avatar
   * @default true
   */
  showAvatar?: boolean;
  sx?: object;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  showAvatar = true, 
  sx = {} 
}) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /**
   * Generate user initials for avatar fallback
   * Takes the first letter of the first name only
   */
  const getUserInitials = (name?: string): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 1);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    logout();
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        py: 1.5,
        bgcolor: 'secondary.dark',
        borderBottom: '1px solid #d6cfc1',
        ...sx,
      }}
    >
      {/* Logo and Brand */}
      <Box display="flex" alignItems="center">
        <img
          src={logo}
          alt="11Fire Logo"
          style={{ width: 31, height: 50, marginRight: 8 }}
        />
        <Typography variant="h5" fontWeight={800} color="text.primary">
          11Fire
        </Typography>
      </Box>

      {/* User Avatar */}
      {showAvatar && (
        <>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            alt={user?.name || "User"}
            onClick={handleAvatarClick}
            aria-controls={open ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {getUserInitials(user?.name)}
          </Avatar>

          {/* User Menu */}
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: {
                bgcolor: 'secondary.dark',
                mt: 1,
                minWidth: 180,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                },
              },
            }}
          >
            {/* User Info */}
            <MenuItem disabled>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" fontWeight={600}>
                  {user?.name || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </ListItemText>
            </MenuItem>
            
            <Divider />
            
            {/* Sign Out */}
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default AppHeader;