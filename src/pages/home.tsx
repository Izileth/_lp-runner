import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HomeProps {
    onNavigate: (route: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Page entrance animation with GSAP
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
            );

            gsap.fromTo(
                ".hero-subtitle",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" }
            );

            gsap.fromTo(
                ".card-item",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    delay: 0.6,
                    ease: "power3.out",
                }
            );

            // Floating animations for decorative pills
            gsap.to(".floating-pill", {
                y: "random(-15, 15)",
                x: "random(-10, 10)",
                rotation: "random(-10, 10)",
                duration: "random(4, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.2
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={heroRef} className="relative w-full min-h-screen bg-[#F1EEE6] text-neutral-900 overflow-x-hidden font-sans">
            {/* ---------- NAVBAR ---------- */}
            <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-14 py-6 sm:py-8">
                <button
                    onClick={() => onNavigate("home")}
                    className="flex items-center gap-[1px] text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 select-none cursor-pointer"
                    aria-label="Runner home"
                >
                    <span className="inline-block scale-x-[-1]">R</span>
                    <span>unner</span>
                </button>

                <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase text-neutral-900">
                    <button onClick={() => onNavigate("product")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Shop
                    </button>
                    <span className="text-neutral-400">/</span>
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
                    <span className="hidden sm:inline text-[11px] font-semibold tracking-widest uppercase text-neutral-900">
                        Account
                    </span>
                    <button 
                        onClick={() => onNavigate("product")}
                        className="flex items-center gap-2 border border-neutral-900/80 rounded-full pl-4 pr-1.5 py-1.5 cursor-pointer hover:bg-neutral-950 hover:text-white transition-all duration-300"
                    >
                        <span className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">
                            Bag &middot; $0
                        </span>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold">
                            0
                        </span>
                    </button>
                </div>
            </header>

            {/* ---------- HERO SECTION ---------- */}
            <main className="relative flex flex-col items-center justify-center px-6 pt-10 pb-20">
                {/* Decorative floating elements */}
                <span className="floating-pill pointer-events-none absolute left-[12%] top-[25%] w-12 h-7 rounded-full bg-neutral-300/60 rotate-[-15deg]" />
                <span className="floating-pill pointer-events-none absolute left-[24%] top-[12%] w-8 h-5 rounded-full bg-neutral-400/40 rotate-[20deg]" />
                <span className="floating-pill pointer-events-none absolute right-[14%] top-[18%] w-14 h-8 rounded-full bg-neutral-300/70 rotate-[30deg]" />
                <span className="floating-pill pointer-events-none absolute right-[28%] bottom-[30%] w-10 h-6 rounded-full bg-neutral-400/50 rotate-[-8deg]" />

                {/* Hero Typo */}
                <div className="relative text-center select-none w-full max-w-5xl overflow-hidden py-4">
                    <h1
                        ref={titleRef}
                        className="text-[14vw] sm:text-[12vw] lg:text-[9vw] leading-[0.85] text-neutral-900 font-extrabold tracking-tighter"
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            letterSpacing: "-0.04em",
                        }}
                    >
                        NEXT-GEN
                        <br />
                        <span className="text-neutral-400 font-light">PROPULSION</span>
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="hero-subtitle text-center mt-6 text-sm sm:text-base md:text-lg max-w-xl text-neutral-500 font-normal leading-relaxed">
                    Designed for speed, built with carbon, shaped by nature. Explore our collection of ultra-performance footwear and hydrodynamic fins.
                </p>

                {/* CTA Buttons */}
                <div className="hero-subtitle flex flex-wrap justify-center gap-4 mt-8">
                    <button
                        onClick={() => onNavigate("product")}
                        className="rounded-md bg-neutral-900 text-white text-xs sm:text-sm font-bold tracking-widest uppercase px-8 py-3.5 hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        Explore Sneakers
                    </button>
                    <button
                        onClick={() => onNavigate("fins")}
                        className="rounded-md border border-neutral-900 text-neutral-900 text-xs sm:text-sm font-bold tracking-widest uppercase px-8 py-3.5 hover:bg-neutral-900 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        View Fins Collection
                    </button>
                </div>

                {/* ---------- CATEGORIES / FEATURED PRODUCTS ---------- */}
                <div ref={cardsRef} className="w-full max-w-6xl mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                    {/* Yeezy Card */}
                    <div 
                        onClick={() => onNavigate("product")}
                        className="card-item group relative bg-[#ebe7dc] rounded-2xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between aspect-[4/3] cursor-pointer hover:shadow-2xl hover:shadow-neutral-900/10 transition-all duration-500 border border-neutral-900/5 hover:-translate-y-2"
                    >
                        <div className="absolute right-0 top-0 w-3/4 h-full pointer-events-none opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 flex items-center justify-center">
                            <span className="text-[12vw] font-black text-neutral-900 tracking-tighter select-none font-display">YZY</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">
                                Footwear
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
                                Yeezy Series
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xs leading-relaxed">
                                The iconic Foam RNNR Ararat. Avant-garde comfort engineered in collaboration with Adidas.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 group-hover:mr-2 transition-all">
                                Shop Sneakers
                            </span>
                            <span className="text-lg">&rarr;</span>
                        </div>
                    </div>

                    {/* Fins Card */}
                    <div 
                        onClick={() => onNavigate("fins")}
                        className="card-item group relative bg-[#ebe7dc] rounded-2xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between aspect-[4/3] cursor-pointer hover:shadow-2xl hover:shadow-neutral-900/10 transition-all duration-500 border border-neutral-900/5 hover:-translate-y-2"
                    >
                        <div className="absolute right-0 top-0 w-3/4 h-full pointer-events-none opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 flex items-center justify-center">
                            <span className="text-[12vw] font-black text-neutral-900 tracking-tighter select-none font-display">FINS</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">
                                Hydrodynamics
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
                                Carbon Fins
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xs leading-relaxed">
                                Ultra-lightweight carbon fiber surfboard fins designed for precision carve and speed.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 group-hover:mr-2 transition-all">
                                View Collection
                            </span>
                            <span className="text-lg">&rarr;</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ---------- FOOTER ---------- */}
            <footer className="border-t border-neutral-900/10 px-6 sm:px-10 lg:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-neutral-500 text-[11px] font-medium uppercase tracking-wider">
                <div className="flex items-center gap-6">
                    <button onClick={() => onNavigate("about")} className="hover:text-neutral-900 transition-colors cursor-pointer">About Us</button>
                    <button onClick={() => onNavigate("fins")} className="hover:text-neutral-900 transition-colors cursor-pointer">Catalog</button>
                    <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
                </div>
                <div>
                    &copy; 2026 Runner Space. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
