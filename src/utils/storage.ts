import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Encrypt data before storing
const encryptData = (data: any): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
};

// Decrypt data after retrieving
const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return null;
  }
};

// Storage utilities with encryption for sensitive data
export const secureStorage = {
  // Store encrypted user data
  setUserData: (userData: any): void => {
    try {
      const encrypted = encryptData(userData);
      localStorage.setItem('11fire_user_enc', encrypted);
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },

  // Get and decrypt user data
  getUserData: (): any => {
    try {
      const encrypted = localStorage.getItem('11fire_user_enc');
      if (!encrypted) return null;
      return decryptData(encrypted);
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },

  // Store encrypted token
  setToken: (token: string): void => {
    try {
      const encrypted = encryptData(token);
      localStorage.setItem('authToken_enc', encrypted);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  // Get and decrypt token
  getToken: (): string | null => {
    try {
      const encrypted = localStorage.getItem('authToken_enc');
      if (!encrypted) return null;
      return decryptData(encrypted);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  // Store encrypted groups data
  setGroups: (groups: any[]): void => {
    try {
      const encrypted = encryptData(groups);
      localStorage.setItem('11fire_groups_enc', encrypted);
    } catch (error) {
      console.error('Failed to store groups:', error);
    }
  },

  // Get and decrypt groups data
  getGroups: (): any[] => {
    try {
      const encrypted = localStorage.getItem('11fire_groups_enc');
      if (!encrypted) return [];
      return decryptData(encrypted) || [];
    } catch (error) {
      console.error('Failed to retrieve groups:', error);
      return [];
    }
  },

  // Clear all encrypted data
  clearAll: (): void => {
    localStorage.removeItem('11fire_user_enc');
    localStorage.removeItem('authToken_enc');
    localStorage.removeItem('11fire_groups_enc');
    
    // Also clear any old unencrypted data
    localStorage.removeItem('11fire_user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('11fire_groups');
  },

  // Remove specific items
  removeUserData: (): void => {
    localStorage.removeItem('11fire_user_enc');
    localStorage.removeItem('11fire_user'); 
  },

  removeToken: (): void => {
    localStorage.removeItem('authToken_enc');
    localStorage.removeItem('authToken'); 
  },

  removeGroups: (): void => {
    localStorage.removeItem('11fire_groups_enc');
    localStorage.removeItem('11fire_groups');
  }
};