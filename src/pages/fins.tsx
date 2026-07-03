import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const WORDMARK_FONT_ID = "fins-archivo-black-font";
const WORDMARK_FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap";

interface FinsProps {
    onNavigate: (route: string) => void;
}

interface FinProduct {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    description: string;
    specs: {
        material: string;
        base: string;
        depth: string;
        foil: string;
        configuration: string;
    };
}

const FINS_DATA: FinProduct[] = [
    {
        id: "apex-thruster",
        name: "Apex Thruster",
        subtitle: "High-Speed Carving & Release",
        price: 185,
        description: "Engineered from solid high-density pre-preg carbon fiber. The Apex Thruster set offers unmatched rigidity, explosive response off the lip, and smooth release through hard turns.",
        specs: {
            material: "100% Pre-Preg Carbon Fiber",
            base: "4.55 inches",
            depth: "4.62 inches",
            foil: "Flat (Center: 50/50)",
            configuration: "Thruster (3 Fin Set)",
        }
    },
    {
        id: "stealth-keel",
        name: "Stealth Keel",
        subtitle: "Retro Drive & Modern Control",
        price: 145,
        description: "Optimized for modern twin-fins and retro fish designs. Provides ultimate drive, stability at speed, and locked-in control through long, sweeping cutbacks.",
        specs: {
            material: "Carbon-Kevlar Composite",
            base: "6.25 inches",
            depth: "4.85 inches",
            foil: "Flat / Single Bevel",
            configuration: "Twin (2 Fin Set)",
        }
    },
    {
        id: "vortex-twin",
        name: "Vortex Twin+1",
        subtitle: "Pivot & Pivot-plus-Release",
        price: 160,
        description: "Featuring a high-aspect ratio template that allows fast pivots in tight pockets. The optional trailer fin adds stability without compromising freedom.",
        specs: {
            material: "Recycled Carbon Composite",
            base: "4.80 inches",
            depth: "5.10 inches",
            foil: "80/20 Asymmetric",
            configuration: "Twin + Trailer (3 Fins)",
        }
    }
];

