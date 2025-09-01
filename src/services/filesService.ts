import Axios from './axiosInstance';

export interface UploadResponse {
  ok: boolean;
  cid: string;
  replicatedTo: string[];
  swarmId: string;
  fileId: string;
  size: number;
}

export interface RenameResponse {
  ok: boolean;
  cid: string;
  name: string;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await Axios.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteFile = async (cid: string): Promise<void> => {
  try {
    const response = await Axios.delete(`/files/delete/${cid}`);
    if (!response.data.ok) {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};

export const renameFile = async (cid: string, name: string): Promise<RenameResponse> => {
  try {
    const response = await Axios.patch(`/files/rename/${cid}`, { name });
    if (!response.data.ok) {
      throw new Error('Rename failed');
    }
    return response.data;
  } catch (error) {
    console.error('Failed to rename file:', error);
    throw error;
  }
};

export const downloadFile = async (cid: string, fileName: string): Promise<void> => {
  try {
    const response = await Axios.get(`/files/download/${cid}`, {
      responseType: 'blob',
    });

    // Create blob link to download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw error;
  }
};