import { useAuth } from "../hooks/useAuth";
import { Navigate, useSearchParams } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import { useState, useEffect } from 'react';
import { secureStorage } from "../utils/storage";

const ConditionalRedirect = () => {
  const { user, isLoading } = useAuth();
  const [showExtendedLoading, setShowExtendedLoading] = useState(true);
  const [tokenProcessed, setTokenProcessed] = useState(false);
  const [tokenUserData, setTokenUserData] = useState<any>(null);
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Check for token-based authentication from URL params
    const token = searchParams.get('token');
    const success = searchParams.get('success');
    const userStr = searchParams.get('user');
    
    if (success === 'true' && token && !tokenProcessed) {
      try {
        // Store authentication data securely for token-based flow
        secureStorage.setToken(token);
        
        if (userStr) {
          const userData = JSON.parse(decodeURIComponent(userStr));
          secureStorage.setUserData(userData);
          setTokenUserData(userData);
        }
        
        // Clear URL params 
        window.history.replaceState({}, document.title, window.location.pathname);
        setTokenProcessed(true);
        
        return;
      } catch (error) {
        console.error('Failed to process token auth:', error);
      }
    }
    
    // Original loading logic for cookie-based auth
    if (!isLoading && user) {
      const timer = setTimeout(() => {
        setShowExtendedLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (!isLoading) {
      setShowExtendedLoading(false);
    }
  }, [isLoading, user, searchParams, tokenProcessed]);
  
  // Handle token-based authentication redirection
  if (tokenProcessed && tokenUserData) {
    const targetPath = tokenUserData.activeSwarm
      ? (tokenUserData.memberships?.[0]?.role === "provider" ? "/provider-dashboard" : "/files")
      : "/group";
    return <Navigate to={targetPath} replace />;
  }

  // Show AuthPage with loading state while checking authentication or during extended loading
  if (isLoading || (user && showExtendedLoading) || tokenProcessed) {
    return <AuthPage isInitialLoading={true} />;
  }
  
  if (!user && !tokenProcessed) {
    return <Navigate to="/auth/signin" replace />;
  }

  // Cookie-based authentication redirection
  if (user) {
    const targetPath = user.isFirstLogin
      ? "/group"
      : user.role === "provider"
        ? "/provider-dashboard"
        : "/files";

    return <Navigate to={targetPath} replace />;
  }

  return <Navigate to="/auth/signin" replace />;
};

export default ConditionalRedirect;