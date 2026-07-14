import React, { useState, useRef, useMemo } from "react";
import gsap from "gsap";
import type { Route } from "../types";
import { useCart } from "../context/CartContext";
import { useFloatingPills } from "../hooks/useFloatingPills";
import { usePageEntrance } from "../hooks/usePageEntrance";
import PageLayout from "../components/templates/PageLayout";
import FloatingPill from "../components/atoms/FloatingPill";
import FinSelectorButton from "../components/molecules/FinSelectorButton";
import FinDetailsPanel from "../components/organisms/FinDetailsPanel";
import { FINS_DATA } from "../data/fins";

interface FinsProps {
    onNavigate: (route: Route) => void;
}

export const Fins: React.FC<FinsProps> = ({ onNavigate }) => {
    const [selectedFinIndex, setSelectedFinIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const { addToBag } = useCart();

    const activeFin = FINS_DATA[selectedFinIndex];

    // Apply floating animations to pills
    useFloatingPills(containerRef);

    // Entrance GSAP animation config
    const entranceAnimations = useMemo(
        () => [
            {
                target: titleRef,
                from: { y: 80, opacity: 0 },
                to: { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
            },
            {
                target: ".fin-selector-btn",
                from: { opacity: 0, x: -20 },
                to: {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    delay: 0.3,
                    ease: "power2.out",
                },
            },
            {
                target: ".details-panel",
                from: { opacity: 0, y: 30 },
                to: { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power3.out" },
            },
        ],
        []
    );

    usePageEntrance(containerRef, entranceAnimations);

    const handleFinSelect = (index: number) => {
        setSelectedFinIndex(index);
        gsap.fromTo(
            ".details-content",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
    };

    const handleAddToBag = () => {
        addToBag({
            id: activeFin.id,
            name: activeFin.name,
            price: activeFin.price,
            details: activeFin.specs.configuration,
        });
        alert(`Added ${activeFin.name} to bag.`);
    };

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="fins" showFooterLinks={true}>
            <div ref={containerRef} className="relative w-full overflow-hidden">
                {/* ---------- WORDMARK + GRAPHIC ---------- */}
                <div className="relative flex items-center justify-center px-4 min-h-[220px] sm:min-h-[300px] lg:min-h-[360px]">
                    {/* Decorative floating elements */}
                    <FloatingPill className="left-[8%] top-[10%] w-10 h-6 rotate-[-20deg]" />
                    <FloatingPill className="right-[12%] top-[15%] w-11 h-7 rotate-[25deg] blur-[1px]" />
                    <FloatingPill className="left-[22%] bottom-[12%] w-9 h-5 rotate-[10deg]" />

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
                                <FinSelectorButton
                                    key={fin.id}
                                    fin={fin}
                                    isSelected={selectedFinIndex === idx}
                                    onClick={() => handleFinSelect(idx)}
                                />
                            ))}
                        </div>

                        {/* Specification / Details Panel */}
                        <FinDetailsPanel fin={activeFin} onAddToBag={handleAddToBag} />
                    </div>
                </main>
            </div>
        </PageLayout>
    );
};

export default Fins;
