import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const MOBILE_HEIGHT_BREAKPOINT = 500;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(
      `(max-device-width: ${MOBILE_BREAKPOINT - 1}px)`
    );
    const updateIsMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;

      const mobileByDeviceWidth = mql.matches;
      const mobileByWidth = width < MOBILE_BREAKPOINT;
      const mobileByHeightInLandscape =
        isLandscape && height < MOBILE_HEIGHT_BREAKPOINT;

      setIsMobile(
        mobileByDeviceWidth || mobileByWidth || mobileByHeightInLandscape
      );
    };

    mql.addEventListener("change", updateIsMobile);
    window.addEventListener("resize", updateIsMobile);
    updateIsMobile();

    return () => {
      mql.removeEventListener("change", updateIsMobile);
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  return !!isMobile;
};

export default useIsMobile;