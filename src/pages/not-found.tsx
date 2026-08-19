import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import Button from "../components/atoms/Button";
import FloatingPill from "../components/atoms/FloatingPill";
import { ArrowLeft, ArrowDown, SearchX } from "lucide-react";
import type { Route } from "../types";

export interface NotFoundProps {
    onNavigate: (route: Route) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Page entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".not-found-fade-up",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.15,
                }
            );

            gsap.fromTo(
                ".not-found-headline",
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.12,
                    ease: "power4.out",
                    delay: 0.05,
                }
            );

            // subtle looping bounce on the arrows, staggered like a cascade
            gsap.to(".not-found-arrow", {
                y: 10,
                duration: 0.6,
                ease: "power1.inOut",
                repeat: -1,
                yoyo: true,
                stagger: 0.15,
                delay: 1,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleGoHome = () => {
        gsap.to(".not-found-content", {
            y: -20,
            opacity: 0,
            duration: 0.4,
            ease: "power3.in",
            onComplete: () => onNavigate("home"),
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-black-main flex flex-col overflow-hidden px-6 sm:px-10 py-8"
        >
            {/* Decorative floating pills, dimmed for dark background */}
            <FloatingPill className="left-[6%] top-[14%] w-10 h-6 rotate-[-20deg] opacity-10 floating-pill" />
            <FloatingPill className="right-[8%] top-[10%] w-14 h-8 rotate-[25deg] opacity-10 floating-pill" />
            <FloatingPill className="right-[20%] bottom-[12%] w-8 h-5 rotate-[12deg] opacity-10 floating-pill" />

            <div className="not-found-content flex flex-col flex-1">
                {/* Top bar */}
                <div className="flex items-center justify-between not-found-fade-up">
                    <button
                        onClick={handleGoHome}
                        className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-ivory/60 hover:text-ivory transition-colors cursor-pointer group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Home
                    </button>

                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-ivory/40">
                        ERRO 404
                    </span>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col justify-center gap-10 sm:gap-14 py-16">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-10">
                        {/* Giant stacked headline */}
                        <div className="leading-[0.82] -ml-1">
                            <div className="not-found-headline font-display font-black tracking-tighter text-ivory text-[26vw] sm:text-[15vw]">
                                404
                            </div>
                            <div className="not-found-headline font-display font-black tracking-tighter text-ivory text-[26vw] sm:text-[15vw]">
                                OPS!
                            </div>
                        </div>

                        {/* Aside message, mirrors the parenthetical in the reference */}
                        <p className="not-found-fade-up font-display italic text-2xl sm:text-3xl text-ivory/80 max-w-xs pt-2 sm:pt-4">
                            (a página que você procura{" "}
                            <span className="not-italic font-black">
                                não existe
                            </span>
                            )
                        </p>
                    </div>

                    {/* Arrows pointing to the CTA */}
                    <div className="not-found-fade-up flex items-center gap-4 sm:gap-6 pl-1">
                        <ArrowDown className="not-found-arrow w-6 h-6 sm:w-8 sm:h-8 text-ivory/50" />
                        <ArrowDown className="not-found-arrow w-6 h-6 sm:w-8 sm:h-8 text-ivory/50" />
                        <ArrowDown className="not-found-arrow w-6 h-6 sm:w-8 sm:h-8 text-ivory/50" />
                        <SearchX className="w-5 h-5 text-ivory/25 ml-2" />
                    </div>

                    {/* CTA */}
                    <div className="not-found-fade-up">
                        <Button onClick={handleGoHome} variant="secondary">
                            Voltar para a Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;