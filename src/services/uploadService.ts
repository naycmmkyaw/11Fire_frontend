import Axios from './axiosInstance';

export interface UploadResponse {
  ok: boolean;
  cid: string;
  replicatedTo: string[];
  swarmId: string;
  fileId: string;
  size: number;
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