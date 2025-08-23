import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar,
  IconButton,
  Link,
  Tabs,
  Tab
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const InstallTab = () => {
  const [kuboTabValue, setKuboTabValue] = useState(0);
  const [fireTabValue, setFireTabValue] = useState(0);

  const handleKuboTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setKuboTabValue(newValue);
  };

  const handleFireTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setFireTabValue(newValue);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Reusable Tab Component
  const OSTab = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <Tab 
      label={label} 
      onClick={onClick}
      sx={{
        color: isActive ? '#EB6464' : '#000000',
        textTransform: 'none' as const,
        minHeight: 'auto',
        padding: '6px 16px',
        borderRadius: '6px',
        bgcolor: 'transparent',
        '&:hover': {
          bgcolor: 'transparent'
        }
      }}
    />
  );

  // Reusable Code Block Component
  const CodeBlock = ({ code, language }: { code: string; language: string }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        bgcolor: '#1e293b', 
        color: '#e2e8f0', 
        p: 2, 
        borderRadius: 1,
        position: 'relative',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        overflow: 'auto',
        mb: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          {language}
        </Typography>
        <IconButton 
          size="small" 
          onClick={() => handleCopyCode(code)}
          sx={{ color: '#94a3b8', '&:hover': { color: '#e2e8f0' } }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {code}
      </Box>
    </Paper>
  );

  // Reusable Installation Step Component
  const InstallationStep = ({ 
    stepNumber, 
    description, 
    code, 
    language 
  }: { 
    stepNumber: number; 
    description: string; 
    code: string; 
    language: string; 
  }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" paragraph sx={{ mb: 2 }}>
        {stepNumber}. {description}
      </Typography>
      <CodeBlock code={code} language={language} />
    </Box>
  );

  // Reusable Card Component
  const InstallationCard = ({ 
    title, 
    tabValue, 
    onTabChange, 
    children 
  }: { 
    title: string; 
    tabValue: number; 
    onTabChange: (event: React.SyntheticEvent, newValue: number) => void; 
    children: React.ReactNode; 
  }) => (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 0, 
        bgcolor: '#FFFFFF',
        borderRadius: "30px 30px 0 0",
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        mb: 4,
        height: '280px'
      }}
    >
      {/* Card Header with OS Tabs */}
      <Box sx={{ 
        bgcolor: '#F4EADE', 
        p: 2, 
        borderBottom: '1px solid #e5e7eb',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
      }}>
        <Tabs 
          value={tabValue} 
          onChange={onTabChange}
          sx={{ 
            minHeight: 'auto',
            '& .MuiTabs-indicator': {
              display: 'none'
            }
          }}
        >
          <OSTab label="Windows" isActive={tabValue === 0} onClick={() => onTabChange({} as any, 0)} />
          <OSTab label="MacOS" isActive={tabValue === 1} onClick={() => onTabChange({} as any, 1)} />
          <OSTab label="Linux" isActive={tabValue === 2} onClick={() => onTabChange({} as any, 2)} />
        </Tabs>
      </Box>
      
      {/* Content Area */}
      <Box sx={{ 
        p: 3, 
        height: 'calc(280px - 80px)',
        overflow: 'auto',
        bgcolor: '#FFFAF4',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f5f9',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '3px',
          '&:hover': {
            background: '#94a3b8',
          },
        },
      }}>
        {children}
      </Box>
    </Paper>
  );

  // Installation data for Kubo
  const kuboInstallationData = {
    windows: {
      download: "wget https://dist.ipfs.tech/kubo/v0.36.0/kubo_v0.36.0_windows-amd64.zip -Outfile kubo_v0.36.0_windows-amd64.zip",
      extract: "Expand-Archive -Path kubo_v0.36.0_windows-amd64.zip -DestinationPath .",
      navigate: "cd kubo",
      run: ".\\ipfs.exe --version"
    },
    macos: {
      download: "curl -O https://dist.ipfs.tech/kubo/v0.36.0/kubo_v0.36.0_darwin-amd64.tar.gz",
      extract: "tar -xzf kubo_v0.36.0_darwin-amd64.tar.gz",
      navigate: "cd kubo",
      run: "./ipfs --version"
    },
    linux: {
      download: "wget https://dist.ipfs.tech/kubo/v0.36.0/kubo_v0.36.0_linux-amd64.tar.gz",
      extract: "tar -xzf kubo_v0.36.0_linux-amd64.tar.gz",
      navigate: "cd kubo",
      run: "./ipfs --version"
    }
  };

  // Installation data for 11Fire
  const fireInstallationData = {
    windows: {
      download: "wget https://dist.ipfs.tech/kubo/v0.34.1/kubo_v0.34.1_windows-amd64.zip -Outfile kubo_v0.34.1_windows-amd64.zip",
      extract: "Expand-Archive -Path kubo_v0.34.1_windows-amd64.zip -DestinationPath .",
      navigate: "cd kubo",
      run: ".\\11fire.exe --version"
    },
    macos: {
      download: "curl -O https://dist.ipfs.tech/kubo/v0.34.1/kubo_v0.34.1_darwin-amd64.tar.gz",
      extract: "tar -xzf kubo_v0.34.1_darwin-amd64.tar.gz",
      navigate: "cd kubo",
      run: "./11fire --version"
    },
    linux: {
      download: "wget https://dist.ipfs.tech/kubo/v0.34.1/kubo_v0.34.1_linux-amd64.tar.gz",
      extract: "tar -xzf kubo_v0.34.1_linux-amd64.tar.gz",
      navigate: "cd kubo",
      run: "./11fire --version"
    }
  };

  // Render installation content based on OS
  const renderInstallationContent = (data: any, osName: string) => (
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

  return (
    <Box>
      {/* Header with notification badge */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          INSTALL
        </Typography>
        <Avatar sx={{ bgcolor: '#EF4444', width: 36, height: 36, fontSize: '1rem', color: '#fff' }}>
          N
        </Avatar>
      </Box>

      {/* Kubo Binary Installation Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This section describes how to download and install the official Kubo binary from{' '}
          <Link 
            href="https://dist.ipfs.tech" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ 
              bgcolor: '#FFF7ED', 
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
          {' '}on Windows, MacOS, and Linux operating systems.
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          For installation instructions for your operating system, select the appropriate tab.
        </Typography>

        <InstallationCard title="Kubo Installation" tabValue={kuboTabValue} onTabChange={handleKuboTabChange}>
          {kuboTabValue === 0 && renderInstallationContent(kuboInstallationData.windows, 'Windows')}
          {kuboTabValue === 1 && renderInstallationContent(kuboInstallationData.macos, 'MacOS')}
          {kuboTabValue === 2 && renderInstallationContent(kuboInstallationData.linux, 'Linux')}
        </InstallationCard>
      </Box>

      {/* 11Fire Binary Installation Section */}
      <Box>
        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
          This section describes how to download and install the 11fire binary on Windows, MacOS, and Linux operating systems.
        </Typography>

        <InstallationCard title="11Fire Installation" tabValue={fireTabValue} onTabChange={handleFireTabChange}>
          {fireTabValue === 0 && renderInstallationContent(fireInstallationData.windows, 'Windows')}
          {fireTabValue === 1 && renderInstallationContent(fireInstallationData.macos, 'MacOS')}
          {fireTabValue === 2 && renderInstallationContent(fireInstallationData.linux, 'Linux')}
        </InstallationCard>
      </Box>
    </Box>
  );
};

export default InstallTab;
