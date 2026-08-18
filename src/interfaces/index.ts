export * from '../types';

export type ProfileData = Partial<Omit<import('../types').Profile, 'id' | 'created_at' | 'updated_at'>> & {
  id?: string;
};