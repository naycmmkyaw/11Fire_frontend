import React from 'react';
import { Button, type ButtonProps } from '@mui/material';

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
        bgcolor: 'primary.main',
        color: 'white',
        '&:hover': { 
          bgcolor: 'primary.main',
          opacity: 0.9 
        },
      };
    }

    // Secondary variant
    return {
      ...baseStyles,
      bgcolor: 'primary.light',
      color: 'text.primary',
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