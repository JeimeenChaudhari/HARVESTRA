import { useState, useEffect } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

// Simple demo user for development
const DEMO_USER: AuthUser = {
  id: 'demo-user-1',
  name: 'Demo Farmer',
  email: 'demo@harvestra.com',
  phone: '+91 9876543210'
};

export const useAuthUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, auto-login with demo user
    // In production, this would check for actual authentication state
    const initAuth = async () => {
      try {
        // Check if user profile exists, if not create it
        const profileResponse = await fetch(`/api/users/profile?userId=${DEMO_USER.id}`);
        
        if (!profileResponse.ok) {
          // Create demo user profile
          await fetch('/api/users/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: DEMO_USER.id,
              name: DEMO_USER.name,
              email: DEMO_USER.email,
              phone: DEMO_USER.phone,
              district: 'Kottayam',
              panchayat: 'Changanassery',
              primary_crop: 'Rice',
              avatar: '🌾'
            })
          });
        }

        // Update daily streak
        const today = new Date().toISOString().split('T')[0];
        await fetch('/api/users/streak', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: DEMO_USER.id,
            activityDate: today
          })
        });

        setUser(DEMO_USER);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(DEMO_USER); // Fallback to demo user
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};