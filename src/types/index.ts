// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: 'user' | 'moderator' | 'admin';
  isPremium?: boolean;
  premiumUntil?: Date;
  createdAt: Date;
  lastLoginAt?: Date;
  totalStudyMinutes?: number;
  studyStreak?: number;
}

// Study Room Types
export interface StudyRoom {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  isPrivate: boolean;
  members: string[];
  memberIds: string[];
  currentParticipants: number;
  maxMembers: number;
  category?: string;
  lastActivityAt?: Date;
}

// Message Types
export interface Message {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  message: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
}

// Report Types
export interface UserReport {
  id: string;
  reportedBy: string;
  reportedUserId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  action?: string;
}

// Statistics Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers24h: number;
  activeUsers7d: number;
  totalPremiumUsers: number;
  totalStudyMinutes: number;
  totalRooms: number;
  activeRooms: number;
  totalMessages: number;
  reportsCount: {
    pending: number;
    total: number;
  };
}

// Premium Subscription Types
export interface Subscription {
  userId: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  platform: 'ios' | 'android';
}

// Activity Types
export interface Activity {
  id: string;
  userId: string;
  type: 'study_session' | 'achievement' | 'room_join' | 'room_create';
  timestamp: Date;
  data: any;
  isPublic: boolean;
}

