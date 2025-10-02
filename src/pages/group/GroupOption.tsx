// import React from "react";
import { Box, Typography, } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/shared/ActionButton";
import GroupHeader from "./GroupHeader";

const GroupOption = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        bgcolor: 'secondary.main',
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <GroupHeader />

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
            sx={{ mb: 4, color: 'text.primary' }}
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