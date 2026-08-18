import React, { useRef, useEffect, useState } from "react";
import type { Route, Auction } from "../types";
import { usePageAnimations } from "../hooks/usePageAnimations";
import PageLayout from "../components/templates/PageLayout";
import FloatingPill from "../components/atoms/FloatingPill";
import Button from "../components/atoms/Button";
import { supabase } from "../lib/supabase";

export interface HomeProps {
    onNavigate: (route: Route) => void;
}

// Utilitário de formatação de preço
const formatPrice = (value: number) =>
    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

// Timer hook reutilizável
function useTimeLeft(starts_at: string, ends_at: string, status: string) {
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
        const calc = () => {
            const now = Date.now();
            const target = status === "agendado"
                ? new Date(starts_at).getTime()
                : new Date(ends_at).getTime();
            const diff = target - now;
            if (diff <= 0) { setTimeLeft(status === "ativo" ? "Encerrado" : "Em breve"); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
        };
        calc();
        const iv = setInterval(calc, 1000);
        return () => clearInterval(iv);
    }, [starts_at, ends_at, status]);
    return timeLeft;
}

// ── Tamanhos de card no grid dinâmico ──────────────────────────────────────
// Cada posição do array define o span do card no grid de 6 colunas
const GRID_SPANS = [
    "col-span-6 sm:col-span-4 row-span-2",   // 0 — grande
    "col-span-6 sm:col-span-2 row-span-1",   // 1 — médio
    "col-span-6 sm:col-span-2 row-span-1",   // 2 — médio
    "col-span-6 sm:col-span-3 row-span-1",   // 3 — largo
    "col-span-6 sm:col-span-3 row-span-1",   // 4 — largo
    "col-span-6 sm:col-span-2 row-span-2",   // 5 — alto
    "col-span-6 sm:col-span-4 row-span-1",   // 6 — wide
    "col-span-6 sm:col-span-2 row-span-1",   // 7 — pequeno
];

