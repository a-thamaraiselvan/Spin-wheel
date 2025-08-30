const getApiBaseUrl = () => {
  return import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:3001/api';
};

export interface Staff {
  id: number;
  name: string;
  department: string;
  favorite_thing_1: string;
  favorite_thing_2: string;
  favorite_thing_3: string;
  status: 'pending' | 'completed';
  spin_count: number;
}

export interface Analytics {
  totalStaff: number;
  pendingStaff: number;
  completedStaff: number;
  totalSpins: number;
}

export interface SpinResult {
  id: number;
  staff_id: number;
  actor_name: string;
  ai_quote: string;
  spun_at: string;
}

export const api = {
  // Staff registration
  registerStaff: async (data: {
    name: string;
    department: string;
    favoriteThings: string[];
  }) => {
    const response = await fetch(`${getApiBaseUrl()}/staff/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Admin authentication
  adminLogin: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`${getApiBaseUrl()}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Get all staff
  getStaff: async (): Promise<Staff[]> => {
    const response = await fetch(`${getApiBaseUrl()}/staff`);
    return response.json();
  },

  // Get analytics
  getAnalytics: async (): Promise<Analytics> => {
    const response = await fetch(`${getApiBaseUrl()}/analytics`);
    return response.json();
  },

  // Generate AI quote
  generateQuote: async (data: {
    staffName: string;
    department: string;
    favoriteThings: string[];
    actorName: string;
  }) => {
    const response = await fetch(`${getApiBaseUrl()}/generate-quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Save spin result
  saveSpinResult: async (data: {
    staffId: number;
    actorName: string;
    aiQuote: string;
  }) => {
    const response = await fetch(`${getApiBaseUrl()}/spin/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Get staff spin history
  getStaffSpins: async (staffId: number): Promise<SpinResult[]> => {
    const response = await fetch(`${getApiBaseUrl()}/staff/${staffId}/spins`);
    return response.json();
  },
};