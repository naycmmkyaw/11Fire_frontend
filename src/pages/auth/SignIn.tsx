import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Stack,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/logo.png';
import AuthButton from '../../components/shared/AuthButton';

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      setIsLoading(false); // only reset on failure
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
              <AuthButton
                isLoading={isLoading}
                provider="microsoft"
                loadingText="Signing in..."
                onClick={handleMicrosoftSignIn}
              >
                Continue with Microsoft
              </AuthButton>
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
                color: 'primary.main',
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