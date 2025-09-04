import React from 'react';
import { Box, Typography } from '@mui/material';
import InstallationStep from './InstallationStep';
import type { InstallationData } from '../../data/installationInstructions';

interface InstallationContentProps {
  data: InstallationData;
  osName: string;
}

const InstallationContent: React.FC<InstallationContentProps> = ({ data, osName }) => (
  <Box>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#EF4444', mb: 2 }}>
      {osName}
    </Typography>
    
    <InstallationStep 
      stepNumber={1} 
      description="Set the IPFS Swarm Key" 
      code={data.setSwarmKey} 
      language={osName === 'Windows' ? 'PowerShell' : 'Terminal'} 
    />
    
    <InstallationStep 
      stepNumber={2} 
      description="Download the setup script" 
      code={data.download} 
      language={osName === 'Windows' ? 'PowerShell' : 'Terminal'} 
    />
    
    {data.makeExecutable && (
      <InstallationStep 
        stepNumber={3} 
        description="Make the script executable" 
        code={data.makeExecutable} 
        language="Terminal" 
      />
    )}
    
    <InstallationStep 
      stepNumber={data.makeExecutable ? 4 : 3} 
      description="Run the setup script" 
      code={data.run} 
      language={osName === 'Windows' ? 'PowerShell' : 'Terminal'} 
    />
    
    <InstallationStep 
      stepNumber={data.makeExecutable ? 5 : 4} 
      description="Run ipfs daemon" 
      code={data.daemon} 
      language="Terminal" 
    />
  </Box>
);

export default InstallationContent;
