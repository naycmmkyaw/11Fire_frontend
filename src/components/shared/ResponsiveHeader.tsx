import React from "react";
import useIsMobile from "../../hooks/useMobile";
import MobileHeader from "./MobileHeader";
import PageHeader from "./PageHeader";

interface ResponsiveHeaderProps {
  title: string;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
  onTabChange?: (tab: string) => void;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  title,
  selectedTab,
  setSelectedTab,
  isProviderDashboard,
  onTabChange,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileHeader
        title={title}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
        onTabChange={onTabChange}
      />
    );
  }

  return <PageHeader title={title} />;
};

export default ResponsiveHeader;
