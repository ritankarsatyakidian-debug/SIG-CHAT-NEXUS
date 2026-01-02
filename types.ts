
export enum SigmaxCountry {
  POWERLINGX = 'POWERLINGX',
  TAIQ = 'TAIQ',
  BEL_IQ_Z = 'BEL-IQ-Z',
  SAVIROM = 'SAVIROM',
  DIAMONDAURA = 'DIAMONDAURA',
  LING_DYNOMAX = 'LING-DYNOMAX',
}

export type SecurityLevel = 'CITIZEN' | 'OFFICIAL' | 'LEADER' | 'INTEL' | 'ADMIN';

export type MessagePriority = 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  country: SigmaxCountry;
  role: string;
  securityLevel: SecurityLevel;
  bio: string;
  systemPrompt: string;
  status?: string;
  lastSeen?: Date;
}

export interface User extends Contact {
  phoneNumber: string;
  password?: string; // stored only in local simulation
  isVerified?: boolean;
  blockedUserIds?: string[]; // IDs of users blocked by this user
  verificationData?: {
    reportId: string;
    faceScanTimestamp: string;
    identityMatch?: string;
  };
}

export interface Chat {
  id: string;
  type: 'private' | 'group' | 'channel';
  name?: string; // For groups/channels
  avatar?: string;
  participants: string[]; // User IDs
  admins?: string[]; // User IDs
  description?: string;
  lastMessage?: Message;
  unreadCount?: number;
  unreadBy?: string[]; // List of user IDs who have marked this as unread
  restrictedTo?: string[]; // List of specific identities allowed
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  priority: MessagePriority;
  metadata?: {
    routingPath?: string; 
    networkType?: 'SECURE_MESH' | 'QUANTUM_UPLINK' | 'STANDARD_NET';
    translatedFrom?: string;
    originalText?: string;
  };
  reactions?: Record<string, string[]>; // { '👍': ['userId1', 'userId2'] }
}

export interface SmartSuggestion {
  text: string;
  tone: 'casual' | 'professional' | 'diplomatic' | 'authoritative';
  rationale?: string;
}

export interface AnalysisResult {
  summary: string;
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'hostile' | 'urgent';
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}
