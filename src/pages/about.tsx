import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AboutProps {
    onNavigate: (route: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" }
            );

            gsap.fromTo(
                ".about-content",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
            );

            gsap.fromTo(
                ".grid-item",
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    delay: 0.5,
                    ease: "power3.out"
                }
            );

            // Floating pills
            gsap.to(".floating-pill", {
                y: "random(-10, 10)",
                x: "random(-8, 8)",
                rotation: "random(-5, 5)",
                duration: "random(4, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-ivory text-black-main overflow-x-hidden font-sans">
            {/* ---------- NAVBAR ---------- */}
            <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-14 py-6 sm:py-8">
                <button
                    onClick={() => onNavigate("home")}
                    className="flex items-center gap-[1px] text-lg sm:text-xl font-extrabold tracking-tight text-black-main select-none cursor-pointer"
                    aria-label="Runner home"
                >
                    <span className="inline-block scale-x-[-1]">R</span>
                    <span>unner</span>
                </button>

                <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase text-black-main">
                    <button onClick={() => onNavigate("product")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Shop
                    </button>
                    <span className="text-border-main">/</span>
                    <button onClick={() => onNavigate("fins")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Fins
                    </button>
                    <button onClick={() => onNavigate("about")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        About
                    </button>
                    <a href="#" className="hover:opacity-60 transition-opacity">
                        Contact
                    </a>
                </nav>

                <div className="flex items-center gap-3 sm:gap-4">
                    <span className="hidden sm:inline text-[11px] font-semibold tracking-widest uppercase text-black-main">
                        Account
                    </span>
                    <button 
                        onClick={() => onNavigate("product")}
                        className="flex items-center gap-2 border border-border-main rounded-full pl-4 pr-1.5 py-1.5 cursor-pointer bg-card-bg hover:bg-black-main hover:text-white transition-all duration-300"
                    >
                        <span className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">
                            Bag &middot; $0
                        </span>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black-main text-white text-[10px] font-bold">
                            0
                        </span>
                    </button>
                </div>
            </header>

            {/* ---------- HERO SECTION ---------- */}
            <main className="relative max-w-5xl mx-auto px-6 pt-10 pb-20">
                {/* Decorative floating elements */}
                <span className="floating-pill pointer-events-none absolute left-[5%] top-[15%] w-10 h-6 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[-10deg] blur-[0.5px]" />
                <span className="floating-pill pointer-events-none absolute right-[5%] top-[20%] w-12 h-7 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[20deg] blur-[1px]" />

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

            {/* ---------- FOOTER ---------- */}
            <footer className="border-t border-border-main px-6 sm:px-10 lg:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-sec text-[11px] font-medium uppercase tracking-wider">
                <div className="flex items-center gap-6">
                    <button onClick={() => onNavigate("home")} className="hover:text-black-main transition-colors cursor-pointer">Home</button>
                    <button onClick={() => onNavigate("fins")} className="hover:text-black-main transition-colors cursor-pointer">Catalog</button>
                    <a href="#" className="hover:text-black-main transition-colors">Privacy</a>
                </div>
                <div>
                    &copy; 2026 Runner Space. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
