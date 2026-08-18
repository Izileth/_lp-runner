import { useContext } from 'react';
import { AuctionContext } from '../context/AuctionContext';

export const useAuctions = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuctions must be used within an AuctionProvider');
  }
  return context;
};
