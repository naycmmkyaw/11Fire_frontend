import React from "react";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";
import AvatarMenu from "../../components/shared/AvatarMenu";

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
        <AvatarMenu user={user} onLogout={logout} />
      )}
    </Box>
  );
};

export default AppHeader;