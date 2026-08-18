export type Route =
  | "home"
  | "login"
  | "register"
  | "profile"
  | "auctions"
  | "create-auction"
  | "edit-auction"
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

export type UserRole = "bidder" | "creator" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  cpf_cnpj?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
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
  created_at: string;
}

export interface Vehicle {
  id: string;
  seller_id: string;
  brand: string;
  model: string;
  year_manufacture: number;
  year_model?: number | null;
  mileage: number;
  color?: string | null;
  plate?: string | null;
  vin?: string | null;
  condition: VehicleCondition;
  description?: string | null;
  fipe_value?: number | null;
  starting_price: number;
  reserve_price?: number | null;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
  images?: VehicleImage[];
  seller?: Profile;
}

export interface Auction {
  id: string;
  vehicle_id: string;
  status: AuctionStatus;
  starts_at: string;
  ends_at: string;
  min_increment: number;
  current_price?: number | null;
  winner_id?: string | null;
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

export interface Order {
  id: string;
  auction_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: "pendente" | "pago" | "cancelado";
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: string;
  status: "pendente" | "aprovado" | "recusado";
  provider_reference?: string | null;
  paid_at?: string | null;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  vehicle_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message?: string | null;
  read: boolean;
  created_at: string;
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
