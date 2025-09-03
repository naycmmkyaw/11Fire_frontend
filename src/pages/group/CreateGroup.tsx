import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../../components/shared/ActionButton';
import GroupHeader from './GroupHeader';
import Axios from '../../services/axiosInstance';

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const checkGroupName = async (groupName: string) => {
    if (!groupName.trim()) return;
    
    setIsCheckingName(true);
    setNameError("");
    
    try {
      await Axios.post('/swarms/name-check', { name: groupName.trim() });
      // If successful, name is available
    } catch (error: any) {
      if (error.response?.data?.error) {
        setNameError(error.response.data.error);
      } else {
        setNameError("Failed to check group name");
      }
    } finally {
      setIsCheckingName(false);
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

  const handleCreate = async () => {
    setNameError('');
    setPasswordError('');
    setRoleError('');
    setSubmitError('');
    
    let hasError = false;

    if (!name.trim()) {
      setNameError('Group name is required');
      hasError = true;
    }
    
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      hasError = true;
    }

    if (!role) {
      setRoleError('Please choose a role');
      hasError = true;
    }

    // Don't proceed if there are errors or still checking name
    if (hasError || isCheckingName || nameError) return;

    setIsSubmitting(true);

    try {
      const response = await Axios.post('/swarms/create', {
        name: name.trim(),
        password: password,
        role: role
      });

      // Navigate based on role
      if (role === 'provider') {
        navigate('/provider-dashboard', { 
          state: { 
            swarmName: response.data?.name || name.trim()
          } 
        });
      } else {
        navigate('/files', { 
          state: { 
            swarmName: response.data?.name || name.trim()
          } 
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create group';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameFocus = () => {
    setNameError('');
  };

  const handlePasswordFocus = () => {
    setPasswordError('');
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
    setRoleError('');
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
            Create Group
          </Typography>

          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: 'text.primary',
              mb: 1,
            }}
          >
            Set Group Name
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
            Set Group Passcode
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

          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              color: 'text.primary',
              mb: 1,
            }}
          >
            Choose to:
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <RadioGroup
              row
              value={role}
              onChange={handleRoleChange}
            >
              <FormControlLabel
                value="user"
                control={<Radio />}
                label="Store data"
              />
              <FormControlLabel
                value="provider"
                control={<Radio />}
                label="Provide storage"
              />
            </RadioGroup>
          </Box>
          {roleError && (
            <Typography
              sx={{
                color: 'error.main',
                fontSize: '0.75rem',
                mb: 2,
                mt: 0.5,
              }}
            >
              {roleError}
            </Typography>
          )}
          {!roleError && (
            <Box sx={{ mb: 2 }} />
          )}

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
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
              onClick={handleCreate}
              disabled={!!nameError || !!passwordError || !!roleError}
              sx={{
                mb: 2,
              }}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </ActionButton>

            <ActionButton
              variant="secondary"
              onClick={() => navigate("/group")}
              disabled={isSubmitting}
            >
              Cancel
            </ActionButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateGroup;