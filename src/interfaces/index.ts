export interface ProfileData {
    id?: string;
    full_name: string;
    cpf_cnpj?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
    role?: "bidder" | "creator" | "admin";
    is_verified?: boolean;
    updated_at?: string;
}