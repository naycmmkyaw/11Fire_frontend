import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export interface SecondaryButtonProps extends Omit<BaseButtonProps, 'variant'> {
  width?: string | number;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  width = '200px',
  sx,
  ...props
}) => {
  return (
    <BaseButton
      variant="secondary"
      sx={{
        width,
        ...sx,
      }}
      {...props}
    />
  );
};

export default SecondaryButton;