import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Auction } from '../types';
import { supabase } from '../lib/supabase';

interface AuctionContextType {
  auctions: Auction[];
  isLoading: boolean;
  error: string | null;
  fetchAuctions: () => Promise<void>;
  fetchAuctionById: (id: string) => Promise<Auction | null>;
  placeBid: (auctionId: string, amount: number) => Promise<boolean>;
}

export const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuctions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('auctions').select('*, vehicle:vehicles(*)');
      if (err) throw err;
      setAuctions(data as Auction[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAuctionById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('auctions').select('*, vehicle:vehicles(*)').eq('id', id).single();
      if (err) throw err;
      return data as Auction;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const placeBid = useCallback(async (auctionId: string, amount: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.rpc('place_bid', {
        p_auction_id: auctionId,
        p_amount: amount
      });
      if (err) throw err;
      
      // Optionally fetch again to update the current auction
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuctionContext.Provider value={{ auctions, isLoading, error, fetchAuctions, fetchAuctionById, placeBid }}>
      {children}
    </AuctionContext.Provider>
  );
};
