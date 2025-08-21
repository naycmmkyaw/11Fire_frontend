import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export interface PrimaryButtonProps extends Omit<BaseButtonProps, 'variant'> {
  width?: string | number;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  width = '200px',
  sx,
  ...props
}) => {
  return (
    <BaseButton
      variant="primary"
      sx={{
        width,
        ...sx,
      }}
      {...props}
    />
  );
};

export default PrimaryButton;