import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/shared/ActionButton";
import GroupHeader from "./GroupHeader";
// import { joinSwarm } from "../api/swarm";

const JoinGroup = () => {
  const navigate = useNavigate();
  const [swarmId, setSwarmId] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  // const handleJoin = async () => {
  //   setError("");
  //   if (!swarmId || !password || password.length < 8) {
  //     setError("Please enter valid swarm ID and a password (min 8 characters)");
  //     return;
  //   }
  //   try {
  //   //   await joinSwarm(swarmId, password);
  //   //   alert(`Joined swarm successfully!\nSwarm ID: ${swarmId}`);
  //   //   localStorage.setItem("swarmId", swarmId);
  //     navigate("/user-option");
  //   } catch (err) {
  //     setError("Join failed. Please check swarm ID and password.");
  //   }
  // };

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

      {/* Form Section */}
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
            width: 360,
            display: "flex",
            flexDirection: "column",
            mt: -15,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              mb: 4,
              textAlign: "center",
              color: 'text.primary',
            }}
          >
            Join Group
          </Typography>

          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: 'text.primary',
              mb: 1,
            }}
          >
            Group Name
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter name" // or "Enter passcode"
            value={swarmId} // or password
            onChange={(e) => setSwarmId(e.target.value)} // or setPassword
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: '#d6cfc1',
                },
                "&:hover fieldset": {
                  borderColor: 'text.primary',
                },
                "&.Mui-focused fieldset": {
                  borderColor: 'text.primary',
                  borderWidth: "1px",
                },
              },
              input: { py: 1.5 },
              mb: 2,
            }}
          />

          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: 'text.primary',
              mb: 1,
            }}
          >
            Group Passcode
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter passcode"
            value={password} // or password
            onChange={(e) => setPassword(e.target.value)} // or setPassword
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: '#d6cfc1',
                },
                "&:hover fieldset": {
                  borderColor: 'text.primary',
                },
                "&.Mui-focused fieldset": {
                  borderColor: 'text.primary', // ✅ Keep border visible on focus
                  borderWidth: "1px",
                },
              },
              input: { py: 1.5 },
              mb: 2,
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <ActionButton
              variant="primary"
              onClick={() => navigate("/role")}
              sx={{
                mb: 2, // vertical spacing
              }}
            >
              Join
            </ActionButton>

            <ActionButton
              variant="secondary"
              onClick={() => navigate("/group")}
            >
              Cancel
            </ActionButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JoinGroup;