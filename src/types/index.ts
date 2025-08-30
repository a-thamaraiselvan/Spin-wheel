export interface Staff {
  id: number;
  name: string;
  department: string;
  favorite_thing_1: string;
  favorite_thing_2: string;
  favorite_thing_3: string;
  status: 'pending' | 'completed';
  spin_count: number;
  created_at: string;
}

export interface SpinResult {
  id: number;
  staff_id: number;
  actor_name: string;
  ai_quote: string;
  spun_at: string;
}

export interface Analytics {
  totalStaff: number;
  pendingStaff: number;
  completedStaff: number;
  totalSpins: number;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  department: string;
  favoriteThings: string[];
}