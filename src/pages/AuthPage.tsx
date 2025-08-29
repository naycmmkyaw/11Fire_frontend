import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Stack,
} from '@mui/material';
import Logo from '../assets/logo.png';
import AuthButton from '../components/shared/AuthButton';

interface AuthPageProps {
  isInitialLoading?: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ isInitialLoading = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const isSignIn = location.pathname === '/auth/signin';
  const showLoading = isInitialLoading || isLoading;

  const handleMicrosoftAuth = async () => {
    if (showLoading) return; // Prevent multiple clicks

    setIsLoading(true);
    
    try {
      // Redirect to backend Microsoft OAuth endpoint
      window.location.href = `${import.meta.env.VITE_BACKEND_API_URL}/auth/login`;
    } catch (error) {
      console.error('Failed to initiate OAuth:', error);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        alignItems: 'center',
        bgcolor: 'secondary.main',
        px: 2,
      }}
    >
      <Box component="header" sx={{ py: { xs: 3, sm: 5 } }}>
        <Stack alignItems="center">
          <Box
            component="img"
            src={Logo}
            alt="11Fire logo"
            sx={{
              width: { xs: 72, sm: 80 },
              height: { xs: 72, sm: 80 },
              objectFit: "contain",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
            }}
          >
            11Fire
          </Typography>
        </Stack>
      </Box>

      {/* Main content in the middle */}
      <Box
        component="main"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xs" disableGutters>
          <Stack spacing={4} alignItems="center" textAlign="center">
            {/* Page heading + helper text */}
            <Stack spacing={1}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              >
                {isInitialLoading
                  ? 'Welcome to 11Fire'
                  : isSignIn ? 'Sign in to 11Fire' : 'Create an Account'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isInitialLoading 
                  ? 'Checking your authentication status...'
                  : isSignIn
                    ? 'Welcome back! Please sign in to continue.'
                    : 'Welcome! Sign up with your Microsoft Account.'
                }
              </Typography>
            </Stack>

            {/* Microsoft SSO button - centered */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <AuthButton
                isLoading={showLoading}
                provider="microsoft"
                loadingText={
                  isInitialLoading 
                    ? 'Signing in...' 
                    : isSignIn 
                      ? 'Signing in...' 
                      : 'Signing up...'
                }
                onClick={handleMicrosoftAuth}
                disabled={isInitialLoading} // Disable button during initial load
              >
                {isSignIn ? 'Continue with Microsoft' : 'Sign up with Microsoft'}
              </AuthButton>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Footer at the bottom */}
      <Box component="footer" sx={{ py: { xs: 4, sm: 6 }, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {isSignIn ? (
            <>
              Don't have an account?{" "}
              <Link
                to="/auth/signup"
                style={{
                  color: 'primary.main',
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Create one
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                to="/auth/signin"
                style={{
                  color: 'primary.main',
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthPage;