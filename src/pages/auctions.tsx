import React, { useRef, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { smartCache } from "../lib/cache";
import { VehicleCard } from "../components/molecules/VehicleCard";
import { AuctionSkeletonLoader, AuctionErrorState } from "../components/molecules/AuctionLoaders";
import PageLayout from "../components/templates/PageLayout";
import { usePageAnimations } from "../hooks/usePageAnimations";
import FloatingPill from "../components/atoms/FloatingPill";
import Button from "../components/atoms/Button";
import type { Auction, Route } from "../types";
export interface AuctionsProps {
    onNavigate: (route: Route, auctionId?: string) => void;
}

export const Auctions: React.FC<AuctionsProps> = ({ onNavigate }) => {
    const pageRef = useRef<HTMLDivElement>(null);
    usePageAnimations(pageRef);

    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"todos" | "ativo" | "agendado">("todos");

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await smartCache.fetch(`auctions_${filter}`, async () => {
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
                return data;
            }, undefined, true); // forceRefresh

            setAuctions(data || []);
        } catch (err: unknown) {
            console.error("Erro ao buscar leilões:", err);
            setError(err instanceof Error ? err.message : "Não foi possível carregar a lista de leilões.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;

        const loadAuctions = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await smartCache.fetch(`auctions_${filter}`, async () => {
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
                    return data;
                });

                if (!active) return;
                setAuctions(data || []);
            } catch (err: unknown) {
                if (!active) return;
                console.error("Erro ao buscar leilões:", err);
                setError(err instanceof Error ? err.message : "Não foi possível carregar a lista de leilões.");
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadAuctions();

        return () => {
            active = false;
        };
    }, [filter]);

    return (
        <PageLayout 
            onNavigate={onNavigate} 
            currentRoute="auctions" 
            showFooterLinks={true}
            breadcrumbItems={[
                { label: "Início", route: "home" },
                { label: "Leilões" }
            ]}
        >
            <div ref={pageRef} className="relative flex-1 flex flex-col items-center w-full">
                {/* Decorative floating pills */}
                <FloatingPill className="left-[5%] top-[10%] w-12 h-7 rotate-[-15deg] floating-pill" />
                <FloatingPill className="right-[8%] top-[20%] w-14 h-8 rotate-[30deg] floating-pill" />
                <FloatingPill className="left-[15%] bottom-[10%] w-10 h-6 rotate-[-8deg] blur-[1px] floating-pill" />

                <section className="w-full max-w-7xl px-6 pt-12 pb-16 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden -z-10">
                        <span className="text-[30vw] font-display font-black tracking-tighter leading-none uppercase">
                            AUCTIONS
                        </span>
                    </div>

                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec mb-4 anim-fade-up">
                        PLATAFORMA DE LEILÕES EXCLUSIVOS
                    </span>
                    <h1 className="text-[8vw] sm:text-[6vw] lg:text-[5vw] leading-[0.9] text-black-main font-display font-black mb-8 max-w-5xl tracking-tight anim-title uppercase">
                        Veículos em Leilão
                    </h1>
                </section>

                <section className="w-full max-w-7xl px-6 pb-24">
                    {/* Filtros */}
                    <div className="flex justify-center items-center gap-4 mb-12 anim-fade-up">
                        <button
                            onClick={() => setFilter("todos")}
                            className={`px-6 py-3 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                                filter === "todos"
                                    ? "bg-black-main text-white shadow-lg"
                                    : "bg-card-bg text-gray-sec hover:bg-black-main/5 border border-border-main"
                            }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilter("ativo")}
                            className={`px-6 py-3 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                                filter === "ativo"
                                    ? "bg-black-main text-white shadow-lg"
                                    : "bg-card-bg text-gray-sec hover:bg-black-main/5 border border-border-main"
                            }`}
                        >
                            Ao Vivo
                        </button>
                        <button
                            onClick={() => setFilter("agendado")}
                            className={`px-6 py-3 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                                filter === "agendado"
                                    ? "bg-black-main text-white shadow-lg"
                                    : "bg-card-bg text-gray-sec hover:bg-black-main/5 border border-border-main"
                            }`}
                        >
                            Em Breve
                        </button>
                    </div>

                    {/* Conteúdo: Loading / Erro / Cards */}
                    {loading ? (
                        <div className="anim-fade-up"><AuctionSkeletonLoader /></div>
                    ) : error ? (
                        <div className="anim-fade-up">
                            <AuctionErrorState
                                title="Erro ao Carregar Leilões"
                                message={error}
                                onRetry={fetchAuctions}
                            />
                        </div>
                    ) : auctions.length === 0 ? (
                        <div className="showcase-card anim-stagger flex flex-col items-center text-center py-24 bg-card-bg border border-border-main rounded-2xl">
                            <h3 className="text-2xl font-display font-black text-black-main uppercase mb-2">Nenhum leilão encontrado</h3>
                            <p className="text-sm text-gray-sec mb-8">Nenhum leilão para este filtro no momento.</p>
                            <Button
                                onClick={() => onNavigate("create-auction")}
                                variant="outline"
                            >
                                Cadastrar o Primeiro Leilão
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {auctions.map((auction, idx) => (
                                <div key={auction.id} className="anim-stagger" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <VehicleCard
                                        auction={auction}
                                        onSelect={(id) => {
                                            const slug = `${auction.vehicle?.brand}-${auction.vehicle?.model}-${id}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                            onNavigate("auction-detail", slug);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </PageLayout>
    );
};
