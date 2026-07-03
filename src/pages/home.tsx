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

            // Subtle floating animations for decorative elements (flat ivory shapes)
            gsap.to(".floating-pill", {
                y: "random(-10, 10)",
                x: "random(-8, 8)",
                rotation: "random(-8, 8)",
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
        <div ref={heroRef} className="relative w-full min-h-screen bg-ivory text-black-main overflow-x-hidden font-sans">
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
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black-main text-white text-[10px] font-bold group-hover:bg-white group-hover:text-black">
                            0
                        </span>
                    </button>
                </div>
            </header>

            {/* ---------- HERO SECTION ---------- */}
            <main className="relative flex flex-col items-center justify-center px-6 pt-10 pb-20">
                {/* Decorative floating elements */}
                <span className="floating-pill pointer-events-none absolute left-[12%] top-[25%] w-12 h-7 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[-15deg] blur-[0.5px]" />
                <span className="floating-pill pointer-events-none absolute left-[24%] top-[12%] w-8 h-5 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[20deg] blur-[1px]" />
                <span className="floating-pill pointer-events-none absolute right-[14%] top-[18%] w-14 h-8 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[30deg] blur-[0.5px]" />
                <span className="floating-pill pointer-events-none absolute right-[28%] bottom-[30%] w-10 h-6 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[-8deg] blur-[1px]" />

                {/* Hero Typo */}
                <div className="relative text-center select-none w-full max-w-5xl overflow-hidden py-4">
                    <h1
                        ref={titleRef}
                        className="text-[14vw] sm:text-[12vw] lg:text-[9vw] leading-[0.85] text-black-main font-extrabold tracking-tighter"
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            letterSpacing: "-0.04em",
                        }}
                    >
                        NEXT-GEN
                        <br />
                        <span className="text-gray-sec font-light">PROPULSION</span>
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="hero-subtitle text-center mt-6 text-sm sm:text-base md:text-lg max-w-xl text-gray-sec font-normal leading-relaxed">
                    Designed for speed, built with carbon, shaped by nature. Explore our collection of ultra-performance footwear and hydrodynamic fins.
                </p>

                {/* CTA Buttons */}
                <div className="hero-subtitle flex flex-wrap justify-center gap-4 mt-8">
                    <button
                        onClick={() => onNavigate("product")}
                        className="rounded-md bg-black-main text-white text-xs sm:text-sm font-bold tracking-widest uppercase px-8 py-3.5 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                    >
                        Explore Sneakers
                    </button>
                    <button
                        onClick={() => onNavigate("fins")}
                        className="rounded-md border border-border-main bg-card-bg text-black-main text-xs sm:text-sm font-bold tracking-widest uppercase px-8 py-3.5 hover:bg-black-main hover:text-white hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                    >
                        View Fins Collection
                    </button>
                </div>

                {/* ---------- CATEGORIES / FEATURED PRODUCTS ---------- */}
                <div ref={cardsRef} className="w-full max-w-6xl mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                    {/* Yeezy Card */}
                    <div 
                        onClick={() => onNavigate("product")}
                        className="card-item group relative bg-card-bg rounded-xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between aspect-[4/3] cursor-pointer hover:shadow-xl hover:shadow-black-main/5 transition-all duration-500 border border-border-main"
                    >
                        <div className="absolute right-0 top-0 w-3/4 h-full pointer-events-none opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-105 transition-all duration-700 flex items-center justify-center">
                            <span className="text-[12vw] font-black text-black-main tracking-tighter select-none font-display">YZY</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-sec mb-1">
                                Footwear
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-black-main font-display">
                                Yeezy Series
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-sec mt-2 max-w-xs leading-relaxed">
                                The iconic Foam RNNR Ararat. Avant-garde comfort engineered in collaboration with Adidas.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-black-main group-hover:mr-2 transition-all">
                                Shop Sneakers
                            </span>
                            <span className="text-lg">&rarr;</span>
                        </div>
                    </div>

                    {/* Fins Card */}
                    <div 
                        onClick={() => onNavigate("fins")}
                        className="card-item group relative bg-card-bg rounded-xl p-8 sm:p-12 overflow-hidden flex flex-col justify-between aspect-[4/3] cursor-pointer hover:shadow-xl hover:shadow-black-main/5 transition-all duration-500 border border-border-main"
                    >
                        <div className="absolute right-0 top-0 w-3/4 h-full pointer-events-none opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-105 transition-all duration-700 flex items-center justify-center">
                            <span className="text-[12vw] font-black text-black-main tracking-tighter select-none font-display">FINS</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-sec mb-1">
                                Hydrodynamics
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-black-main font-display">
                                Carbon Fins
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-sec mt-2 max-w-xs leading-relaxed">
                                Ultra-lightweight carbon fiber surfboard fins designed for precision carve and speed.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-black-main group-hover:mr-2 transition-all">
                                View Collection
                            </span>
                            <span className="text-lg">&rarr;</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ---------- FOOTER ---------- */}
            <footer className="border-t border-border-main px-6 sm:px-10 lg:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-sec text-[11px] font-medium uppercase tracking-wider">
                <div className="flex items-center gap-6">
                    <button onClick={() => onNavigate("about")} className="hover:text-black-main transition-colors cursor-pointer">About Us</button>
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
