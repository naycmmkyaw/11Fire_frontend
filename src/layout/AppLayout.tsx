import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Logo from '../assets/logo2.png';
import renderTabContent from './RenderTab';

const AppLayout = () => {
  const [selectedTab, setSelectedTab] = useState('files');

  const getTabStyles = (tab: string) => ({
    bgcolor: selectedTab === tab ? '#FFF7ED' : '#EF4444',
    pl: 4,
    '&:hover': {
      bgcolor: selectedTab === tab ? '#FFF7ED' : '#e53e3e'
    }
  });

  const getIconColor = (tab: string) => selectedTab === tab ? '#EF4444' : '#FFFFFF';

  const getTextColor = (tab: string) => selectedTab === tab ? '#EF4444' : '#FFFFFF';

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: 200, bgcolor: '#EF4444', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4 }}>
        <Box component="img" src={Logo} alt="11Fire Logo" sx={{ width: 55, height: 80, mb: 1 }} />
        <Typography variant="h6" fontWeight={600} color="#000" gutterBottom mb={2}>11Fire</Typography>
        <List sx={{ width: '100%' }}>
          <Box sx={{ bgcolor: selectedTab === 'files' ? '#FFF7ED' : '#EF4444' }}>
            <ListItemButton selected={selectedTab === 'files'} onClick={() => setSelectedTab('files')} sx={getTabStyles('files')}>
              <ListItemIcon sx={{ color: getIconColor('files') }}><InsertDriveFileIcon /></ListItemIcon>
              <ListItemText primary={<Typography sx={{ color: getTextColor('files') }}>Files</Typography>} />
            </ListItemButton>
          </Box>
          <Box sx={{ bgcolor: selectedTab === 'profile' ? '#FFF7ED' : '#EF4444' }}>
            <ListItemButton selected={selectedTab === 'profile'} onClick={() => setSelectedTab('profile')} sx={getTabStyles('profile')}>
              <ListItemIcon sx={{ color: getIconColor('profile') }}><AccountCircleOutlinedIcon /></ListItemIcon>
              <ListItemText primary={<Typography sx={{ color: getTextColor('profile') }}>Profile</Typography>} />
            </ListItemButton>
          </Box>
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, bgcolor: '#FFF7ED', p: 4 }}>
        {renderTabContent(selectedTab)}
      </Box>
    </Box>
  );
};

export default AppLayout;