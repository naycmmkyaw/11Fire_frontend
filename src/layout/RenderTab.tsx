import React from 'react';
import FilesTabContent from '../pages/files/FilesTab';
import ProfileTabContent from '../pages/profile/ProfileTab';
import InstallTabContent from '../pages/provider/InstallTab';
import StatusTabContent from '../pages/provider/StatusTab';

const renderTabContent = (selectedTab: string) => {
  switch (selectedTab) {
    case 'files':
      return <FilesTabContent />;
    case 'profile':
      return <ProfileTabContent />;
    case 'install':
      return <InstallTabContent />;
    case 'status':
      return <StatusTabContent />;
    default:
      return null;
  }
};

export default renderTabContent;