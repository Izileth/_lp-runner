import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Vehicle } from '../types';
import { supabase } from '../lib/supabase';

interface VehicleContextType {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  fetchVehicleById: (id: string) => Promise<Vehicle | null>;
}

export const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('vehicles').select('*');
      if (err) throw err;
      setVehicles(data as Vehicle[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVehicleById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('vehicles').select('*').eq('id', id).single();
      if (err) throw err;
      return data as Vehicle;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <VehicleContext.Provider value={{ vehicles, isLoading, error, fetchVehicles, fetchVehicleById }}>
      {children}
    </VehicleContext.Provider>
  );
};
