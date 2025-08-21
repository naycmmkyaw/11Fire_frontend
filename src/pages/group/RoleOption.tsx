import React from "react";
import { Box, Button, Typography, Avatar, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
// import { selectRole } from "../api/swarm";

const RoleOption = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const buttonStyle = {
    bgcolor: theme.palette.primary.main,
    color: "white",
    borderRadius: 2,
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 500,
    width: "200px",
    height: "44px",
    "&:hover": {
      opacity: 0.9,
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: theme.palette.secondary.main,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Top Bar with Logo and Avatar */}
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
              color: theme.palette.text.primary,
              textAlign: "center",
            }}
          >
            Store or Contribute
            <Box component="span" display="block">
              Storage Space
            </Box>
          </Typography>

          <Button
            variant="contained"
            sx={{ ...buttonStyle, mb: 2 }}
            onClick={async () => {
              try {
                // const swarmId = localStorage.getItem("swarmId");
                // if (!swarmId) return alert("No Swarm ID found");
                // await selectRole(swarmId, "user");
                navigate("/files");
              } catch (err) {
                alert("Failed to select role");
              }
            }}
          >
            Use Storage
          </Button>

          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={async () => {
              try {
                // const swarmId = localStorage.getItem("swarmId");
                // if (!swarmId) return alert("No Swarm ID found");
                // await selectRole(swarmId, "provider");
                navigate("/provider-dashboard");
              } catch (err) {
                alert("Failed to select role");
              }
            }}
          >
            Provide Storage
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RoleOption;