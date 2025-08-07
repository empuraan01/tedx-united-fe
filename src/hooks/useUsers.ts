import { useState, useEffect } from 'react';
import { profileAPI } from '@/lib/api';

interface User {
  _id: string;
  displayName: string;
  email: string;
  nickname?: string;
  isAdmin?: boolean;
  emojis?: string[];
  year?: number;
  interests?: string[];
  bio?: string;
  hasProfilePicture?: boolean;
  createdAt: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileAPI.getAllUsers();
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}; 