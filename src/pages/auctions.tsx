import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { VehicleCard } from "../components/molecules/VehicleCard";
import { AuctionSkeletonLoader, AuctionErrorState } from "../components/molecules/AuctionLoaders";
import PageLayout from "../components/templates/PageLayout";
import type { Auction, Route } from "../types";
import { Plus } from "lucide-react";

interface AuctionsProps {
    onNavigate: (route: Route, auctionId?: string) => void;
}

export const Auctions: React.FC<AuctionsProps> = ({ onNavigate }) => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"todos" | "ativo" | "agendado">("todos");

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            setError(null);

            let query = supabase
                .from("auctions")
                .select(`
                    *,
                    vehicle:vehicles(
                        *,
                        images:vehicle_images(*)
                    )
                `)
                .order("created_at", { ascending: false });

            if (filter !== "todos") {
                query = query.eq("status", filter);
            }

            const { data, error: err } = await query;
            if (err) throw err;

            setAuctions(data || []);
        } catch (err: any) {
            console.error("Erro ao buscar leilões:", err);
            setError(err.message || "Não foi possível carregar a lista de leilões.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, [filter]);

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="auctions">
            <div className="w-full bg-black text-white min-h-[calc(100vh-140px)] p-6 md:p-12 font-sans">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header da Página */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-8">
                        <div>
                            <span className="text-xs uppercase font-extrabold text-amber-500 tracking-widest">
                                Plataforma de Leilões
                            </span>
                            <h1 className="text-4xl font-black text-white tracking-tight mt-1">
                                Veículos em Leilão
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onNavigate("create-auction")}
                                className="px-5 py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Criar Leilão
                            </button>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilter("todos")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                filter === "todos"
                                    ? "bg-white text-black"
                                    : "bg-neutral-900 text-neutral-400 hover:text-white"
                            }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilter("ativo")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                filter === "ativo"
                                    ? "bg-emerald-500 text-black"
                                    : "bg-neutral-900 text-neutral-400 hover:text-white"
                            }`}
                        >
                            Ao Vivo
                        </button>
                        <button
                            onClick={() => setFilter("agendado")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                filter === "agendado"
                                    ? "bg-amber-500 text-black"
                                    : "bg-neutral-900 text-neutral-400 hover:text-white"
                            }`}
                        >
                            Em Breve
                        </button>
                    </div>

                    {/* Conteúdo: Loading / Erro / Cards */}
                    {loading ? (
                        <AuctionSkeletonLoader />
                    ) : error ? (
                        <AuctionErrorState
                            title="Erro ao Carregar Leilões"
                            message={error}
                            onRetry={fetchAuctions}
                        />
                    ) : auctions.length === 0 ? (
                        <div className="text-center py-20 bg-neutral-900/50 border border-neutral-800 rounded-3xl space-y-4 my-8">
                            <p className="text-neutral-400 text-sm">Nenhum leilão encontrado para este filtro.</p>
                            <button
                                onClick={() => onNavigate("create-auction")}
                                className="px-5 py-2.5 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl cursor-pointer"
                            >
                                Cadastrar o Primeiro Leilão
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {auctions.map((auction) => (
                                <VehicleCard
                                    key={auction.id}
                                    auction={auction}
                                    onSelect={(id) => onNavigate("auction-detail", id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};
