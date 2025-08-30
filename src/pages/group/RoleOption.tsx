import React, { useState } from "react";
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ActionButton from "../../components/shared/ActionButton";
import GroupHeader from "./GroupHeader";
import Axios from "../../services/axiosInstance";

interface LocationState {
  action: 'create' | 'join';
  groupName: string;
  password: string;
}

const RoleOption = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if no state is provided
  if (!state || !state.groupName || !state.password) {
    navigate('/group');
    return null;
  }
  
  const handleStoreData = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const payload = {
        name: state.groupName,
        password: state.password,
        role: 'user'
      };

      if (state.action === 'create') {
        await Axios.post('/swarms/create', payload);
      } else {
        await Axios.post('/swarms/join', payload);
      }
      // Navigate and reset the entire history stack
      navigate("/files", { replace: true, state: { clearHistory: true } });
    } catch (error: any) {
      console.error('Error:', error);
      
      // Handle backend error response
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError(`Failed to ${state.action} group. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvideStorage = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const payload = {
        name: state.groupName,
        password: state.password,
        role: 'provider'
      };

      if (state.action === 'create') {
        await Axios.post('/swarms/create', payload);
      } else {
        await Axios.post('/swarms/join', payload);
      }

      navigate("/provider-dashboard", { replace: true, state: { clearHistory: true } });
    } catch (error: any) {
      console.error('Error:', error);
      
      // Handle backend error response
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError(`Failed to ${state.action} group. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
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
            How would you like to
            <Box component="span" display="block">
              continue in {state.groupName}?
            </Box>
          </Typography>

          <ActionButton
            variant="primary"
            sx={{ mb: 2 }}
            onClick={handleStoreData}
            disabled={isLoading}
          >
            Store Data
          </ActionButton>

          <ActionButton
            variant="primary"
            onClick={handleProvideStorage}
            disabled={isLoading}
          >
            Provide Storage
          </ActionButton>
          
          {error && (
            <Typography
              sx={{
                color: 'error.main',
                fontSize: '0.875rem',
                textAlign: 'center',
                maxWidth: 300,
              }}
            >
              {error}
            </Typography>
          )}

        </Box>
      </Box>

      {/* Loading Overlay */}
      <Backdrop
        sx={{
          color: 'primary.main',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
        }}
        open={isLoading}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" size={60} />
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 500,
            }}
          >
            'Setting up...'
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default RoleOption;