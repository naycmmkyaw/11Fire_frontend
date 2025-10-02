import Axios from './axiosInstance';
import type { FileEntry, SharedFileEntry } from '../types';

export interface BackendFileItem {
  _id: string;
  name: string;
  cid: string;
  size: number;
  date: string;
  isFile: boolean;
  swarm: string;
  storedIds: string[];
  sharedIds: string[];
}

export interface BackendSharedFileItem {
  _id: string;
  name: string;
  cid: string;
  size: number;
  date: string;
  ownerId?: {
    username?: string;
    email?: string;
  };
}

export const fetchFilesForGroup = async (swarmId: string): Promise<FileEntry[]> => {
  try {
    // First set the active swarm
    await Axios.post('/auth/active-swarm', { swarmId });
    
    // Then fetch files for that swarm
    const response = await Axios.get('/files/mine');
    
    if (response.data.ok && response.data.items) {
      // Transform backend format to frontend format
      return response.data.items.map((item: BackendFileItem): FileEntry => ({
        name: item.name,
        cid: item.cid,
        size: formatFileSize(item.size),
        date: new Date(item.date).toLocaleDateString(),
        isFile: item.isFile,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch files for group:', error);
    throw error;
  }
};

export const fetchSharedFilesForGroup = async (swarmId: string): Promise<SharedFileEntry[]> => {
  try {
    await Axios.post('/auth/active-swarm', { swarmId });

    const response = await Axios.get('/files/shared');

    if (response.data.ok && Array.isArray(response.data.files)) {
      return response.data.files.map((item: BackendSharedFileItem): SharedFileEntry => {
        const ownerName = item.ownerId?.username ?? 'Unknown';
        const ownerEmail = item.ownerId?.email ?? '';
        const avatar =
          ownerName.charAt(0).toUpperCase() ||
          ownerEmail.charAt(0).toUpperCase() ||
          'U';

        return {
          name: item.name,
          cid: item.cid,
          size: formatFileSize(item.size),
          date: new Date(item.date).toLocaleDateString(),
          isFile: true,
          sharedBy: {
            name: ownerName,
            email: ownerEmail,
            avatar,
          },
        };
      });
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch shared files:', error);
    throw error;
  }
};

const formatFileSize = (size: number): string => {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
};