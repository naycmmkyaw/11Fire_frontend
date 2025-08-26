import React from 'react';
import { Button, type ButtonProps, useTheme } from '@mui/material';

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary';
  width?: string | number;
  height?: string | number;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  width = '200px',
  height,
  children,
  sx,
  ...props
}) => {
  const theme = useTheme();

  const getButtonStyles = () => {
    const baseStyles = {
      width,
      height,
      borderRadius: 1.5,
      textTransform: 'none' as const,
      fontSize: '1rem',
      fontWeight: 500,
      border: 'none',
    };

    if (variant === 'primary') {
      return {
        ...baseStyles,
        bgcolor: theme.palette.primary.main,
        color: 'white',
        '&:hover': { 
          bgcolor: theme.palette.primary.main,
          opacity: 0.9 
        },
      };
    }

    // Secondary variant
    return {
      ...baseStyles,
      bgcolor: theme.palette.primary.light,
      color: theme.palette.text.primary,
      '&:hover': { 
        border: 'none',
      },
    };
  };

  return (
    <Button
      sx={{
        ...getButtonStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ActionButton;