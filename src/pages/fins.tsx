import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Navbar from "../components/Navbar";



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

    const handleFinSelect = (index: number) => {
        setSelectedFinIndex(index);
        gsap.fromTo(
            ".details-content",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
    };

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-ivory text-black-main overflow-x-hidden font-sans">
            <Navbar onNavigate={onNavigate} currentRoute="fins" bagTotal={185} bagItemsCount={1} />

            {/* ---------- WORDMARK + GRAPHIC ---------- */}
            <div className="relative flex items-center justify-center px-4 min-h-[220px] sm:min-h-[300px] lg:min-h-[360px]">
                {/* Decorative floating elements */}
                <span className="floating-pill pointer-events-none absolute left-[8%] top-[10%] w-10 h-6 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[-20deg] blur-[0.5px]" />
                <span className="floating-pill pointer-events-none absolute right-[12%] top-[15%] w-11 h-7 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[25deg] blur-[1px]" />
                <span className="floating-pill pointer-events-none absolute left-[22%] bottom-[12%] w-9 h-5 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[10deg] blur-[0.5px]" />

                {/* Wordmark */}
                <h1
                    ref={titleRef}
                    className="select-none text-[20vw] sm:text-[16vw] lg:text-[11vw] leading-[0.8] text-black-main whitespace-nowrap font-display"
                    style={{
                        letterSpacing: "-0.03em",
                    }}
                >
                    FINS
                </h1>
            </div>

            {/* ---------- MAIN GRID ---------- */}
            <main className="relative z-20 px-6 sm:px-10 lg:px-14 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Selector Panel */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-sec mb-2">
                            Select Model
                        </p>
                        {FINS_DATA.map((fin, idx) => (
                            <button
                                key={fin.id}
                                onClick={() => handleFinSelect(idx)}
                                className={`fin-selector-btn text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                                    selectedFinIndex === idx
                                        ? "bg-black-main border-black-main text-white shadow-xl shadow-black-main/10"
                                        : "bg-card-bg border-border-main text-black-main hover:bg-[#eae6db]"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-base font-display">{fin.name}</h3>
                                    <span className={`text-xs font-semibold ${
                                        selectedFinIndex === idx ? "text-gray-sec" : "text-gray-sec"
                                    }`}>
                                        ${fin.price}
                                    </span>
                                </div>
                                <p className={`text-xs mt-1 leading-normal ${
                                    selectedFinIndex === idx ? "text-neutral-400" : "text-gray-sec"
                                }`}>
                                    {fin.subtitle}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Specification / Details Panel */}
                    <div className="details-panel lg:col-span-8 bg-card-bg border border-border-main rounded-xl p-8 sm:p-12 flex flex-col justify-between">
                        <div className="details-content flex flex-col gap-6">
                            <div>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-sec">
                                    Carbon Engineering
                                </span>
                                <h2 className="text-3xl font-extrabold text-black-main mt-1 font-display">
                                    {activeFin.name}
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-sec italic mt-0.5">
                                    {activeFin.subtitle}
                                </p>
                            </div>

                            <p className="text-sm sm:text-base text-black-main leading-relaxed max-w-2xl">
                                {activeFin.description}
                            </p>

                            {/* Tech Specs Grid */}
                            <div className="border-t border-border-main pt-6 mt-2">
                                <h4 className="text-[10px] font-bold tracking-widest uppercase text-black-main mb-4">
                                    Technical Specifications
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-gray-sec uppercase">Material</p>
                                        <p className="text-xs sm:text-sm font-semibold text-black-main mt-0.5">{activeFin.specs.material}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-gray-sec uppercase">Base</p>
                                        <p className="text-xs sm:text-sm font-semibold text-black-main mt-0.5">{activeFin.specs.base}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-gray-sec uppercase">Depth</p>
                                        <p className="text-xs sm:text-sm font-semibold text-black-main mt-0.5">{activeFin.specs.depth}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-gray-sec uppercase">Foil type</p>
                                        <p className="text-xs sm:text-sm font-semibold text-black-main mt-0.5">{activeFin.specs.foil}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold tracking-wider text-gray-sec uppercase">Config</p>
                                        <p className="text-xs sm:text-sm font-semibold text-black-main mt-0.5">{activeFin.specs.configuration}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA / Price Panel */}
                        <div className="details-content flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border-main pt-8 mt-12">
                            <div>
                                <p className="text-[9px] font-bold tracking-widest text-gray-sec uppercase">Price</p>
                                <p className="text-2xl font-extrabold text-black-main">${activeFin.price} USD</p>
                            </div>
                            <button
                                type="button"
                                className="w-full sm:w-auto rounded-md bg-black-main text-white text-xs sm:text-sm font-bold tracking-widest uppercase px-10 py-4 hover:opacity-90 transition-all cursor-pointer"
                            >
                                Add Set to Bag
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* ---------- FOOTER ---------- */}
            <footer className="border-t border-border-main px-6 sm:px-10 lg:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-sec text-[11px] font-medium uppercase tracking-wider">
                <div className="flex items-center gap-6">
                    <button onClick={() => onNavigate("home")} className="hover:text-black-main transition-colors cursor-pointer">Home</button>
                    <button onClick={() => onNavigate("product")} className="hover:text-black-main transition-colors cursor-pointer">Sneakers</button>
                    <a href="#" className="hover:text-black-main transition-colors">Privacy</a>
                </div>
                <div>
                    &copy; 2026 Runner Space. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
