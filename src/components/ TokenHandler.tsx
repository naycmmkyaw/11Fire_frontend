import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { secureStorage } from "../utils/storage";

export const TokenHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const success = searchParams.get('success');
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    
    if (success === 'true' && token) {
      try {
        // Store authentication data securely
        secureStorage.setToken(token);
        
        if (userStr) {
          const user = JSON.parse(decodeURIComponent(userStr));
          secureStorage.setUserData(user);
        }
        
        navigate('/group', { replace: true });
      } catch (error) {
        console.error('Failed to process auth response:', error);
        navigate('/auth/signin', { replace: true });
      }
    }
  }, [searchParams, navigate]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Processing authentication...</div>
    </div>
  );
};