import React, { useRef } from "react";
import type { Route } from "../types";
import { usePageAnimations } from "../hooks/usePageAnimations";
import PageLayout from "../components/templates/PageLayout";
import FloatingPill from "../components/atoms/FloatingPill";
import Button from "../components/atoms/Button";

interface HomeProps {
    onNavigate: (route: Route) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    const heroRef = useRef<HTMLDivElement>(null);

    // Apply floating animations and transitions to all items using standard semantic selectors
    usePageAnimations(heroRef);

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

                    <h1
                        className="text-[10vw] sm:text-[8vw] lg:text-[7vw] leading-[0.9] text-black-main font-display font-black mb-8 max-w-5xl tracking-tight anim-title uppercase"
                    >
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Vehicle Showcase 1 */}
                        <div className="showcase-card anim-stagger group relative bg-card-bg border border-border-main rounded-2xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[500px] transition-all duration-500 hover:shadow-xl hover:border-black-main">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-black-main/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-all duration-700"></div>
                            
                            <div>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-sec">
                                    01 / ALTA PERFORMANCE
                                </span>
                                <h3 className="text-3xl font-extrabold text-black-main mt-2 font-display uppercase tracking-tight">
                                    PORSCHE 911 GT3
                                </h3>
                                <p className="text-xs text-gray-sec mt-1 max-w-xs leading-relaxed">
                                    Engenharia alemã levada ao limite. Precisão, velocidade e um legado nas pistas.
                                </p>
                            </div>

                            {/* Center Product Image Showcase */}
                            <div className="my-8 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105 h-48">
                                <img
                                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                                    alt="Porsche"
                                    className="w-full h-full object-cover rounded-xl shadow-lg drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-4 relative z-10">
                                <div>
                                    <p className="text-[9px] font-bold tracking-widest text-gray-sec uppercase">LANCE INICIAL</p>
                                    <p className="text-xl font-bold text-black-main">R$ 1.500.000</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => onNavigate("auctions")}
                                    className="px-6 py-3"
                                >
                                    Participar
                                </Button>
                            </div>
                        </div>

                        {/* Vehicle Showcase 2 */}
                        <div className="showcase-card anim-stagger group relative bg-card-bg border border-border-main rounded-2xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[500px] transition-all duration-500 hover:shadow-xl hover:border-black-main">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-black-main/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-all duration-700"></div>

                            <div>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-sec">
                                    02 / CLÁSSICOS RAROS
                                </span>
                                <h3 className="text-3xl font-extrabold text-black-main mt-2 font-display uppercase tracking-tight">
                                    FERRARI TESTAROSSA
                                </h3>
                                <p className="text-xs text-gray-sec mt-1 max-w-xs leading-relaxed">
                                    O ícone dos anos 80. Motor flat-12, design inconfundível e valorização histórica garantida.
                                </p>
                            </div>

                            {/* Beautiful Graphic */}
                            <div className="my-8 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105 h-48">
                                <img
                                    src="https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80"
                                    alt="Classic Car"
                                    className="w-full h-full object-cover rounded-xl shadow-lg drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-4 relative z-10">
                                <div>
                                    <p className="text-[9px] font-bold tracking-widest text-gray-sec uppercase">LANCE INICIAL</p>
                                    <p className="text-xl font-bold text-black-main">R$ 2.100.000</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => onNavigate("auctions")}
                                    className="px-6 py-3"
                                >
                                    Participar
                                </Button>
                            </div>
                        </div>
                    </div>
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
