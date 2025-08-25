import React from "react";
import { Box, Typography, Avatar, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; 
import ActionButton from "../../components/ActionButton";

const GroupOption = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        bgcolor: theme.palette.secondary.main,
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 1.5,
          bgcolor: theme.palette.secondary.dark,
          borderBottom: '1px solid #d6cfc1',
        }}
      >
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
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>N</Avatar>
      </Box>

      {/* Center Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: -15, // ✅ This moves the group up
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ mb: 4, color: theme.palette.text.primary }}
          >
            Create or Join Group
          </Typography>

          <ActionButton
            variant="primary"
            sx={{ mb: 2 }}
            onClick={() => navigate("/group/create")}
          >
            Create Group
          </ActionButton>

          <ActionButton
            variant="primary"
            onClick={() => navigate("/group/join")}
          >
            Join
          </ActionButton>
        </Box>
      </Box>
    </Box>
  );
};

export default GroupOption;