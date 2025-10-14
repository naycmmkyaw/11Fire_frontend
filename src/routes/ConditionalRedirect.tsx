import { useAuth } from "../hooks/useAuth";
import { Navigate, useSearchParams } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import { useState, useEffect } from 'react';

const ConditionalRedirect = () => {
  const { user, isLoading } = useAuth();
  const [showExtendedLoading, setShowExtendedLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Check for token-based authentication from URL params
    const token = searchParams.get('token');
    const success = searchParams.get('success');
    const userStr = searchParams.get('user');
    
    if (success === 'true' && token) {
      try {
        // Store authentication data for token-based flow
        localStorage.setItem('authToken', token);
        
        if (userStr) {
          const userData = JSON.parse(decodeURIComponent(userStr));
          localStorage.setItem('11fire_user', JSON.stringify(userData));
        }
        
        // Clear URL params and let the component handle redirection
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Force re-render to pick up the new auth state
        window.location.reload();
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
  }, [isLoading, user, searchParams]);
  
  // Show AuthPage with loading state while checking authentication or during extended loading
  if (isLoading || (user && showExtendedLoading)) {
    return <AuthPage isInitialLoading={true} />;
  }
  
  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  const targetPath = user.isFirstLogin
    ? "/group"
    : user.role === "provider"
      ? "/provider-dashboard"
      : "/files";

  return <Navigate to={targetPath} replace />;
};

export default ConditionalRedirect;