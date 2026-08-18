import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Profile } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error: err } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (err) throw err;
      
      setProfile(data as Profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: err } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (err) throw err;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
