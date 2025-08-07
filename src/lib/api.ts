import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Check authentication status
  getAuthStatus: () => api.get('/auth/status'),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Check email authorization
  checkEmailAuthorization: (email: string) => 
    api.post('/auth/check-email', { email }),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Google OAuth URLs
  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  getGoogleCallbackUrl: () => `${API_BASE_URL}/auth/google/callback`,
};

// Profile API functions
export const profileAPI = {
  // Get current user's profile
  getMyProfile: () => api.get('/profile/my-profile'),
  
  // Get all users
  getAllUsers: () => api.get('/profile'),
  
  // Update profile
  updateProfile: (data: {
    nickname?: string;
    year?: number;
    interests?: string[];
    bio?: string;
    emojis?: string[];
  }) => api.put('/profile/update', data),
  
  // Get specific user's profile
  getUserProfile: (userId: string) => api.get(`/profile/${userId}`),
  
  // Upload profile picture
  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post('/profile/upload-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Get current user's profile picture
  getMyProfilePicture: () => api.get('/profile/my-picture', {
    responseType: 'blob',
  }),
  
  // Get specific user's profile picture
  getUserProfilePicture: (userId: string) => api.get(`/profile/picture/${userId}`, {
    responseType: 'blob',
  }),
  
  // Delete profile picture
  deleteProfilePicture: () => api.delete('/profile/picture'),
};

// General API functions
export const generalAPI = {
  // Get server info
  getServerInfo: () => api.get('/'),
};

export default api; 