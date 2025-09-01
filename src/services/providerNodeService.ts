import Axios from './axiosInstance';
import type { PeerInfo, QuotaUsage, UptimeData, UptimeLineData } from '../types';

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
  },

  getActiveUptime: async (): Promise<UptimeData> => {
    const response = await Axios.get('/provider-node/active/uptime');
    return response.data;
  },

  getActiveUptimeLine24h: async (): Promise<UptimeLineData> => {
    const response = await Axios.get('/provider-node/active/uptime-line-24h');
    return response.data;
  },

  mintProviderClaimToken: async () => {
    const response = await Axios.post('/auth/provider-claim-token');
    return response.data;
  }
};
