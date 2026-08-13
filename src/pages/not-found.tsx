import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import Button from "../components/atoms/Button";
import FloatingPill from "../components/atoms/FloatingPill";
import { ArrowLeft, SearchX } from "lucide-react";
import type { Route } from "../types";

interface NotFoundProps {
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
                ".not-found-card",
                { y: 40, opacity: 0, scale: 0.98 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.1,
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleGoHome = () => {
        gsap.to(".not-found-card", {
            y: -20,
            opacity: 0,
            scale: 0.96,
            duration: 0.4,
            ease: "power3.in",
            onComplete: () => onNavigate("home"),
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-ivory flex flex-col items-center justify-center overflow-hidden px-6 py-12"
        >
            {/* Decorative floating pills */}
            <FloatingPill className="left-[5%] top-[20%] w-10 h-6 rotate-[-20deg] opacity-40 floating-pill" />
            <FloatingPill className="right-[8%] top-[15%] w-14 h-8 rotate-[25deg] opacity-30 floating-pill" />
            <FloatingPill className="left-[15%] bottom-[25%] w-8 h-5 rotate-[12deg] blur-[1px] opacity-30 floating-pill" />
            <FloatingPill className="right-[12%] bottom-[20%] w-12 h-7 rotate-[-10deg] opacity-25 floating-pill" />

            {/* Background Wordmark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02] overflow-hidden -z-10">
                <span className="text-[40vw] font-display font-black tracking-tighter leading-none">
                    404
                </span>
            </div>

            {/* Back to Home */}
            <button
                onClick={handleGoHome}
                className="not-found-fade-up absolute top-8 left-8 flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gray-sec hover:text-black-main transition-colors cursor-pointer group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Home
            </button>

            {/* Not Found Card */}
            <div className="not-found-card w-full max-w-md">
                <div className="bg-card-bg border border-border-main rounded-2xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
                    
                    <div className="w-20 h-20 bg-black-main rounded-full flex items-center justify-center mb-6">
                        <SearchX className="w-10 h-10 text-ivory" />
                    </div>

                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-sec mb-2">
                        ERRO 404
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black-main">
                        PÁGINA NÃO ENCONTRADA
                    </h1>
                    <p className="text-sm text-gray-sec mt-4 leading-relaxed mb-8 max-w-xs">
                        A página que você está procurando pode ter sido removida, mudou de nome ou está temporariamente indisponível.
                    </p>

                    <Button
                        onClick={handleGoHome}
                        variant="primary"
                        fullWidth
                    >
                        Voltar para a Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
