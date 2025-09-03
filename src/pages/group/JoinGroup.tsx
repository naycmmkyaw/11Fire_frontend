import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/shared/ActionButton";
import GroupHeader from "./GroupHeader";
import Axios from "../../services/axiosInstance";

const JoinGroup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  const checkGroupName = async (groupName: string) => {
    if (!groupName.trim()) return;
    
    setIsCheckingName(true);
    setNameError("");
    
    try {
      await Axios.post('/swarms/name-check', { name: groupName.trim() });
      setNameError("Group not found");
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.error === 'Group name already exists') {
        setNameError("");
      } else {
        setNameError("Failed to check group name");
      }
    } finally {
      setIsCheckingName(false);
    }
  };

  const checkGroupPassword = async (groupName: string, groupPassword: string) => {
    if (!groupName.trim() || !groupPassword) return;
    
    setIsCheckingPassword(true);
    setPasswordError("");
    
    try {
      await Axios.post('/swarms/password-check', { 
        name: groupName.trim(), 
        password: groupPassword 
      });
    } catch (error: any) {
      if (error.response?.data?.error) {
        setPasswordError(error.response.data.error);
      } else {
        setPasswordError("Failed to check password");
      }
    } finally {
      setIsCheckingPassword(false);
    }
  };

  // Debounced name checking - triggers 500ms after user stops typing
  useEffect(() => {
    if (name.trim()) {
      const timeoutId = setTimeout(() => {
        checkGroupName(name.trim());
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setNameError("");
    }
  }, [name]);

  // Debounced password checking - triggers 500ms after user stops typing
  useEffect(() => {
    if (password && name.trim() && !nameError) {
      const timeoutId = setTimeout(() => {
        checkGroupPassword(name.trim(), password);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else if (!password) {
      setPasswordError("");
    }
  }, [password, name, nameError]);

  const handleJoin = () => {
    setNameError("");
    setPasswordError("");
    
    let hasError = false;

    if (!name.trim()) {
      setNameError("Group name is required");
      hasError = true;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError || isCheckingName || isCheckingPassword || nameError || passwordError) return;

    navigate('/role', { 
      state: { 
        action: 'join',
        groupName: name.trim(),
        password: password 
      } 
    });
  };

  const handleNameFocus = () => {
    setNameError('');
  };

  const handlePasswordFocus = () => {
    setPasswordError('');
  };

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
      <GroupHeader />

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
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={handleNameFocus}
            variant="outlined"
            error={!!nameError}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: nameError ? 'error.main' : '#d6cfc1',
                },
                "&:hover fieldset": {
                  borderColor: nameError ? 'error.main' : 'text.primary',
                },
                "&.Mui-focused fieldset": {
                  borderColor: nameError ? 'error.main' : 'text.primary',
                  borderWidth: "1px",
                },
              },
              input: { py: 1.5 },
              mb: 0.5,
            }}
          />
          {nameError && (
            <Typography
              sx={{
                color: 'error.main',
                fontSize: '0.75rem',
                mb: 2,
                mt: 0.5,
              }}
            >
              {nameError}
            </Typography>
          )}
          {!nameError && (
            <Box sx={{ mb: 2 }} />
          )}

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={handlePasswordFocus}
            variant="outlined"
            type="password"
            error={!!passwordError}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: passwordError ? 'error.main' : '#d6cfc1',
                },
                "&:hover fieldset": {
                  borderColor: passwordError ? 'error.main' : 'text.primary',
                },
                "&.Mui-focused fieldset": {
                  borderColor: passwordError ? 'error.main' : 'text.primary',
                  borderWidth: "1px",
                },
              },
              input: { py: 1.5 },
              mb: 0.5,
            }}
          />
          {passwordError && (
            <Typography
              sx={{
                color: 'error.main',
                fontSize: '0.75rem',
                mb: 2,
                mt: 0.5,
              }}
            >
              {passwordError}
            </Typography>
          )}
          {!passwordError && (
            <Box sx={{ mb: 2 }} />
          )}

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
              onClick={handleJoin}
              disabled={!!nameError || !!passwordError}
              sx={{
                mb: 2,
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