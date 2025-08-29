import { useAuth } from "../hooks/useAuth";
import { Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import { useState, useEffect } from 'react';

const ConditionalRedirect = () => {
  const { user, isLoading } = useAuth();
  const [showExtendedLoading, setShowExtendedLoading] = useState(true);
  
  useEffect(() => {
    // Show loading for at least 2 seconds after auth check completes
    if (!isLoading && user) {
      const timer = setTimeout(() => {
        setShowExtendedLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (!isLoading) {
      setShowExtendedLoading(false);
    }
  }, [isLoading, user]);
  
  // Show AuthPage with loading state while checking authentication or during extended loading
  if (isLoading || (user && showExtendedLoading)) {
    return <AuthPage isInitialLoading={true} />;
  }
  
  return <Navigate to={user ? "/group" : "/auth/signin"} replace />;
};

export default ConditionalRedirect;