export default function Fins({ onNavigate }: FinsProps) {
    const [selectedFinIndex, setSelectedFinIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    const activeFin = FINS_DATA[selectedFinIndex];

    useEffect(() => {
        // Dynamic loading of Archivo Black font
        if (!document.getElementById(WORDMARK_FONT_ID)) {
            const link = document.createElement("link");
            link.id = WORDMARK_FONT_ID;
            link.rel = "stylesheet";
            link.href = WORDMARK_FONT_HREF;
            document.head.appendChild(link);
        }

        // GSAP page load animations
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" }
            );

            gsap.fromTo(
                ".fin-selector-btn",
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" }
            );

            gsap.fromTo(
                ".details-panel",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" }
            );

            // Floating pills
            gsap.to(".floating-pill", {
                y: "random(-12, 12)",
                x: "random(-8, 8)",
                rotation: "random(-12, 12)",
                duration: "random(4, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Animate details change
    const handleFinSelect = (index: number) => {
        setSelectedFinIndex(index);
        gsap.fromTo(
            ".details-content",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
    };

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-[#F1EEE6] text-neutral-900 overflow-x-hidden font-sans">
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
                            Bag &middot; $185
                        </span>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold">
                            1
                        </span>
                    </button>
                </div>
            </header>

            {/* ---------- WORDMARK + GRAPHIC ---------- */}
            <div className="relative flex items-center justify-center px-4 min-h-[220px] sm:min-h-[300px] lg:min-h-[360px]">
                {/* Decorative floating pills */}
                <span className="floating-pill pointer-events-none absolute left-[8%] top-[10%] w-10 h-6 rounded-full bg-neutral-300/70 rotate-[-20deg]" />
                <span className="floating-pill pointer-events-none absolute right-[12%] top-[15%] w-11 h-7 rounded-full bg-neutral-300/60 rotate-[25deg]" />
                <span className="floating-pill pointer-events-none absolute left-[22%] bottom-[12%] w-9 h-5 rounded-full bg-neutral-300/50 rotate-[10deg]" />

                {/* Wordmark */}
                <h1
                    ref={titleRef}
                    className="select-none text-[20vw] sm:text-[16vw] lg:text-[11vw] leading-[0.8] text-neutral-900 whitespace-nowrap"
                    style={{
                        fontFamily: "'Archivo Black', sans-serif",
                        letterSpacing: "-0.03em",
                    }}
                >
                    FINS
                </h1>

                {/* Hydrodynamic Fins Graphic overlay */}
                <div className="absolute z-10 w-[45%] sm:w-[32%] lg:w-[22%] aspect-[4/3] flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* A beautiful geometric render representing a surf fin */}
                        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl fill-neutral-900">
                            {/* Curved hydrodynamic fin shape */}
                            <path d="M20,110 C25,100 45,70 50,40 C55,10 75,5 80,10 C85,15 75,35 68,60 C60,85 58,105 56,110 Z" />
                            {/* Decorative line patterns to show carbon fiber texture/air flow */}
                            <path d="M30,105 C35,95 50,75 54,48" stroke="#ebe7dc" strokeWidth="1.5" fill="none" opacity="0.6" />
                            <path d="M40,105 C45,95 56,80 60,56" stroke="#ebe7dc" strokeWidth="1.5" fill="none" opacity="0.4" />
                            <path d="M50,105 C54,98 62,85 66,64" stroke="#ebe7dc" strokeWidth="1.5" fill="none" opacity="0.2" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ---------- MAIN GRID ---------- */}
            <main className="relative z-20 px-6 sm:px-10 lg:px-14 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Selector Panel */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                            Select Model
                        </p>
                        {FINS_DATA.map((fin, idx) => (
                            <button
                                key={fin.id}
                                onClick={() => handleFinSelect(idx)}
                                className={`fin-selector-btn text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                                    selectedFinIndex === idx
                                        ? "bg-neutral-900 border-neutral-900 text-white shadow-xl shadow-neutral-900/10"
                                        : "bg-[#ebe7dc] border-neutral-900/5 text-neutral-900 hover:bg-[#e4dfd2]"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-base font-display">{fin.name}</h3>
                                    <span className={`text-xs font-semibold ${
                                        selectedFinIndex === idx ? "text-neutral-300" : "text-neutral-500"
                                    }`}>
                                        ${fin.price}
                                    </span>
                                </div>
                                <p className={`text-xs mt-1 leading-normal ${
                                    selectedFinIndex === idx ? "text-neutral-400" : "text-neutral-500"
                                }`}>
                                    {fin.subtitle}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Specification / Details Panel */}
                    <div className="details-panel lg:col-span-8 bg-[#ebe7dc] border border-neutral-900/5 rounded-2xl p-8 sm:p-12 flex flex-col justify-between">
                        <div className="details-content flex flex-col gap-6">
                            <div>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                                    Carbon Engineering
                                </span>
                                <h2 className="text-3xl font-extrabold text-neutral-900 mt-1 font-display">
                                    {activeFin.name}
                                </h2>
                                <p className="text-xs sm:text-sm text-neutral-500 italic mt-0.5">
                                    {activeFin.subtitle}
                                </p>
                            </div>

                            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed max-w-2xl">
                                {activeFin.description}
                            </p>

                            {/* Tech Specs Grid */}
                            <div className="border-t border-neutral-900/10 pt-6 mt-2">
                                <h4 className="text-[10px] font-bold tracking-widest uppercase text-neutral-900 mb-4">
                                    Technical Specifications
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">Material</p>
                                        <p className="text-xs sm:text-sm font-semibold text-neutral-900 mt-0.5">{activeFin.specs.material}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">Base</p>
                                        <p className="text-xs sm:text-sm font-semibold text-neutral-900 mt-0.5">{activeFin.specs.base}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">Depth</p>
                                        <p className="text-xs sm:text-sm font-semibold text-neutral-900 mt-0.5">{activeFin.specs.depth}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">Foil type</p>
                                        <p className="text-xs sm:text-sm font-semibold text-neutral-900 mt-0.5">{activeFin.specs.foil}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">Config</p>
                                        <p className="text-xs sm:text-sm font-semibold text-neutral-900 mt-0.5">{activeFin.specs.configuration}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA / Price Panel */}
                        <div className="details-content flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-neutral-900/10 pt-8 mt-12">
                            <div>
                                <p className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">Price</p>
                                <p className="text-2xl font-extrabold text-neutral-900">${activeFin.price} USD</p>
                            </div>
                            <button
                                type="button"
                                className="w-full sm:w-auto rounded-md bg-neutral-900 text-white text-xs sm:text-sm font-bold tracking-widest uppercase px-10 py-4 hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                                Add Set to Bag
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* ---------- FOOTER ---------- */}
            <footer className="border-t border-neutral-900/10 px-6 sm:px-10 lg:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-neutral-500 text-[11px] font-medium uppercase tracking-wider">
                <div className="flex items-center gap-6">
                    <button onClick={() => onNavigate("home")} className="hover:text-neutral-900 transition-colors cursor-pointer">Home</button>
                    <button onClick={() => onNavigate("product")} className="hover:text-neutral-900 transition-colors cursor-pointer">Sneakers</button>
                    <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
                </div>
                <div>
                    &copy; 2026 Runner Space. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
