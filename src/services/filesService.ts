import Axios from './axiosInstance';
import JSZip from 'jszip';

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

export interface ShareResponse {
  ok: boolean;
  cid: string;
  sharedWith: Array<{ _id: string; email?: string }>;
  unresolvedEmails: string[];
  sharedIdsCount: number;
}

export interface BulkDeleteResponse {
  ok: boolean;
  summary: {
    successful: number;
    failed: number;
    notOwned: number;
  };
  results: {
    successful: Array<{ cid: string }>;
    failed: Array<{ cid: string; error: string }>;
    notOwned: Array<{ cid: string }>;
  };
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

export const uploadFolder = async (files: File[], folderName: string): Promise<UploadResponse> => {
  const zip = new JSZip();
  files.forEach((file) => {
    const path = (file as any).webkitRelativePath || file.name;
    zip.file(path, file);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipFile = new File([zipBlob], `${folderName}.zip`, { type: 'application/zip' });

  const formData = new FormData();
  formData.append('files', zipFile);

  const response = await Axios.post('files/folder/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
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

export const downloadMultipleFiles = async (cids: string[]): Promise<void> => {
  try {
    const response = await Axios.post('/files/download-multiple', 
      { cids }, 
      { responseType: 'blob' }
    );

    // Create blob link to download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = `11fire_files_${Date.now()}.zip`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download multiple files:', error);
    throw error;
  }
};

export const deleteMultipleFiles = async (cids: string[]): Promise<BulkDeleteResponse> => {
  try {
    // console.log('Deleting files with CIDs:', cids);
    const response = await Axios.delete('/files/delete-multiple', { data: { cids } });
    if (!response.data.ok) {
      throw new Error('Bulk delete failed');
    }
    return response.data;
  } catch (error) {
    console.error('Failed to delete multiple files:', error);
    throw error;
  }
};

export const shareFile = async (cid: string, emails: string[]): Promise<ShareResponse> => {
  const response = await Axios.post(`/files/share/${cid}`, { emails });
  return response.data;
};