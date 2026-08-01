import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/templates/PageLayout";
import { AuctionDetailSkeletonLoader, AuctionErrorState } from "../components/molecules/AuctionLoaders";
import type { Auction, Bid, Route } from "../types";
import { ArrowLeft } from "lucide-react";

interface AuctionDetailProps {
    auctionId: string;
    onNavigate: (route: Route) => void;
}

export const AuctionDetail: React.FC<AuctionDetailProps> = ({ auctionId, onNavigate }) => {
    const { user } = useAuth();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [bidAmount, setBidAmount] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [bidding, setBidding] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Carregar dados do leilão e histórico de lances
    const fetchAuctionData = async () => {
        try {
            setLoading(true);
            setFetchError(null);

            // Carregar leilão + veículo + imagens
            const { data: auctionData, error: auctionError } = await supabase
                .from("auctions")
                .select(`
                    *,
                    vehicle:vehicles(
                        *,
                        images:vehicle_images(*),
                        seller:profiles(*)
                    )
                `)
                .eq("id", auctionId)
                .single();

            if (auctionError) throw auctionError;
            setAuction(auctionData);

            // Sugerir próximo lance válido
            const minNextBid = (auctionData.current_price || auctionData.vehicle?.starting_price || 0) + auctionData.min_increment;
            setBidAmount(minNextBid.toString());

            // Carregar histórico de lances
            const { data: bidsData, error: bidsError } = await supabase
                .from("bids")
                .select(`
                    *,
                    bidder:profiles(full_name, avatar_url)
                `)
                .eq("auction_id", auctionId)
                .order("created_at", { ascending: false });

            if (bidsError) throw bidsError;
            setBids(bidsData || []);
        } catch (err: any) {
            console.error("Erro ao carregar leilão:", err);
            setFetchError(err.message || "Não foi possível carregar os detalhes do leilão.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auctionId) {
            fetchAuctionData();
        }

        // Supabase Realtime Subscription para Lances em Tempo Real
        const bidsSubscription = supabase
            .channel(`auction-${auctionId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "bids", filter: `auction_id=eq.${auctionId}` },
                () => {
                    fetchAuctionData();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "auctions", filter: `id=eq.${auctionId}` },
                () => {
                    fetchAuctionData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(bidsSubscription);
        };
    }, [auctionId]);

    // Função de Dar Lance invocando a RPC place_bid do Supabase
    const handlePlaceBid = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!user) {
            setMessage({ type: "error", text: "Você precisa estar logado para dar um lance." });
            return;
        }

        const amount = Number(bidAmount);
        if (!amount || isNaN(amount)) {
            setMessage({ type: "error", text: "Insira um valor válido." });
            return;
        }

        try {
            setBidding(true);

            // Chama a RPC definida na migração 004.sql
            const { error } = await supabase.rpc("place_bid", {
                p_auction_id: auctionId,
                p_amount: amount,
            });

            if (error) throw error;

            setMessage({ type: "success", text: "Lance realizado com sucesso!" });
            fetchAuctionData();
        } catch (err: any) {
            console.error("Erro ao dar lance:", err);
            setMessage({ type: "error", text: err.message || "Falha ao enviar lance." });
        } finally {
            setBidding(false);
        }
    };

    const vehicle = auction?.vehicle;
    const coverImage = vehicle?.images?.find((img) => img.is_cover)?.url ||
        vehicle?.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80";

    const minAllowed = auction && vehicle ? (auction.current_price || vehicle.starting_price) + auction.min_increment : 0;

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="auction-detail">
            <div className="w-full bg-black text-white min-h-[calc(100vh-140px)] p-6 md:p-12 font-sans">
                {loading ? (
                    <AuctionDetailSkeletonLoader />
                ) : fetchError || !auction || !vehicle ? (
                    <div className="max-w-4xl mx-auto">
                        <AuctionErrorState
                            title="Leilão não encontrado"
                            message={fetchError || "O leilão requisitado não existe ou foi desativado."}
                            onRetry={fetchAuctionData}
                            onBack={() => onNavigate("auctions")}
                        />
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Header Navegação */}
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                            <div>
                                <span className="text-xs uppercase font-bold text-amber-500 tracking-widest">{vehicle.brand}</span>
                                <h1 className="text-3xl font-black text-white">{vehicle.model}</h1>
                            </div>
                            <button
                                onClick={() => onNavigate("auctions")}
                                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Coluna Principal: Galeria & Detalhes do Veículo */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
                                    <img
                                        src={coverImage}
                                        alt={vehicle.model}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Detalhes Técnicos */}
                                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                    <h2 className="text-lg font-bold text-white border-b border-neutral-800 pb-3">Especificações do Veículo</h2>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="block text-xs text-neutral-400">Ano</span>
                                            <span className="font-semibold text-white">{vehicle.year_manufacture}/{vehicle.year_model || vehicle.year_manufacture}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-neutral-400">Quilometragem</span>
                                            <span className="font-semibold text-white">{vehicle.mileage.toLocaleString('pt-BR')} km</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-neutral-400">Cor</span>
                                            <span className="font-semibold text-white">{vehicle.color || "N/I"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-neutral-400">Condição</span>
                                            <span className="font-semibold text-white uppercase">{vehicle.condition}</span>
                                        </div>
                                    </div>

                                    {vehicle.description && (
                                        <div className="pt-3 border-t border-neutral-800">
                                            <span className="block text-xs text-neutral-400 mb-1">Descrição</span>
                                            <p className="text-neutral-300 text-sm leading-relaxed">{vehicle.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Coluna Lateral: Lances & Realtime */}
                            <div className="space-y-6">
                                {/* Painel do Lance Atual */}
                                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                                    <div>
                                        <span className="text-xs uppercase font-semibold text-neutral-400">Lance Atual</span>
                                        <div className="text-4xl font-black text-emerald-400 font-mono mt-1">
                                            R$ {(auction.current_price || vehicle.starting_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </div>
                                        <span className="text-xs text-neutral-400 mt-1 block">
                                            Incremento mínimo: R$ {auction.min_increment.toLocaleString('pt-BR')}
                                        </span>
                                    </div>

                                    {message && (
                                        <div className={`p-3 rounded-xl text-xs font-medium ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    {/* Form de Lance */}
                                    {auction.status === "ativo" ? (
                                        <form onSubmit={handlePlaceBid} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Seu Lance (R$)</label>
                                                <input
                                                    type="number"
                                                    min={minAllowed}
                                                    step={auction.min_increment}
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white font-mono font-bold text-lg focus:border-amber-500 focus:outline-none"
                                                />
                                                <span className="text-[10px] text-neutral-400 mt-1 block">Mínimo sugerido: R$ {minAllowed.toLocaleString('pt-BR')}</span>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={bidding}
                                                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-wider text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                                            >
                                                {bidding ? "Enviando Lance..." : "Confirmar Lance"}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-neutral-400 text-xs font-semibold uppercase">
                                            Leilão {auction.status}
                                        </div>
                                    )}
                                </div>

                                {/* Histórico de Lances */}
                                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Histórico de Lances ({bids.length})</h3>

                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {bids.length === 0 ? (
                                            <p className="text-xs text-neutral-400 text-center py-4">Nenhum lance registrado até o momento.</p>
                                        ) : (
                                            bids.map((bid, index) => (
                                                <div
                                                    key={bid.id}
                                                    className={`p-3 rounded-xl flex items-center justify-between text-xs border ${index === 0 ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-neutral-950 border-neutral-800 text-neutral-300"}`}
                                                >
                                                    <div>
                                                        <span className="font-bold block">{bid.bidder?.full_name || "Licitante"}</span>
                                                        <span className="text-[10px] text-neutral-400">{new Date(bid.created_at).toLocaleTimeString('pt-BR')}</span>
                                                    </div>
                                                    <div className="font-mono font-bold text-sm">
                                                        R$ {bid.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};
