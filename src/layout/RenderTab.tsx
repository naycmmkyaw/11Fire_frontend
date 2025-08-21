import React from 'react';
import FilesTabContent from '../pages/files/FilesTab';
import ProfileTabContent from '../pages/profile/ProfileTab';

const renderTabContent = (selectedTab: string) => {
  switch (selectedTab) {
    case 'files':
      return <FilesTabContent />;
    case 'profile':
      return <ProfileTabContent />;
    default:
      return null;
  }
};

export default renderTabContent;