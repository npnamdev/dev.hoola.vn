'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string | null;
  provider: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Mở popup window cho Google OAuth
export const loginWithGoogle = () => {
  // Dùng redirect thay vì popup
  window.location.href = `${API_URL}/auth/google`;
  // Không cần trả về Promise nữa, flow sẽ tiếp tục ở callback
  return;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data: AuthResponse = await response.json();
    return data.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Logout
export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    const data: AuthResponse = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

// Custom hook để sử dụng auth
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user khi mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setError('Failed to load user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
      await loadUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      const success = await logout();
      if (success) {
        setUser(null);
        setError(null);
      }
    } catch (err) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout: handleLogout,
    refetch: loadUser,
  };
};
