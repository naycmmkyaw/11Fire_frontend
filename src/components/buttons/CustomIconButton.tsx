import React from 'react';
import { IconButton, IconButtonProps, useTheme } from '@mui/material';

export interface CustomIconButtonProps extends IconButtonProps {
  variant?: 'default' | 'primary' | 'secondary';
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  variant = 'default',
  sx,
  ...props
}) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.primary.light,
          },
        };
      case 'secondary':
        return {
          color: theme.palette.text.secondary,
          '&:hover': {
            bgcolor: theme.palette.grey[100],
          },
        };
      default:
        return {
          color: theme.palette.text.primary,
          '&:hover': {
            bgcolor: theme.palette.grey[100],
          },
        };
    }
  };

  return (
    <IconButton
      sx={{
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    />
  );
};

export default CustomIconButton;