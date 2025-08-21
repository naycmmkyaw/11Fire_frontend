import React from 'react';
import { Button, ButtonProps, useTheme } from '@mui/material';

export interface BaseButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  sx,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bgcolor: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
            opacity: 0.9,
          },
          '&:disabled': {
            bgcolor: theme.palette.grey[300],
            color: theme.palette.grey[500],
          },
        };
      case 'secondary':
        return {
          bgcolor: theme.palette.primary.light,
          color: theme.palette.text.primary,
          border: 'none',
          '&:hover': {
            bgcolor: '#f4b8b2',
          },
          '&:disabled': {
            bgcolor: theme.palette.grey[200],
            color: theme.palette.grey[500],
          },
        };
      case 'outlined':
        return {
          bgcolor: 'transparent',
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
            bgcolor: theme.palette.primary.main,
            color: 'white',
          },
          '&:disabled': {
            border: `1px solid ${theme.palette.grey[300]}`,
            color: theme.palette.grey[500],
          },
        };
      case 'text':
        return {
          bgcolor: 'transparent',
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.primary.light,
          },
          '&:disabled': {
            color: theme.palette.grey[500],
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: '36px',
          fontSize: '0.875rem',
          px: 2,
          py: 1,
        };
      case 'medium':
        return {
          height: '44px',
          fontSize: '1rem',
          px: 3,
          py: 1.5,
        };
      case 'large':
        return {
          height: '52px',
          fontSize: '1.125rem',
          px: 4,
          py: 2,
        };
      default:
        return {};
    }
  };

  const baseStyles = {
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 500,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
    ...getVariantStyles(),
    ...getSizeStyles(),
  };

  return (
    <Button
      sx={{
        ...baseStyles,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BaseButton;