// ── Card individual de showcase ────────────────────────────────────────────
interface ShowcaseCardProps {
    auction: Auction;
    index: number;
    onNavigate: (route: Route) => void;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ auction, index, onNavigate }) => {
    const { vehicle, status, starts_at, ends_at, current_price } = auction;
    const timeLeft = useTimeLeft(starts_at, ends_at, status);
    const span = GRID_SPANS[index % GRID_SPANS.length];
    const isLarge = span.includes("row-span-2");
    const imgHeight = isLarge ? "h-56 sm:h-full" : "h-36 sm:h-44";

    const coverImage =
        vehicle?.images?.find((i) => i.is_cover)?.url ||
        vehicle?.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

    const displayPrice = current_price || vehicle?.starting_price || 0;

    return (
        <div
            className={`${span} showcase-card anim-stagger group relative bg-card-bg border border-border-main rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl hover:border-black-main cursor-pointer`}
            onClick={() => onNavigate("auctions")}
        >
            {/* Imagem */}
            <div className={`relative w-full ${imgHeight} overflow-hidden shrink-0`}>
                <img
                    src={coverImage}
                    alt={`${vehicle?.brand} ${vehicle?.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                />
                {/* Badge status */}
                <div className="absolute top-3 left-3">
                    {status === "ativo" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-black animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                            AO VIVO
                        </span>
                    )}
                    {status === "agendado" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/90 text-black">
                            EM BREVE
                        </span>
                    )}
                    {status === "encerrado" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-neutral-700 text-neutral-300">
                            ENCERRADO
                        </span>
                    )}
                </div>
                {/* Timer */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] text-white">
                    <span className="font-medium opacity-70">Tempo:</span>
                    <span className={`font-mono font-bold ${status === "ativo" ? "text-emerald-400" : "text-gray-300"}`}>
                        {timeLeft}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                <div>
                    <div className="flex items-center justify-between text-[9px] font-bold tracking-widest uppercase text-gray-sec mb-0.5">
                        <span>{vehicle?.brand}</span>
                        <span>{vehicle?.year_manufacture}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-black-main font-display uppercase tracking-tight line-clamp-1">
                        {vehicle?.model}
                    </h3>
                    {isLarge && (
                        <p className="text-[11px] text-gray-sec mt-1 line-clamp-2">
                            {vehicle?.description || `${vehicle?.mileage?.toLocaleString("pt-BR") ?? 0} km · ${vehicle?.color ?? ""} · ${vehicle?.condition?.toUpperCase() ?? ""}`}
                        </p>
                    )}
                </div>
                <div className="pt-3 border-t border-border-main flex items-end justify-between">
                    <div>
                        <span className="block text-[9px] font-bold tracking-widest text-gray-sec uppercase mb-0.5">
                            {current_price ? "Lance Atual" : "Inicial"}
                        </span>
                        <p className="text-base font-bold text-black-main leading-none">
                            {formatPrice(displayPrice)}
                        </p>
                    </div>
                    <button
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-black-main text-black-main hover:bg-black-main hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); onNavigate("auctions"); }}
                    >
                        Participar
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Skeleton do card ───────────────────────────────────────────────────────
const CardSkeleton: React.FC<{ span: string }> = ({ span }) => (
    <div className={`${span} bg-card-bg border border-border-main rounded-2xl overflow-hidden animate-pulse`}>
        <div className="h-44 bg-black-main/5" />
        <div className="p-4 flex flex-col gap-2">
            <div className="h-3 w-1/2 bg-black-main/10 rounded" />
            <div className="h-5 w-3/4 bg-black-main/10 rounded" />
            <div className="h-3 w-full bg-black-main/5 rounded mt-auto" />
        </div>
    </div>
);

// ── Página principal ───────────────────────────────────────────────────────
export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    const heroRef = useRef<HTMLDivElement>(null);
    usePageAnimations(heroRef);

    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await supabase
                    .from("auctions")
                    .select(`
                        *,
                        vehicle:vehicles(
                            *,
                            images:vehicle_images(*)
                        )
                    `)
                    .in("status", ["ativo", "agendado"])
                    .order("created_at", { ascending: false })
                    .limit(8);

                setAuctions(data || []);
            } catch (err) {
                console.error("Erro ao buscar leilões em destaque:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const hasAuctions = auctions.length > 0;

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="home" showFooterLinks={true}>
            <div ref={heroRef} className="relative flex-1 flex flex-col items-center">
                {/* Decorative floating pills */}
                <FloatingPill className="left-[8%] top-[15%] w-12 h-7 rotate-[-15deg] floating-pill" />
                <FloatingPill className="left-[22%] top-[8%] w-8 h-5 rotate-[20deg] blur-[1px] floating-pill" />
                <FloatingPill className="right-[10%] top-[12%] w-14 h-8 rotate-[30deg] floating-pill" />
                <FloatingPill className="right-[24%] bottom-[30%] w-10 h-6 rotate-[-8deg] blur-[1px] floating-pill" />

                {/* ================= HERO SECTION ================= */}
                <section className="w-full max-w-7xl px-6 pt-12 pb-24 md:py-32 flex flex-col items-center text-center relative overflow-hidden">
                    {/* Background Wordmark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden -z-10">
                        <span className="text-[25vw] font-display font-black tracking-tighter leading-none">
                            AUCTION
                        </span>
                    </div>

                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec mb-4 anim-fade-up">
                        PLATAFORMA PREMIUM DE VEÍCULOS
                    </span>

                    <h1 className="text-[10vw] sm:text-[8vw] lg:text-[7vw] leading-[0.9] text-black-main font-display font-black mb-8 max-w-5xl tracking-tight anim-title uppercase">
                        PERFORMANCE &amp; LUXO. <br className="hidden sm:inline" />
                        REDEFININDO O EXCLUSIVO.
                    </h1>

                    <p className="text-sm sm:text-base text-gray-sec max-w-xl mb-10 leading-relaxed anim-fade-up">
                        Leilões de veículos de alta performance e clássicos raros. Compre com exclusividade, venda com eficiência.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 anim-fade-up">
                        <Button
                            onClick={() => onNavigate("auctions")}
                            variant="primary"
                            className="px-8 py-4 uppercase tracking-wider text-xs font-bold"
                        >
                            Ver Leilões
                        </Button>
                        <Button
                            onClick={() => onNavigate("create-auction")}
                            variant="secondary"
                            className="px-8 py-4 uppercase tracking-wider text-xs font-bold"
                        >
                            Criar Leilão
                        </Button>
                    </div>
                </section>

                {/* ================= FEATURED SHOWCASE GRID ================= */}
                <section className="w-full max-w-7xl px-6 py-16 border-t border-border-main">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec block mb-1">
                                DESTAQUES AO VIVO
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-display font-black text-black-main uppercase tracking-tight">
                                Leilões em Destaque
                            </h2>
                        </div>
                        <button
                            onClick={() => onNavigate("auctions")}
                            className="text-[11px] font-bold tracking-widest uppercase text-gray-sec hover:text-black-main transition-colors underline underline-offset-4 decoration-border-main"
                        >
                            Ver Todos →
                        </button>
                    </div>

                    {loading ? (
                        /* Skeleton grid */
                        <div className="grid grid-cols-6 gap-4 auto-rows-[180px]">
                            {GRID_SPANS.slice(0, 6).map((span, i) => (
                                <CardSkeleton key={i} span={span} />
                            ))}
                        </div>
                    ) : hasAuctions ? (
                        /* Dynamic masonry-like grid */
                        <div className="grid grid-cols-6 gap-4 auto-rows-[180px]">
                            {auctions.map((auction, idx) => (
                                <ShowcaseCard
                                    key={auction.id}
                                    auction={auction}
                                    index={idx}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="flex flex-col items-center text-center py-24 bg-card-bg border border-border-main rounded-2xl">
                            <span className="text-5xl mb-4">🏎️</span>
                            <h3 className="text-xl font-display font-black text-black-main uppercase mb-2">
                                Nenhum leilão ativo
                            </h3>
                            <p className="text-sm text-gray-sec mb-8 max-w-xs">
                                Seja o primeiro a cadastrar um veículo exclusivo na plataforma.
                            </p>
                            <Button onClick={() => onNavigate("create-auction")} variant="outline">
                                Cadastrar Leilão
                            </Button>
                        </div>
                    )}
                </section>

                {/* ================= PHILOSOPHY / TECH SPECS ================= */}
                <section className="w-full max-w-7xl px-6 py-20 border-t border-border-main">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {/* Block 1 */}
                        <div className="tech-item anim-stagger flex flex-col gap-4">
                            <span className="text-3xl font-display font-black text-black-main/20">01</span>
                            <h4 className="text-lg font-bold text-black-main font-display uppercase tracking-wider">
                                Curadoria Exclusiva
                            </h4>
                            <p className="text-sm text-gray-sec leading-relaxed">
                                Apenas veículos criteriosamente selecionados. Garantimos a procedência e a qualidade de cada lote oferecido em nossa plataforma.
                            </p>
                        </div>

                        {/* Block 2 */}
                        <div className="tech-item anim-stagger flex flex-col gap-4">
                            <span className="text-3xl font-display font-black text-black-main/20">02</span>
                            <h4 className="text-lg font-bold text-black-main font-display uppercase tracking-wider">
                                Lances em Tempo Real
                            </h4>
                            <p className="text-sm text-gray-sec leading-relaxed">
                                Nossa tecnologia permite que você dê lances ao vivo, de qualquer lugar, com total segurança e transparência instantânea.
                            </p>
                        </div>

                        {/* Block 3 */}
                        <div className="tech-item anim-stagger flex flex-col gap-4">
                            <span className="text-3xl font-display font-black text-black-main/20">03</span>
                            <h4 className="text-lg font-bold text-black-main font-display uppercase tracking-wider">
                                Segurança Absoluta
                            </h4>
                            <p className="text-sm text-gray-sec leading-relaxed">
                                Transações financeiras protegidas e sigilo nas informações dos arrematantes. Compre e venda com a mais alta confiabilidade.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ================= BOTTOM CALL TO ACTION ================= */}
                <section className="w-full border-t border-border-main bg-card-bg">
                    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-black-main font-display tracking-tight uppercase">
                                Pronto para seu próximo veículo?
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-sec mt-1">
                                Cadastre-se na plataforma para dar lances e acompanhar leilões exclusivos.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 shrink-0">
                            <Button
                                onClick={() => onNavigate("register")}
                                variant="outline"
                                className="px-6 py-3"
                            >
                                Criar Conta
                            </Button>
                            <Button
                                onClick={() => onNavigate("auctions")}
                                variant="primary"
                                className="px-6 py-3"
                            >
                                Ver Lotes Atuais
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
};

export default Home;
