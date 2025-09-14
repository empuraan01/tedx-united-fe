import { useState, useEffect } from 'react';
import { profileAPI } from '@/lib/api';
import { ProfileUser } from '@/types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<ProfileUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // No authentication needed for getAllUsers
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
  }, []); // Only run once on mount

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}; 