import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/templates/PageLayout";
import { usePageAnimations } from "../hooks/usePageAnimations";
import { AuctionDetailSkeletonLoader, AuctionErrorState } from "../components/molecules/AuctionLoaders";
import Button from "../components/atoms/Button";
import FloatingPill from "../components/atoms/FloatingPill";
import type { Auction, Bid, Route } from "../types";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { extractIdFromSlug } from "../lib/utils";

interface AuctionDetailProps {
    auctionId: string;
    onNavigate: (route: Route, itemId?: string) => void;
}


const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80";

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

    // Índice da imagem ativa na galeria (o veículo pode ter várias fotos vindas do banco)
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    // Carregar dados do leilão e histórico de lances
    const fetchAuctionData = useCallback(async (isInitialLoad = false) => {
        try {
            if (isInitialLoad) setLoading(true);
            setFetchError(null);

            const actualId = extractIdFromSlug(auctionId);
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
                .eq("id", actualId)
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
                .eq("auction_id", actualId)
                .order("created_at", { ascending: false });

            if (bidsError) throw bidsError;
            setBids(bidsData || []);
        } catch (err: unknown) {
            console.error("Erro ao carregar leilão:", err);
            setFetchError(err instanceof Error ? err.message : "Não foi possível carregar os detalhes do leilão.");
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    }, [auctionId]);

    // FIX: a busca inicial (fetchAuctionData(true)) estava faltando aqui.
    // O effect só registrava a subscription do Realtime, que só dispara em
    // eventos futuros de INSERT/UPDATE — nada chamava o banco no mount,
    // então `loading` (iniciado como true) nunca virava false: loader infinito.
    useEffect(() => {
        if (!auctionId) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveImageIndex(0);
        fetchAuctionData(true);

        const actualId = extractIdFromSlug(auctionId);
        const bidsSubscription = supabase
            .channel(`auction-${actualId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "bids", filter: `auction_id=eq.${actualId}` },
                () => fetchAuctionData()
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "auctions", filter: `id=eq.${actualId}` },
                () => fetchAuctionData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(bidsSubscription);
        };
    }, [auctionId, fetchAuctionData]);

    useEffect(() => {
        if (auction?.vehicle) {
            document.title = `${auction.vehicle.brand} ${auction.vehicle.model} - lp-space`;
        } else {
            document.title = "Leilão de Veículo - lp-space";
        }
    }, [auction]);

    const vehicle = auction?.vehicle;
    
    // Lista de imagens ordenada: capa primeiro (se marcada), depois as demais.
    // Um veículo pode ter várias fotos (5+) vindas de vehicle_images.
    const galleryImages = React.useMemo(() => {
        const images = vehicle?.images ?? [];
        if (images.length === 0) return [FALLBACK_IMAGE];

        const cover = images.find((img) => img.is_cover);
        const rest = images.filter((img) => img !== cover);
        return [...(cover ? [cover] : []), ...rest].map((img) => img.url);
    }, [vehicle?.images]);

    const safeActiveImageIndex = galleryImages.length === 0 ? 0 : activeImageIndex % galleryImages.length;

    const currentImage = galleryImages[safeActiveImageIndex] || FALLBACK_IMAGE;

    const goToPrevImage = () => {
        setActiveImageIndex((prev) => {
            if (galleryImages.length === 0) return 0;
            return (prev - 1 + galleryImages.length) % galleryImages.length;
        });
    };

    const goToNextImage = () => {
        setActiveImageIndex((prev) => {
            if (galleryImages.length === 0) return 0;
            return (prev + 1) % galleryImages.length;
        });
    };

    const minAllowed = auction && vehicle ? (auction.current_price || vehicle.starting_price) + auction.min_increment : 0;

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Considera encerrado se o status for "encerrado" OU se o tempo atual já ultrapassou o `ends_at`
    const isTimeExpired = auction?.ends_at ? currentTime >= new Date(auction.ends_at) : false;
    const isEnded = auction?.status === "encerrado" || isTimeExpired;

    const hasBids = bids.length > 0;
    const winningBid = hasBids ? bids[0] : null;
    const isWinner = user && winningBid && winningBid.bidder_id === user.id;
    const isLoser = user && !isWinner && bids.some(b => b.bidder_id === user.id);

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

        if (amount < minAllowed) {
            setMessage({
                type: "error",
                text: `O lance mínimo é R$ ${minAllowed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
            });
            return;
        }

        try {
            setBidding(true);
            const actualId = extractIdFromSlug(auctionId);
            const { error } = await supabase.rpc("place_bid", {
                p_auction_id: actualId,
                p_amount: amount,
            });

            if (error) throw error;
            setMessage({ type: "success", text: "Lance realizado com sucesso!" });
            fetchAuctionData();
        } catch (err: unknown) {
            console.error("Erro ao dar lance:", err);
            setMessage({ type: "error", text: err instanceof Error ? err.message : "Falha ao enviar lance." });
        } finally {
            setBidding(false);
        }
    };

    if (loading) {
        return (
            <PageLayout onNavigate={onNavigate} currentRoute="auction-detail">
                <AuctionDetailSkeletonLoader />
            </PageLayout>
        );
    }

    if (fetchError || !auction) {
        return (
            <PageLayout onNavigate={onNavigate} currentRoute="auction-detail">
                <AuctionErrorState
                    message={fetchError || "Leilão não encontrado."}
                    onRetry={() => fetchAuctionData(true)}
                    onBack={() => onNavigate("auctions")}
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="auction-detail">
            <section ref={pageRef} className="relative w-full overflow-hidden">
                {/* ---------- WORDMARK + PRODUCT IMAGE GALLERY ---------- */}
                <div className="relative flex items-center justify-center px-4 min-h-[280px] sm:min-h-[380px] lg:min-h-[460px]">
                    {/* Decorative floating pills */}
                    <FloatingPill className="left-[8%] top-[18%] w-10 h-6 sm:w-14 sm:h-8 rotate-[-20deg] floating-pill" />
                    <FloatingPill className="left-[20%] top-[8%] w-7 h-4 sm:w-10 sm:h-6 rotate-[15deg] blur-[1px] floating-pill" />
                    <FloatingPill className="right-[10%] top-[12%] w-10 h-6 sm:w-14 sm:h-8 rotate-[25deg] floating-pill" />
                    <FloatingPill className="right-[22%] bottom-[15%] w-8 h-5 sm:w-11 sm:h-7 rotate-[-10deg] blur-[1px] floating-pill" />

                    {/* Wordmark (Behind) */}
                    <h1
                        className="select-none text-[22vw] sm:text-[18vw] lg:text-[14vw] leading-[0.8] text-transparent whitespace-nowrap font-display uppercase anim-title absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ WebkitTextStroke: "2px rgba(0, 0, 0, 0.08)", letterSpacing: "-0.04em" }}
                    >
                        {vehicle?.brand}
                    </h1>

                    {/* Product image, centered on top of the wordmark */}
                    <div className="relative z-10 flex flex-col items-center w-[70%] sm:w-[50%] lg:w-[40%] anim-fade-up group">
                        <div className="relative w-full aspect-[16/9] flex items-center justify-center">
                            <img
                                src={currentImage}
                                alt={vehicle?.model || "Veículo"}
                                className="w-full h-full object-cover rounded-xl shadow-2xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] grayscale hover:grayscale-0 transition-all duration-700"
                            />

                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={goToPrevImage}
                                        aria-label="Imagem anterior"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-black-main" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goToNextImage}
                                        aria-label="Próxima imagem"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight className="w-4 h-4 text-black-main" />
                                    </button>

                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                                        {galleryImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                aria-label={`Ver imagem ${idx + 1}`}
                                                onClick={() => setActiveImageIndex(idx)}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === safeActiveImageIndex ? "bg-black-main w-4" : "bg-black-main/30"}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Brand text directly below image */}
                        <div className="mt-6 inline-flex items-center justify-center px-5 py-2 bg-white/80 backdrop-blur-sm shadow-sm border border-border-main rounded-full transform transition-transform hover:scale-105">
                            <span className="text-[11px] font-bold tracking-widest text-black-main uppercase">{vehicle?.brand}</span>
                        </div>
                    </div>
                </div>

                {/* ---------- THUMBNAIL STRIP (só aparece se houver mais de uma imagem) ---------- */}
                {galleryImages.length > 1 && (
                    <div className="flex items-center justify-center gap-2 px-4 pb-6 flex-wrap">
                        {galleryImages.map((src, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImageIndex(idx)}
                                className={`w-14 h-10 sm:w-16 sm:h-12 rounded-md overflow-hidden border-2 transition-all ${idx === safeActiveImageIndex ? "border-black-main" : "border-transparent opacity-60 hover:opacity-100"}`}
                            >
                                <img src={src} alt={`${vehicle?.model || "Veículo"} - foto ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

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
                                {isEnded ? (
                                    <div className="mb-6 pb-6 border-b border-border-main">
                                        <div className="p-4 rounded-md bg-gray-100 border border-border-main text-center text-gray-sec text-[10px] font-bold uppercase tracking-widest mb-4">
                                            Leilão Encerrado
                                        </div>
                                        
                                        {isWinner && (
                                            <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-bold mb-4 text-center">
                                                🎉 Parabéns! Você arrematou este veículo!
                                            </div>
                                        )}
                                        {isLoser && (
                                            <div className="p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-4 text-center">
                                                Que pena, seu lance foi superado. Continue tentando em outros leilões!
                                            </div>
                                        )}

                                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-sec mb-1 mt-4">
                                            Valor de Arremate
                                        </p>
                                        <p className="text-4xl font-black text-black-main font-display tracking-tight">
                                            R$ {(auction?.current_price || vehicle?.starting_price)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                ) : (
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
                                )}

                                {!isEnded && message && (
                                    <div className={`p-4 rounded-lg text-xs font-bold mb-6 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                        {message.text}
                                    </div>
                                )}

                                {!isEnded && auction?.status === "ativo" ? (
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
                                    !isEnded && (
                                        <div className="p-4 rounded-md bg-gray-100 border border-border-main text-center text-gray-sec text-[10px] font-bold uppercase tracking-widest">
                                            Leilão {auction?.status}
                                        </div>
                                    )
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