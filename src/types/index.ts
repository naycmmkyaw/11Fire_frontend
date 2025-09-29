export interface User {
  id: string;                    // Maps to backend._id
  email: string;                 // Maps to backend.email
  name: string;                  // Maps to backend.username
  avatar?: string;              // Generated on frontend (not in backend)
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  passcode?: string;
  isOwner: boolean;
  memberCount: number;
  createdAt: string;
}

export interface FileEntry {
  name: string;
  cid: string;
  size: string;
  date: string;
  isFile: boolean;
}

export interface SharedFileEntry {
  name: string;
  cid: string;
  size: string;
  date: string;
  isFile: boolean;
  sharedBy: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export interface GroupContextType {
  currentGroup: Group | null;
  groups: Group[];
  setCurrentGroup: (group: Group | null) => void;
  addGroup: (group: Group) => void;
  removeGroup: (groupId: string) => void;
}

export interface PeerInfo {
  ok: boolean;
  swarmId: string;
  swarmName: string;
  selfPeerId: string;
  totalPeers: number;
}

export interface QuotaUsage {
  ok: boolean;
  swarmId: string;
  swarmName: string;
  quotaBytes: number | null;
  quotaGB: number | null;
  usedBytes: number;
  usedGB: number;
  percentUsed: number | null;
}

export interface UptimeData {
  ok: boolean;
  swarmId: string;
  swarmName: string;
  uptimePercent: number;
  downtime: string;
}

export interface UptimeLineData {
  ok: boolean;
  swarmId: string;
  swarmName: string;
  bucketHours: number;
  hours: number;
  now: string;
  points: Array<{
    time: string;
    online: number;
  }>;
}