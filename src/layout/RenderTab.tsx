// import React from 'react';
import FilesTabContent from '../pages/files/FilesTab';
import ProfileTabContent from '../pages/profile/ProfileTab';
import InstallTabContent from '../pages/provider/InstallTab';
import StatusTabContent from '../pages/provider/StatusTab';

// interface RenderTabProps {
//   onTabChange?: (tab: string) => void;
// }

const renderTabContent = (
  selectedTab: string, 
  setSelectedTab: (tab: string) => void,
  isProviderDashboard: boolean,
  onTabChange?: (tab: string) => void
) => {
  switch (selectedTab) {
    case 'files':
      return <FilesTabContent 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
        onTabChange={onTabChange}
      />;
    case 'profile':
      return <ProfileTabContent 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
        onTabChange={onTabChange}
      />;
    case 'install':
      return <InstallTabContent 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
        onTabChange={onTabChange}
      />;
    case 'status':
      return <StatusTabContent 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
        onTabChange={onTabChange}
      />;
    default:
      return null;
  }
};

export default renderTabContent;