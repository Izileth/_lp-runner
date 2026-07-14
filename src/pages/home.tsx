import React, { useRef, useMemo } from "react";
import type { Route } from "../types";
import { useFloatingPills } from "../hooks/useFloatingPills";
import { usePageEntrance } from "../hooks/usePageEntrance";
import PageLayout from "../components/templates/PageLayout";
import FloatingPill from "../components/atoms/FloatingPill";
import Button from "../components/atoms/Button";
import heroImage from "../assets/hero.png";

interface HomeProps {
    onNavigate: (route: Route) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // Apply floating animations to pills
    useFloatingPills(heroRef);

    // Entrance GSAP animation config
    const entranceAnimations = useMemo(
        () => [
            {
                target: titleRef,
                from: { y: 60, opacity: 0 },
                to: { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
            },
            {
                target: ".hero-subtitle",
                from: { y: 20, opacity: 0 },
                to: { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" },
            },
            {
                target: ".hero-cta",
                from: { y: 20, opacity: 0 },
                to: { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power3.out" },
            },
            {
                target: ".showcase-card",
                from: { y: 40, opacity: 0 },
                to: {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    delay: 0.5,
                    ease: "power3.out",
                },
            },
            {
                target: ".tech-item",
                from: { opacity: 0, y: 30 },
                to: {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    delay: 0.7,
                    ease: "power3.out",
                },
            },
        ],
        []
    );

    usePageEntrance(heroRef, entranceAnimations);

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="home" showFooterLinks={true}>
            <div ref={heroRef} className="relative flex-1 flex flex-col items-center">
                {/* Decorative floating pills */}
                <FloatingPill className="left-[8%] top-[15%] w-12 h-7 rotate-[-15deg]" />
                <FloatingPill className="left-[22%] top-[8%] w-8 h-5 rotate-[20deg] blur-[1px]" />
                <FloatingPill className="right-[10%] top-[12%] w-14 h-8 rotate-[30deg]" />
                <FloatingPill className="right-[24%] bottom-[30%] w-10 h-6 rotate-[-8deg] blur-[1px]" />

                {/* ================= HERO SECTION ================= */}
                <section className="w-full max-w-7xl px-6 pt-12 pb-24 md:py-32 flex flex-col items-center text-center relative overflow-hidden">
                    {/* Background Wordmark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden -z-10">
                        <span className="text-[35vw] font-display font-black tracking-tighter leading-none">
                            RUNNER
                        </span>
                    </div>

                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec mb-4 hero-subtitle">
                        ADVANCED PERFORMANCE STUDIO
                    </span>

                    <h1
                        ref={titleRef}
                        className="text-[10vw] sm:text-[8vw] lg:text-[7vw] leading-[0.9] text-black-main font-display font-black mb-8 max-w-5xl tracking-tight"
                    >
                        SPEED &amp; FLUIDITY. <br className="hidden sm:inline" />
                        REDEFINING MOVEMENT.
                    </h1>

                    <p className="text-sm sm:text-base text-gray-sec max-w-xl mb-10 leading-relaxed hero-subtitle">
                        Designing high-performance footwear and premium carbon fiber surfboard fins. Engineered for speed, built for control, and inspired by fluid dynamics.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 hero-cta">
                        <Button
                            onClick={() => onNavigate("product")}
                            variant="primary"
                            className="px-8 py-4"
                        >
                            Shop Sneakers
                        </Button>
                        <Button
                            onClick={() => onNavigate("fins")}
                            variant="secondary"
                            className="px-8 py-4"
                        >
                            Explore Fins
                        </Button>
                    </div>
                </section>

                {/* ================= FEATURED SHOWCASE GRID ================= */}
                <section className="w-full max-w-7xl px-6 py-16 border-t border-border-main">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sneaker Showcase */}
                        <div className="showcase-card group relative bg-card-bg border border-border-main rounded-2xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[500px] transition-all duration-500 hover:shadow-xl hover:border-black-main">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-black-main/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-all duration-700"></div>
                            
                            <div>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-sec">
                                    01 / FOOTWEAR COLLAB
                                </span>
                                <h3 className="text-3xl font-extrabold text-black-main mt-2 font-display">
                                    FOAM RNNR
                                </h3>
                                <p className="text-xs text-gray-sec mt-1 max-w-xs leading-relaxed">
                                    Injection-molded EVA foam blended with harvested algae. Ultra-lightweight, ergonomic, and futuristic.
                                </p>
                            </div>

                            {/* Center Product Image Showcase */}
                            <div className="my-8 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105">
                                <img
                                    src={heroImage}
                                    alt="Foam RNNR Ararat"
                                    className="w-[75%] sm:w-[60%] aspect-[4/3] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)]"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-4 relative z-10">
                                <div>
                                    <p className="text-[9px] font-bold tracking-widest text-gray-sec uppercase">PRICE</p>
                                    <p className="text-xl font-bold text-black-main">$1595 USD</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => onNavigate("product")}
                                    className="px-6 py-3"
                                >
                                    View Sneaker
                                </Button>
                            </div>
                        </div>

                        {/* Fins Showcase */}
                        <div className="showcase-card group relative bg-card-bg border border-border-main rounded-2xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[500px] transition-all duration-500 hover:shadow-xl hover:border-black-main">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-black-main/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-all duration-700"></div>

                            <div>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-sec">
                                    02 / HYDRODYNAMICS
                                </span>
                                <h3 className="text-3xl font-extrabold text-black-main mt-2 font-display">
                                    APEX THRUSTERS
                                </h3>
                                <p className="text-xs text-gray-sec mt-1 max-w-xs leading-relaxed">
                                    Constructed from aerospace-grade pre-preg carbon fiber. Engineered for explosive speed and smooth water release.
                                </p>
                            </div>

                            {/* Beautiful Graphic representing surfboard fins */}
                            <div className="my-8 flex items-center justify-center relative z-10 h-44">
                                <div className="relative w-40 h-40 flex items-center justify-center">
                                    {/* Abstract Fin Shapes using CSS */}
                                    <div className="absolute bottom-4 left-6 w-16 h-28 bg-black-main rounded-tr-[100px] rounded-bl-[10px] opacity-15 rotate-[-15deg] transition-all duration-500 group-hover:translate-x-[-8px]"></div>
                                    <div className="absolute bottom-4 right-6 w-16 h-28 bg-black-main rounded-tr-[100px] rounded-bl-[10px] opacity-25 rotate-[15deg] transition-all duration-500 group-hover:translate-x-[8px]"></div>
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-32 bg-black-main rounded-tr-[120px] rounded-bl-[15px] shadow-lg transition-transform duration-500 group-hover:scale-[1.05]">
                                        <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/20 rounded-tr-[90px] rounded-bl-[10px] flex items-end justify-center pb-4">
                                            <span className="text-[8px] tracking-[0.2em] font-bold text-white/55 uppercase font-display">CARBON</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 relative z-10">
                                <div>
                                    <p className="text-[9px] font-bold tracking-widest text-gray-sec uppercase">PRICE</p>
                                    <p className="text-xl font-bold text-black-main">From $145 USD</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => onNavigate("fins")}
                                    className="px-6 py-3"
                                >
                                    View Fins
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= PHILOSOPHY / TECH SPECS ================= */}
                <section className="w-full max-w-7xl px-6 py-20 border-t border-border-main">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {/* Block 1 */}
                        <div className="tech-item flex flex-col gap-4">
                            <span className="text-3xl font-display font-black text-black-main/20">01</span>
                            <h4 className="text-lg font-bold text-black-main font-display uppercase tracking-wider">
                                Fluid Dynamics
                            </h4>
                            <p className="text-sm text-gray-sec leading-relaxed">
                                Our profiles are tested under variable flow velocity. Hydrofoil and aerodynamic patterns ensure minimal drag and maximum energy conversion.
                            </p>
                        </div>

                        {/* Block 2 */}
                        <div className="tech-item flex flex-col gap-4">
                            <span className="text-3xl font-display font-black text-black-main/20">02</span>
                            <h4 className="text-lg font-bold text-black-main font-display uppercase tracking-wider">
                                Precision Tooling
                            </h4>
                            <p className="text-sm text-gray-sec leading-relaxed">
                                Every curve is mathematically optimized. From complex organic molds of injection sneakers to custom carbon layups of performance fins.
                            </p>
                        </div>

                        {/* Block 3 */}
                        <div className="tech-item flex flex-col gap-4">
                            <span className="text-3xl font-display font-black text-black-main/20">03</span>
                            <h4 className="text-lg font-bold text-black-main font-display uppercase tracking-wider">
                                High Resiliency
                            </h4>
                            <p className="text-sm text-gray-sec leading-relaxed">
                                Built to withstand extreme environmental stress. Our composite structures offer elastic rebound under pressure, storing and releasing power.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ================= BOTTOM CALL TO ACTION ================= */}
                <section className="w-full border-t border-border-main bg-card-bg">
                    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-black-main font-display tracking-tight uppercase">
                                Ready to level up your velocity?
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-sec mt-1">
                                Discover the ultimate connection between ground traction and wave propulsion.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 shrink-0">
                            <Button
                                onClick={() => onNavigate("about")}
                                variant="outline"
                                className="px-6 py-3"
                            >
                                Read Story
                            </Button>
                            <Button
                                onClick={() => onNavigate("contact")}
                                variant="primary"
                                className="px-6 py-3"
                            >
                                Get in Touch
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
};

export default Home;

