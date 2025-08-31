import Axios from './axiosInstance';
import type { FileEntry } from '../types';

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

const formatFileSize = (size: number): string => {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
};