import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CodeBlock from './CodeBlock';
import InstallationStep from './InstallationStep';

interface InstallationContentProps {
  data: {
    download: string;
    extract: string;
    navigate: string;
    run: string;
  };
  osName: string;
}

const InstallationContent: React.FC<InstallationContentProps> = ({ data, osName }) => (
  <Box>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#EF4444', mb: 2 }}>
      {osName}
    </Typography>
    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
      1. Download the {osName} binary from{' '}
      <Link 
        href="https://dist.ipfs.tech" 
        target="_blank" 
        rel="noopener noreferrer"
        sx={{ 
          px: 1, 
          py: 0.5, 
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        dist.ipfs.tech
        <OpenInNewIcon fontSize="small" />
      </Link>
    </Typography>
    <CodeBlock code={data.download} language={osName === 'Windows' ? 'PowerShell' : 'Terminal'} />
    <InstallationStep stepNumber={2} description="Extract the downloaded file" code={data.extract} language={osName === 'Windows' ? 'PowerShell' : 'Terminal'} />
    <InstallationStep stepNumber={3} description="Navigate to the extracted directory" code={data.navigate} language={osName === 'Windows' ? 'PowerShell' : 'Terminal'} />
    <InstallationStep stepNumber={4} description="Run the executable" code={data.run} language={osName === 'Windows' ? 'PowerShell' : 'Terminal'} />
  </Box>
);

export default InstallationContent;
