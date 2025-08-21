import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/logo.png';

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Microsoft OAuth flow
      // In a real app, this would redirect to Microsoft OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data - in real app this would come from Microsoft OAuth response
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40'
      };
      
      login(mockUser);
      navigate('/group');
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
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
        bgcolor: theme.palette.secondary.main,
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
            // flex: 1,
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
                Sign in to 11Fire
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Welcome back! Please sign in to continue.
                </Typography>
            </Stack>

            {/* Microsoft SSO button - centered */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Button
                variant="contained"
                disableElevation
                onClick={handleMicrosoftSignIn}
                disabled={isLoading}
                startIcon={
                    isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                    ) : (
                    // White square with the Microsoft 4-tile logo (matches the mock)
                    <Box
                        sx={{
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "#EB6464",
                        borderRadius: 1,
                        width: 32,
                        height: 32,
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                        <rect x="1" y="1" width="8" height="8" fill="#FFFFFF" />
                        <rect x="11" y="1" width="8" height="8" fill="#FFFFFF" />
                        <rect x="1" y="11" width="8" height="8" fill="#FFFFFF" />
                        <rect x="11" y="11" width="8" height="8" fill="#FFFFFF" />
                        </svg>
                    </Box>
                    )
                }
                sx={{
                    bgcolor: theme.palette.primary.main,
                    "&:hover": { bgcolor: theme.palette.primary.dark || theme.palette.primary.main },
                    color: "common.white",
                    textTransform: "none", // sentence case like the design
                    fontWeight: 600,
                    fontSize: "1rem",
                    py: 1.5,
                    px: 4,
                    borderRadius: 1.5,
                    minWidth: 280,
                }}
                >
                {isLoading ? "Signing in..." : "Continue with Microsoft"}
                </Button>
            </Box>
            </Stack>
        </Container>
        </Box>

        {/* Footer at the bottom */}
        <Box component="footer" sx={{ py: { xs: 4, sm: 6 }, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
            to="/auth/signup"
            style={{
                color: theme.palette.primary.main,
                textDecoration: "none",
                fontWeight: 500,
            }}
            >
            Create one
            </Link>
        </Typography>
        </Box>
    </Box>
  );
};

export default SignIn;