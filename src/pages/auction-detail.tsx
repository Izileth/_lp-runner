import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/templates/PageLayout";
import { usePageAnimations } from "../hooks/usePageAnimations";
//import { AuctionDetailSkeletonLoader, AuctionErrorState } from "../components/molecules/AuctionLoaders";
import Button from "../components/atoms/Button";
import FloatingPill from "../components/atoms/FloatingPill";
import type { Auction, Bid, Route } from "../types";
import { ArrowLeft } from "lucide-react";

interface AuctionDetailProps {
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
            <section ref={pageRef} className="relative w-full overflow-hidden">
                {/* ---------- WORDMARK + PRODUCT IMAGE ---------- */}
                <div className="relative flex items-center justify-center px-4 min-h-[280px] sm:min-h-[380px] lg:min-h-[460px]">
                    {/* Decorative floating pills */}
                    <FloatingPill className="left-[8%] top-[18%] w-10 h-6 sm:w-14 sm:h-8 rotate-[-20deg] floating-pill" />
                    <FloatingPill className="left-[20%] top-[8%] w-7 h-4 sm:w-10 sm:h-6 rotate-[15deg] blur-[1px] floating-pill" />
                    <FloatingPill className="right-[10%] top-[12%] w-10 h-6 sm:w-14 sm:h-8 rotate-[25deg] floating-pill" />
                    <FloatingPill className="right-[22%] bottom-[15%] w-8 h-5 sm:w-11 sm:h-7 rotate-[-10deg] blur-[1px] floating-pill" />

                    {/* Wordmark */}
                    <h1
                        className="select-none text-[20vw] sm:text-[16vw] lg:text-[11vw] leading-[0.8] text-black-main whitespace-nowrap font-display uppercase anim-title absolute z-0 opacity-[0.03]"
                        style={{ letterSpacing: "-0.03em" }}
                    >
                        {vehicle?.brand}
                    </h1>

                    {/* Product image, centered on top of the wordmark */}
                    <div className="relative z-10 w-[70%] sm:w-[50%] lg:w-[40%] aspect-[16/9] flex items-center justify-center anim-fade-up">
                        <img
                            src={coverImage}
                            alt={vehicle?.model}
                            className="w-full h-full object-cover rounded-xl shadow-2xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>

                {/* ---------- PRODUCT INFO BAR ---------- */}
                <div className="relative z-20 px-6 sm:px-10 lg:px-14 pb-10 sm:pb-14 max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <Button
                            variant="outline"
                            onClick={() => onNavigate("auctions")}
                            className="flex items-center gap-2 self-start px-4 py-2 text-xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                        </Button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Title block & Specs */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div>
                                <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-gray-sec">
                                    {vehicle?.brand}
                                </p>
                                <h2 className="text-3xl sm:text-5xl font-black text-black-main font-display leading-none uppercase tracking-tight">
                                    {vehicle?.model}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-sec mt-2 max-w-lg leading-relaxed">
                                    {vehicle?.description || `Lote exclusivo ${vehicle?.brand} ${vehicle?.model}. Condição: ${vehicle?.condition}.`}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-border-main">
                                <div>
                                    <span className="block text-[9px] font-bold tracking-widest text-gray-sec uppercase mb-1">Ano</span>
                                    <span className="font-semibold text-black-main">{vehicle?.year_manufacture}/{vehicle?.year_model || vehicle?.year_manufacture}</span>
                                </div>
                                <div>
                                    <span className="block text-[9px] font-bold tracking-widest text-gray-sec uppercase mb-1">KM</span>
                                    <span className="font-semibold text-black-main">{vehicle?.mileage?.toLocaleString('pt-BR')}</span>
                                </div>
                                <div>
                                    <span className="block text-[9px] font-bold tracking-widest text-gray-sec uppercase mb-1">Cor</span>
                                    <span className="font-semibold text-black-main capitalize">{vehicle?.color || "N/I"}</span>
                                </div>
                                <div>
                                    <span className="block text-[9px] font-bold tracking-widest text-gray-sec uppercase mb-1">Condição</span>
                                    <span className="font-semibold text-black-main capitalize">{vehicle?.condition}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bidding Block */}
                        <div className="w-full lg:w-[400px] shrink-0">
                            <div className="bg-card-bg border border-border-main rounded-xl p-6 shadow-xl">
                                <div className="mb-6 pb-6 border-b border-border-main">
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-sec mb-1">
                                        Lance Atual
                                    </p>
                                    <p className="text-4xl font-black text-black-main font-display tracking-tight">
                                        R$ {(auction?.current_price || vehicle?.starting_price)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <span className="text-[10px] font-medium text-gray-sec mt-1 block">
                                        Incremento mínimo: R$ {auction?.min_increment?.toLocaleString('pt-BR')}
                                    </span>
                                </div>

                                {message && (
                                    <div className={`p-4 rounded-lg text-xs font-bold mb-6 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                        {message.text}
                                    </div>
                                )}

                                {auction?.status === "ativo" ? (
                                    <form onSubmit={handlePlaceBid} className="space-y-4">
                                        <div>
                                            <label className="block text-[9px] font-bold tracking-widest text-gray-sec uppercase mb-2">Seu Lance (R$)</label>
                                            <input
                                                type="number"
                                                min={minAllowed}
                                                step={auction?.min_increment}
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                className="w-full bg-white border border-border-main rounded-md px-4 py-3 text-black-main font-bold focus:border-black-main focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={bidding}
                                            className="w-full py-4 uppercase tracking-wider text-xs font-bold justify-center"
                                        >
                                            {bidding ? "Processando..." : "Confirmar Lance"}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="p-4 rounded-md bg-gray-100 border border-border-main text-center text-gray-sec text-[10px] font-bold uppercase tracking-widest">
                                        Leilão {auction?.status}
                                    </div>
                                )}
                            </div>

                            {/* Histórico */}
                            <div className="mt-6">
                                <h3 className="text-[10px] font-bold text-gray-sec uppercase tracking-widest mb-4">Histórico de Lances ({bids.length})</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {bids.length === 0 ? (
                                        <p className="text-xs text-gray-sec py-2">Seja o primeiro a dar um lance.</p>
                                    ) : (
                                        bids.map((bid, index) => (
                                            <div
                                                key={bid.id}
                                                className={`p-3 rounded-lg flex items-center justify-between text-xs transition-all ${index === 0 ? "bg-black-main text-white font-bold" : "bg-white border border-border-main text-black-main"}`}
                                            >
                                                <span>{bid.bidder?.full_name || "Licitante"}</span>
                                                <span className="font-mono">R$ {bid.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};
