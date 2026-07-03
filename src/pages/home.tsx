import { useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "../components/Navbar";

interface HomeProps {
    onNavigate: (route: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const navButtonsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
            );

            gsap.fromTo(
                ".nav-btn",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: "power3.out",
                }
            );

            // Subtle floating animation for decorative abstract pills
            gsap.to(".floating-pill", {
                y: "random(-10, 10)",
                x: "random(-8, 8)",
                rotation: "random(-5, 5)",
                duration: "random(4, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={heroRef} className="relative w-full min-h-screen bg-ivory text-black-main overflow-hidden flex flex-col justify-between font-sans">
            <Navbar onNavigate={onNavigate} currentRoute="home" />

            {/* ---------- HERO SECTION ---------- */}
            <main className="relative flex-1 flex flex-col items-center justify-center px-6">
                {/* Decorative floating pills (matching shoe material/color: cream/off-white) */}
                <span className="floating-pill pointer-events-none absolute left-[12%] top-[25%] w-12 h-7 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[-15deg] blur-[0.5px]" />
                <span className="floating-pill pointer-events-none absolute left-[24%] top-[12%] w-8 h-5 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[20deg] blur-[1px]" />
                <span className="floating-pill pointer-events-none absolute right-[14%] top-[18%] w-14 h-8 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[30deg] blur-[0.5px]" />
                <span className="floating-pill pointer-events-none absolute right-[28%] bottom-[20%] w-10 h-6 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[-8deg] blur-[1px]" />

                {/* Giant Wordmark in Audiowide */}
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
                <div ref={navButtonsRef} className="flex flex-wrap justify-center gap-4 mt-12 max-w-2xl">
                    <button
                        onClick={() => onNavigate("product")}
                        className="nav-btn px-8 py-4 bg-black-main text-white text-[11px] font-bold tracking-widest uppercase rounded-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-black-main"
                    >
                        Shop Sneakers
                    </button>
                    <button
                        onClick={() => onNavigate("fins")}
                        className="nav-btn px-8 py-4 bg-card-bg text-black-main text-[11px] font-bold tracking-widest uppercase rounded-md border border-border-main hover:bg-black-main hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        Explore Fins
                    </button>
                    <button
                        onClick={() => onNavigate("about")}
                        className="nav-btn px-8 py-4 bg-card-bg text-black-main text-[11px] font-bold tracking-widest uppercase rounded-md border border-border-main hover:bg-black-main hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        About Studio
                    </button>
                    <button
                        onClick={() => onNavigate("contact")}
                        className="nav-btn px-8 py-4 bg-card-bg text-black-main text-[11px] font-bold tracking-widest uppercase rounded-md border border-border-main hover:bg-black-main hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        Contact
                    </button>
                </div>
            </main>

            {/* ---------- FOOTER ---------- */}
            <footer className="border-t border-border-main px-6 sm:px-10 lg:px-14 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-sec text-[10px] font-semibold uppercase tracking-widest">
                <div>
                    RUNNER SPACE &middot; NEXT-GEN DESIGN
                </div>
                <div>
                    &copy; 2026. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
