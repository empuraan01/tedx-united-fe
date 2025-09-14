import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});


// Helper function to create authenticated requests using Clerk user info
const createAuthenticatedRequest = async (user: any) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (user) {
    console.log('🔐 Creating authenticated request for user:', user.id);
    headers['x-clerk-user-id'] = user.id;
    headers['x-clerk-user-name'] = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.username || user.fullName || 'User';
    headers['x-clerk-user-email'] = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || '';
    headers['x-clerk-user-image'] = user.imageUrl || '';
    
    console.log('📤 Auth headers:', {
      'x-clerk-user-id': headers['x-clerk-user-id'],
      'x-clerk-user-name': headers['x-clerk-user-name'],
      'x-clerk-user-email': headers['x-clerk-user-email']
    });
  } else {
    console.log('❌ No user provided for authenticated request');
  }
  
  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers,
  });
};

// Response interceptor for logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API functions - These are mostly not needed with Clerk, but keeping for compatibility
export const authAPI = {
  // Check authentication status - Clerk handles this
  getAuthStatus: async (user?: any) => {
    if (user) {
      const authApi = await createAuthenticatedRequest(user);
      return authApi.get('/auth/status');
    }
    return api.get('/auth/status');
  },
  
  // Get current user
  getCurrentUser: async (user?: any) => {
    if (user) {
      const authApi = await createAuthenticatedRequest(user);
      return authApi.get('/auth/me');
    }
    return api.get('/auth/me');
  },
  
  // Check email authorization
  checkEmailAuthorization: (email: string) => 
    api.post('/auth/check-email', { email }),
  
  // Logout - Clerk handles this
  logout: () => api.post('/auth/logout'),
  
  // Google OAuth URLs - Clerk handles this
  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  getGoogleCallbackUrl: () => `${API_BASE_URL}/auth/google/callback`,
};

// Profile API functions with Clerk authentication support
export const profileAPI = {
  // Get current user's profile (REQUIRES AUTH)
  getMyProfile: async (user?: any) => {
    if (user) {
      const authApi = await createAuthenticatedRequest(user);
      return authApi.get('/profile/my-profile');
    }
    return api.get('/profile/my-profile');
  },
  
  // Get all users (NO AUTH REQUIRED)
  getAllUsers: async () => {
    return api.get('/profile');
  },
  
  // Update profile
  updateProfile: async (data: {
    nickname?: string;
    year?: number;
    interests?: string[];
    bio?: string;
    emojis?: string[];
  }, user?: any) => {
    if (user) {
      const authApi = await createAuthenticatedRequest(user);
      return authApi.put('/profile/update', data);
    }
    return api.put('/profile/update', data);
  },
  
  // Get specific user's profile (NO AUTH REQUIRED)
  getUserProfile: async (userId: string) => {
    return api.get(`/profile/${userId}`);
  },
  
  // Upload profile picture
  uploadProfilePicture: async (file: File, user?: any) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    if (user) {
      const headers: Record<string, string> = {
        'Content-Type': 'multipart/form-data',
      };
      
      headers['x-clerk-user-id'] = user.id;
      headers['x-clerk-user-name'] = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.username || 'User';
      headers['x-clerk-user-email'] = user.emailAddresses?.[0]?.emailAddress || '';
      headers['x-clerk-user-image'] = user.imageUrl || '';
      
      return axios.post(`${API_BASE_URL}/profile/upload-picture`, formData, {
        withCredentials: true,
        headers,
      });
    }
    
    return api.post('/profile/upload-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get current user's profile picture
  getMyProfilePicture: async (user?: any) => {
    if (user) {
      const authApi = await createAuthenticatedRequest(user);
      return authApi.get('/profile/my-picture', { responseType: 'blob' });
    }
    return api.get('/profile/my-picture', { responseType: 'blob' });
  },
  
  // Get specific user's profile picture
  getUserProfilePicture: async (userId: string, user?: any) => {
    if (user) {
      const authApi = await createAuthenticatedRequest(user);
      return authApi.get(`/profile/picture/${userId}`, { responseType: 'blob' });
    }
    return api.get(`/profile/picture/${userId}`, { responseType: 'blob' });
  },
  
  // Delete profile picture
  deleteProfilePicture: async (user?: any) => {
    if (user) {
      const authApi = await createAuthenticatedRequest(user);
      return authApi.delete('/profile/picture');
    }
    return api.delete('/profile/picture');
  },
};

// Gallery API functions
export const galleryAPI = {
  // Get all album data from database
  getAlbums: async () => {
    return api.get('/albums');
  },
};

// General API functions
export const generalAPI = {
  // Get server info
  getServerInfo: () => api.get('/'),
};

export default api; 