import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { theme } from "../../theme/theme";

interface HeaderProps {
  title?: string;
  avatarText?: string;
}

const Header: React.FC<HeaderProps> = ({ title, avatarText }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        {title}
      </Typography>
      <Avatar
        sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36, fontSize: "1rem" }}
      >
        {avatarText}
      </Avatar>
    </Box>
  );
};

export default Header;