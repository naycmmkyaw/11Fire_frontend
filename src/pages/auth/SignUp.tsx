import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Stack,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/logo.png';
import AuthButton from '../../components/shared/AuthButton';

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleMicrosoftSignUp = async () => {
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
      console.error('Sign up failed:', error);
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
                Create an Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                 Welcome! Sign up with your Microsoft Account.
                </Typography>
            </Stack>

            {/* Microsoft SSO button - centered */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <AuthButton
              isLoading={isLoading}
              provider="microsoft"
              loadingText="Signing up..."
              onClick={handleMicrosoftSignUp}
            >
              Sign up with Microsoft
            </AuthButton>
            </Box>
            </Stack>
        </Container>
        </Box>

        {/* Footer at the bottom */}
        <Box component="footer" sx={{ py: { xs: 4, sm: 6 }, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
            to="/auth/signin"
            style={{
                color: theme.palette.primary.main,
                textDecoration: "none",
                fontWeight: 500,
            }}
            >
            Sign in
            </Link>
        </Typography>
        </Box>
    </Box>
  );
};

export default SignUp;