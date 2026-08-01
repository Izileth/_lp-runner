import React, { useRef, useMemo } from "react";
import type { Route } from "../types";
import { useFloatingPills } from "../hooks/useFloatingPills";
import { usePageEntrance } from "../hooks/usePageEntrance";
import PageLayout from "../components/templates/PageLayout";
import FloatingPill from "../components/atoms/FloatingPill";

interface AboutProps {
    onNavigate: (route: Route) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // Apply floating animations to pills
    useFloatingPills(containerRef);

    // Entrance GSAP animation config
    const entranceAnimations = useMemo(
        () => [
            {
                target: titleRef,
                from: { y: 40, opacity: 0 },
                to: { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
            },
            {
                target: ".about-content",
                from: { opacity: 0, y: 30 },
                to: { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" },
            },
            {
                target: ".grid-item",
                from: { opacity: 0, y: 40 },
                to: {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    delay: 0.5,
                    ease: "power3.out",
                },
            },
        ],
        []
    );

    usePageEntrance(containerRef, entranceAnimations);

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="about" showFooterLinks={true}>
            <main ref={containerRef} className="relative max-w-5xl mx-auto px-6 pt-10 pb-20">
                {/* Decorative floating elements */}
                <FloatingPill className="left-[5%] top-[15%] w-10 h-6 rotate-[-10deg]" />
                <FloatingPill className="right-[5%] top-[20%] w-12 h-7 rotate-[20deg] blur-[1px]" />

                <div className="text-center md:text-left">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-gray-sec mb-2">
                        Sobre Nós
                    </p>
                    <h1
                        ref={titleRef}
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-black-main tracking-tighter mb-8 font-display uppercase"
                    >
                        AUCTION PLATFORM
                    </h1>
                </div>

                <div className="about-content grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12">
                    <div className="md:col-span-2">
                        <p className="text-lg sm:text-xl font-medium text-black-main leading-relaxed">
                            Nascemos da paixão por veículos raros, clássicos impecáveis e superesportivos de alta performance. Conectamos colecionadores e entusiastas em uma plataforma segura, transparente e exclusiva.
                        </p>
                        <p className="text-gray-sec mt-6 leading-relaxed">
                            Nossa plataforma redefine a experiência de compra e venda de veículos de alto padrão. Através de tecnologia de ponta, oferecemos lances em tempo real, curadoria rigorosa de cada lote e um processo de arremate sem fricções. Aqui, o extraordinário encontra o seu próximo dono.
                        </p>
                    </div>
                    <div className="bg-card-bg p-8 rounded-xl border border-border-main flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-2">Fundação</h3>
                            <p className="text-xl font-bold text-black-main">2026</p>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-sec mt-6 mb-2">Sede</h3>
                            <p className="text-xl font-bold text-black-main">São Paulo, BR</p>
                        </div>
                        <div className="mt-8 border-t border-border-main pt-6">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-black-main">
                                Movidos pela Exclusividade
                            </span>
                        </div>
                    </div>
                </div>

                {/* ---------- VALUES SECTION ---------- */}
                <section className="mt-24">
                    <h2 className="text-2xl font-extrabold text-black-main tracking-tight mb-10 font-display">
                        Nossos Pilares
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="grid-item bg-card-bg p-8 rounded-xl border border-border-main">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-3">01 / Curadoria</p>
                            <h3 className="text-lg font-bold text-black-main">Seleção Rigorosa</h3>
                            <p className="text-xs sm:text-sm text-gray-sec mt-2 leading-relaxed">
                                Avaliamos a procedência, estado de conservação e originalidade de todos os veículos antes de aceitá-los em nossa plataforma.
                            </p>
                        </div>
                        <div className="grid-item bg-card-bg p-8 rounded-xl border border-border-main">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-3">02 / Transparência</p>
                            <h3 className="text-lg font-bold text-black-main">Lances Seguros</h3>
                            <p className="text-xs sm:text-sm text-gray-sec mt-2 leading-relaxed">
                                Todo o histórico de lances é transparente e atualizado em tempo real, garantindo um ambiente de negociação justo.
                            </p>
                        </div>
                        <div className="grid-item bg-card-bg p-8 rounded-xl border border-border-main">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-3">03 / Exclusividade</p>
                            <h3 className="text-lg font-bold text-black-main">Acesso Restrito</h3>
                            <p className="text-xs sm:text-sm text-gray-sec mt-2 leading-relaxed">
                                Focamos em um nicho de alto padrão, garantindo que cada leilão seja um evento único e prestigiado.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
};

export default About;
