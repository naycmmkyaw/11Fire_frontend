import React from 'react';
import { Box, Typography } from '@mui/material';
import CodeBlock from './CodeBlock';

interface InstallationStepProps {
  stepNumber: number;
  description: string;
  code: string;
  language: string;
}

const InstallationStep: React.FC<InstallationStepProps> = ({ 
  stepNumber, 
  description, 
  code, 
  language 
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body1" paragraph sx={{ mb: 2, fontWeight: 700 }}>
      {stepNumber}. {description}
    </Typography>
    <CodeBlock code={code} language={language} />
  </Box>
);

export default InstallationStep;
