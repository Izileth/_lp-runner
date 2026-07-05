import React, { useRef, useMemo } from "react";
import type { Route } from "../types";
import { useFloatingPills } from "../hooks/useFloatingPills";
import { usePageEntrance } from "../hooks/usePageEntrance";
import PageLayout from "../components/templates/PageLayout";
import FloatingPill from "../components/atoms/FloatingPill";
import Button from "../components/atoms/Button";

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
                from: { y: 80, opacity: 0 },
                to: { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
            },
            {
                target: ".nav-btn",
                from: { y: 30, opacity: 0 },
                to: {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: "power3.out",
                },
            },
        ],
        []
    );

    usePageEntrance(heroRef, entranceAnimations);

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="home" showFooterLinks={false}>
            <main ref={heroRef} className="relative flex-1 flex flex-col items-center justify-center px-6 min-h-[70vh]">
                {/* Decorative floating pills */}
                <FloatingPill className="left-[12%] top-[25%] w-12 h-7 rotate-[-15deg]" />
                <FloatingPill className="left-[24%] top-[12%] w-8 h-5 rotate-[20deg] blur-[1px]" />
                <FloatingPill className="right-[14%] top-[18%] w-14 h-8 rotate-[30deg]" />
                <FloatingPill className="right-[28%] bottom-[20%] w-10 h-6 rotate-[-8deg] blur-[1px]" />

                {/* Giant Wordmark */}
                <div className="relative text-center select-none w-full max-w-5xl overflow-hidden py-4">
                    <h1
                        ref={titleRef}
                        className="text-[15vw] sm:text-[13vw] lg:text-[10vw] leading-[0.8] text-black-main font-display whitespace-nowrap"
                        style={{
                            letterSpacing: "-0.04em",
                        }}
                    >
                        RUNNER
                    </h1>
                </div>

                {/* Navigation Buttons Row */}
                <div className="flex flex-wrap justify-center gap-4 mt-12 max-w-2xl">
                    <Button
                        onClick={() => onNavigate("product")}
                        variant="primary"
                        className="nav-btn"
                    >
                        Shop Sneakers
                    </Button>
                    <Button
                        onClick={() => onNavigate("fins")}
                        variant="secondary"
                        className="nav-btn"
                    >
                        Explore Fins
                    </Button>
                    <Button
                        onClick={() => onNavigate("about")}
                        variant="secondary"
                        className="nav-btn"
                    >
                        About Studio
                    </Button>
                    <Button
                        onClick={() => onNavigate("contact")}
                        variant="secondary"
                        className="nav-btn"
                    >
                        Contact
                    </Button>
                </div>
            </main>
        </PageLayout>
    );
};

export default Home;
