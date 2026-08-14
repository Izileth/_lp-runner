export type Route =
  | "home"
  | "login"
  | "register"
  | "profile"
  | "auctions"
  | "create-auction"
  | "auction-detail"
  | "not-found";

export type VehicleCondition = "novo" | "semi_novo" | "usado" | "colecionador";
export type VehicleStatus =
  | "rascunho"
  | "em_analise"
  | "em_leilao"
  | "vendido"
  | "rejeitado";
export type AuctionStatus =
  | "rascunho"
  | "agendado"
  | "ativo"
  | "encerrado"
  | "cancelado";

export interface Profile {
  id: string;
  full_name: string;
  cpf_cnpj?: string;
  phone?: string;
  avatar_url?: string;
  role: "bidder" | "admin";
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  is_cover: boolean;
  position: number;
  created_at?: string;
}

export interface Vehicle {
  id: string;
  seller_id: string;
  brand: string;
  model: string;
  year_manufacture: number;
  year_model?: number;
  mileage: number;
  color?: string;
  plate?: string;
  vin?: string;
  condition: VehicleCondition;
  description?: string;
  fipe_value?: number;
  starting_price: number;
  reserve_price?: number;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
  images?: VehicleImage[];
  seller?: Profile;
}

export interface Condition {
  usado: "usado";
  semi_novo: "semi_novo";
  novo: "novo";
  colecionador: "colecionador";
}
export interface Auction {
  id: string;
  vehicle_id: string;
  status: AuctionStatus;
  starts_at: string;
  ends_at: string;
  min_increment: number;
  current_price?: number;
  winner_id?: string;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  bids_count?: number;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  bidder?: Profile;
}

export interface FinSpecs {
  material: string;
  base: string;
  depth: string;
  foil: string;
  configuration: string;
}

export interface FinProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  description: string;
  specs: FinSpecs;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  details?: string;
}

// --- Generic Error Types ---
export type ErrorSeverity = "info" | "warning" | "error" | "critical";

export interface AppError {
  message: string;
  code?: string;
  severity?: ErrorSeverity;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: AppError;
  status: number;
}
