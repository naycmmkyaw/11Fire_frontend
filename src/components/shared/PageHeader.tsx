import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

interface PageHeaderProps {
  title: string;
  avatarText: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, avatarText }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#000000" }}>
        {title}
      </Typography>
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          width: 32,
          height: 32,
          fontSize: "0.875rem",
        }}
      >
        {avatarText}
      </Avatar>
    </Box>
  );
};

export default PageHeader;
