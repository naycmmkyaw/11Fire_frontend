import React from 'react';
import { Box, Paper, Tabs } from '@mui/material';
import OSTab from './OSTab';

interface InstallationCardProps {
  title: string;
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  children: React.ReactNode;
}

const InstallationCard: React.FC<InstallationCardProps> = ({ 
  title, 
  tabValue, 
  onTabChange, 
  children 
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

export default InstallationCard;
