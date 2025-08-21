import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Stack,
  Divider,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.secondary.main,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            maxWidth: 400,
            mx: 'auto',
            p: 3,
          }}
        >
          <CardContent>
            {/* 11Fire Logo */}
            <Stack alignItems="center" spacing={2} mb={4}>
              <Box
                sx={{
                  fontSize: '3rem',
                  lineHeight: 1,
                }}
              >
                🔥
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: '-0.5px',
                }}
              >
                11Fire
              </Typography>
            </Stack>

            {/* Sign Up Content */}
            <Stack spacing={3}>
              <Stack spacing={1} textAlign="center">
                <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
                  Create an Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Welcome! Sign up with your Microsoft Account.
                </Typography>
              </Stack>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleMicrosoftSignUp}
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'white',
                        borderRadius: 1,
                        p: 0.5,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="1" y="1" width="8" height="8" fill="#F25022"/>
                        <rect x="11" y="1" width="8" height="8" fill="#7FBA00"/>
                        <rect x="1" y="11" width="8" height="8" fill="#00A4EF"/>
                        <rect x="11" y="11" width="8" height="8" fill="#FFB900"/>
                      </svg>
                    </Box>
                  )
                }
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Creating account...' : 'Signup with Microsoft'}
              </Button>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" textAlign="center" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  to="/auth/signin"
                  style={{
                    color: '#EB6464',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SignUp;