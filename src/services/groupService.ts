import Axios from './axiosInstance';

export interface LeaveGroupResponse {
  ok: boolean;
  details: {
    deletedCount: number;
    migratedFiles: number;
    skippedMigrations: number;
  };
}

export const leaveGroup = async (swarmId: string): Promise<LeaveGroupResponse> => {
  try {
    const response = await Axios.post<LeaveGroupResponse>('/swarms/leave', {
      swarmId
    });
    
    return response.data;
  } catch (error: unknown) {
    console.error('Leave group service error:', error);
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as any).response?.data?.error || 'Failed to leave group. Please try again.'
      : 'Failed to leave group. Please try again.';
    throw new Error(errorMessage);
  }
};
