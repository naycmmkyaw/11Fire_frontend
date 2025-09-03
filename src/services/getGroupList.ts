import axiosInstance from './axiosInstance';

export interface GroupMembership {
  swarmId: string;
  swarmName: string | null;
  role: string;
  quotaBytes: number;
  createdAt: string;
  updatedAt: string;
  bootstrapId: string | null;
}

export interface ListGroupsResponse {
  ok: boolean;
  items: GroupMembership[];
}

export const listMyGroups = async (): Promise<GroupMembership[]> => {
  try {
    const response = await axiosInstance.get<ListGroupsResponse>('/swarms/my-swarms');
    return response.data.items;
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    throw error;
  }
};