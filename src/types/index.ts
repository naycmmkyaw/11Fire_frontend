export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
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

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  cid: string;
  createdAt: string;
  isSelected?: boolean;
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