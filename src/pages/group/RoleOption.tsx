import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/shared/ActionButton";
import GroupHeader from "./GroupHeader";
// import { selectRole } from "../api/swarm";

const RoleOption = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: 'secondary.main',
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <GroupHeader />

      {/* Main Content */}
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
            mt: -15,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              mb: 4,
              color: 'text.primary',
              textAlign: "center",
            }}
          >
            Store or Contribute
            <Box component="span" display="block">
              Storage Space
            </Box>
          </Typography>

          <ActionButton
            variant="primary"
            sx={{ mb: 2 }}
            onClick={() => navigate("/files")}
          >
            Store Data
          </ActionButton>

          <ActionButton
            variant="primary"
            onClick={() => navigate("/provider-dashboard")}
          >
            Provide Storage
          </ActionButton>
        </Box>
      </Box>
    </Box>
  );
};

export default RoleOption;