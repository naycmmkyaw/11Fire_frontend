import Axios from './axiosInstance';
import type { PeerInfo, QuotaUsage } from '../types';

export const providerNodeService = {
  getActivePeers: async (): Promise<PeerInfo> => {
    const response = await Axios.get('/provider-node/active/peers');
    return response.data;
  },
  
  getActiveQuotaUsage: async (): Promise<QuotaUsage> => {
    const response = await Axios.get('/provider-node/active/quota-usage');
    return response.data;
  },

  setActiveSwarmQuota: async (quotaGB: number) => {
    const response = await Axios.post('/auth/memberships/active/quota', {
      quotaGB
    });
    return response.data;
  }
};
