import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/templates/PageLayout";
import { usePageAnimations } from "../hooks/usePageAnimations";
import { AuctionDetailSkeletonLoader, AuctionErrorState } from "../components/molecules/AuctionLoaders";
import Button from "../components/atoms/Button";
import type { Auction, Bid, Route } from "../types";
import { ArrowLeft } from "lucide-react";

interface AuctionDetailProps {
    auctionId: string;
    onNavigate: (route: Route) => void;
}

export const AuctionDetail: React.FC<AuctionDetailProps> = ({ auctionId, onNavigate }) => {
    const pageRef = useRef<HTMLDivElement>(null);
    usePageAnimations(pageRef);

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

            const minNextBid = (auctionData.current_price || auctionData.vehicle?.starting_price || 0) + auctionData.min_increment;
            setBidAmount(minNextBid.toString());

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

        const bidsSubscription = supabase
            .channel(`auction-${auctionId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "bids", filter: `auction_id=eq.${auctionId}` },
                () => fetchAuctionData()
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "auctions", filter: `id=eq.${auctionId}` },
                () => fetchAuctionData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(bidsSubscription);
        };
    }, [auctionId]);

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
            <div ref={pageRef} className="w-full relative flex-1 px-6 py-12 md:py-20 flex justify-center">
                {loading ? (
                    <div className="w-full max-w-6xl anim-fade-up"><AuctionDetailSkeletonLoader /></div>
                ) : fetchError || !auction || !vehicle ? (
                    <div className="w-full max-w-4xl anim-fade-up">
                        <AuctionErrorState
                            title="Leilão não encontrado"
                            message={fetchError || "O leilão requisitado não existe ou foi desativado."}
                            onRetry={fetchAuctionData}
                            onBack={() => onNavigate("auctions")}
                        />
                    </div>
                ) : (
                    <div className="w-full max-w-7xl space-y-12">
                        {/* Header Navegação */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border-main pb-8 anim-fade-up">
                            <div>
                                <span className="text-xs uppercase font-bold text-gray-sec tracking-widest">{vehicle.brand}</span>
                                <h1 className="text-4xl md:text-5xl font-black text-black-main font-display mt-1 uppercase tracking-tight">{vehicle.model}</h1>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => onNavigate("auctions")}
                                className="flex items-center gap-2 self-start sm:self-auto"
                            >
                                <ArrowLeft className="w-4 h-4" /> Voltar aos Leilões
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Coluna Principal: Galeria & Detalhes do Veículo */}
                            <div className="lg:col-span-2 space-y-10">
                                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-card-bg border border-border-main shadow-lg anim-stagger group">
                                    <img
                                        src={coverImage}
                                        alt={vehicle.model}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                </div>

                                {/* Detalhes Técnicos */}
                                <div className="showcase-card anim-stagger bg-card-bg border border-border-main rounded-2xl p-8 shadow-sm">
                                    <h2 className="text-lg font-black text-black-main font-display uppercase tracking-wider border-b border-border-main pb-4 mb-6">Especificações do Veículo</h2>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                        <div>
                                            <span className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-1">Ano</span>
                                            <span className="font-semibold text-black-main text-lg">{vehicle.year_manufacture}/{vehicle.year_model || vehicle.year_manufacture}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-1">KM</span>
                                            <span className="font-semibold text-black-main text-lg">{vehicle.mileage.toLocaleString('pt-BR')}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-1">Cor</span>
                                            <span className="font-semibold text-black-main text-lg capitalize">{vehicle.color || "N/I"}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-1">Condição</span>
                                            <span className="font-semibold text-black-main text-lg capitalize">{vehicle.condition}</span>
                                        </div>
                                    </div>

                                    {vehicle.description && (
                                        <div className="pt-6 mt-6 border-t border-border-main">
                                            <span className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Descrição</span>
                                            <p className="text-gray-sec text-sm leading-relaxed">{vehicle.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Coluna Lateral: Lances & Realtime */}
                            <div className="space-y-8">
                                {/* Painel do Lance Atual */}
                                <div className="showcase-card anim-stagger bg-card-bg border border-border-main rounded-2xl p-8 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-black-main/5 to-transparent rounded-full blur-xl pointer-events-none"></div>

                                    <div className="relative z-10 mb-8">
                                        <span className="text-xs font-bold tracking-widest text-gray-sec uppercase">Lance Atual</span>
                                        <div className="text-4xl md:text-5xl font-black text-black-main font-display mt-2 tracking-tighter">
                                            R$ {(auction.current_price || vehicle.starting_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </div>
                                        <span className="text-xs font-medium text-gray-sec mt-2 block">
                                            Incremento mínimo: R$ {auction.min_increment.toLocaleString('pt-BR')}
                                        </span>
                                    </div>

                                    {message && (
                                        <div className={`p-4 rounded-xl text-sm font-medium mb-6 relative z-10 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    {/* Form de Lance */}
                                    {auction.status === "ativo" ? (
                                        <form onSubmit={handlePlaceBid} className="space-y-6 relative z-10">
                                            <div>
                                                <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Seu Lance (R$)</label>
                                                <input
                                                    type="number"
                                                    min={minAllowed}
                                                    step={auction.min_increment}
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    className="w-full bg-white border border-border-main rounded-xl px-4 py-4 text-black-main font-mono font-bold text-xl focus:border-black-main focus:outline-none transition-colors shadow-inner"
                                                />
                                                <span className="text-[10px] text-gray-sec mt-2 block">Mínimo sugerido: R$ {minAllowed.toLocaleString('pt-BR')}</span>
                                            </div>

                                            <Button
                                                type="submit"
                                                variant="primary"
                                                disabled={bidding}
                                                className="w-full py-4 text-center justify-center text-sm"
                                            >
                                                {bidding ? "Processando..." : "Confirmar Lance"}
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-gray-100 border border-border-main text-center text-gray-sec text-xs font-bold uppercase tracking-widest relative z-10">
                                            Leilão {auction.status}
                                        </div>
                                    )}
                                </div>

                                {/* Histórico de Lances */}
                                <div className="showcase-card anim-stagger bg-card-bg border border-border-main rounded-2xl p-8 shadow-sm">
                                    <h3 className="text-sm font-black text-black-main font-display uppercase tracking-widest border-b border-border-main pb-4 mb-4">Histórico de Lances ({bids.length})</h3>

                                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                        {bids.length === 0 ? (
                                            <p className="text-sm text-gray-sec text-center py-6">Seja o primeiro a dar um lance.</p>
                                        ) : (
                                            bids.map((bid, index) => (
                                                <div
                                                    key={bid.id}
                                                    className={`p-4 rounded-xl flex items-center justify-between text-sm transition-all ${index === 0 ? "bg-black-main text-white shadow-md transform scale-[1.02]" : "bg-white border border-border-main text-black-main"}`}
                                                >
                                                    <div>
                                                        <span className="font-bold block text-xs uppercase tracking-wider">{bid.bidder?.full_name || "Licitante"}</span>
                                                        <span className={`text-[10px] ${index === 0 ? "text-gray-300" : "text-gray-sec"}`}>{new Date(bid.created_at).toLocaleTimeString('pt-BR')}</span>
                                                    </div>
                                                    <div className="font-mono font-black text-base tracking-tighter">
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
