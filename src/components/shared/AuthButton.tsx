import React from 'react';
import {
  Button, 
  type ButtonProps, 
  Box, 
  CircularProgress, 
} from '@mui/material';

export interface AuthButtonProps extends Omit<ButtonProps, 'startIcon'> {
  isLoading?: boolean;
  provider?: 'microsoft';
  loadingText?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  isLoading = false,
  provider,
  loadingText,
  children,
  disabled,
  sx,
  ...props
}) => {
  const getMicrosoftIcon = () => (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'primary.main',
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
  );

  const getProviderIcon = () => {
    if (isLoading) {
      return <CircularProgress size={20} color="inherit" />;
    }

    switch (provider) {
      case 'microsoft':
        return getMicrosoftIcon();
      default:
        return getMicrosoftIcon();
    }
  };

  return (
    <Button
      variant="contained"
      disableElevation
      disabled={disabled || isLoading}
      startIcon={getProviderIcon()}
      sx={{
        bgcolor: 'primary.main',
        '&:hover': {bgcolor: 'primary.dark'},
        color: 'common.white',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        py: 1.5,
        px: 4,
        borderRadius: 1.5,
        minWidth: 280,
        boxShadow: 'none',
        ...sx,
      }}
      {...props}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default AuthButton;