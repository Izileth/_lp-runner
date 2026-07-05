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
                        Who We Are
                    </p>
                    <h1
                        ref={titleRef}
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-black-main tracking-tighter mb-8 font-display"
                    >
                        RUNNER STUDIO
                    </h1>
                </div>

                <div className="about-content grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12">
                    <div className="md:col-span-2">
                        <p className="text-lg sm:text-xl font-medium text-black-main leading-relaxed">
                            We design high-performance gear for athletes, surf riders, and design enthusiasts. By blending avant-garde form with next-gen technical materials, we push the limits of performance and style.
                        </p>
                        <p className="text-gray-sec mt-6 leading-relaxed">
                            Our design methodology is inspired by dynamic forces—airflow, water turbulence, and structural kinetics. From the organic silhouettes of our footwear to the hydrodynamic foils of our carbon fiber surf fins, every curve is calculated to minimize drag and maximize expression.
                        </p>
                    </div>
                    <div className="bg-card-bg p-8 rounded-xl border border-border-main flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-2">Founded</h3>
                            <p className="text-xl font-bold text-black-main">2026</p>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-sec mt-6 mb-2">Location</h3>
                            <p className="text-xl font-bold text-black-main">Florianópolis, BR</p>
                        </div>
                        <div className="mt-8 border-t border-border-main pt-6">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-black-main">
                                Powered by Science &amp; Art
                            </span>
                        </div>
                    </div>
                </div>

                {/* ---------- VALUES SECTION ---------- */}
                <section className="mt-24">
                    <h2 className="text-2xl font-extrabold text-black-main tracking-tight mb-10 font-display">
                        Core Principles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="grid-item bg-card-bg p-8 rounded-xl border border-border-main">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-3">01 / Motion</p>
                            <h3 className="text-lg font-bold text-black-main">Kinetic Geometry</h3>
                            <p className="text-xs sm:text-sm text-gray-sec mt-2 leading-relaxed">
                                Designing products that mimic the natural flow of biological motion, providing effortless energy return.
                            </p>
                        </div>
                        <div className="grid-item bg-card-bg p-8 rounded-xl border border-border-main">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-3">02 / Flow</p>
                            <h3 className="text-lg font-bold text-black-main">Hydrodynamics</h3>
                            <p className="text-xs sm:text-sm text-gray-sec mt-2 leading-relaxed">
                                Utilizing aerospace fluid simulation models to create the fastest surf fins and sporting equipment.
                            </p>
                        </div>
                        <div className="grid-item bg-card-bg p-8 rounded-xl border border-border-main">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-sec mb-3">03 / Earth</p>
                            <h3 className="text-lg font-bold text-black-main">Responsible Tech</h3>
                            <p className="text-xs sm:text-sm text-gray-sec mt-2 leading-relaxed">
                                Using biodegradable foams, algae-blended polymers, and recycled aerospace-grade carbon fiber.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
};

export default About;
