import React, { useState } from "react";
import { Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import { Logout as LogoutIcon, Person as PersonIcon } from "@mui/icons-material";
import type { User } from "../../types";

interface AvatarMenuProps {
  user: User | null;
  onLogout: () => void;
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    onLogout();
    setAnchorEl(null);
  };

  const getUserInitials = (name?: string) =>
    (name || "U")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 1);

  return (
    <>
      <Avatar
        sx={{
          bgcolor: "primary.main",
          cursor: "pointer",
          "&:hover": { opacity: 0.8 },
        }}
        alt={user?.name || "User"}
        onClick={handleAvatarClick}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {getUserInitials(user?.name)}
      </Avatar>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: {
            bgcolor: "secondary.dark",
            mt: 1,
            minWidth: 180,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1,
            },
          },
        }}
      >
        <MenuItem>
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

        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;