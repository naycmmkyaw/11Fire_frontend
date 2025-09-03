import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    const { user } = useAuth();

  const getUserInitials = (name?: string): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 1);
  };

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
          bgcolor: "primary.main",
        }}
      >
        {getUserInitials(user?.name)}
      </Avatar>
    </Box>
  );
};

export default PageHeader;
