import React from 'react';
import FilesTabContent from '../pages/files/FilesTab';
import ProfileTabContent from '../pages/profile/ProfileTab';
import InstallTabContent from '../pages/provider/InstallTab';
import StatusTabContent from '../pages/provider/StatusTab';

interface RenderTabProps {
  onTabChange?: (tab: string) => void;
}

const renderTabContent = (selectedTab: string, onTabChange?: (tab: string) => void) => {
  switch (selectedTab) {
    case 'files':
      return <FilesTabContent />;
    case 'profile':
      return <ProfileTabContent />;
    case 'install':
      return <InstallTabContent />;
    case 'status':
      return <StatusTabContent onTabChange={onTabChange} />;
    default:
      return null;
  }
};

export default renderTabContent;