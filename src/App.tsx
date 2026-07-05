import { useState, useRef } from "react";
import gsap from "gsap";
import Home from "./pages/home";
import HeroYeezy from "./pages/product";
import About from "./pages/about";
import Fins from "./pages/fins";
import Contact from "./pages/contact";
import heroImage from "./assets/hero.png";
import type { Route } from "./types";
import { CartProvider } from "./context/CartContext";

function App() {
    const [currentRoute, setCurrentRoute] = useState<Route>("home");
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleNavigate = (route: Route) => {
        if (route === currentRoute) return;

        // Visual transition timeline
        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentRoute(route);
                window.scrollTo({ top: 0, behavior: "instant" });

                // Out animation (slide overlay upwards to reveal new content)
                gsap.fromTo(
                    overlayRef.current,
                    { y: "0%" },
                    { y: "-100%", duration: 0.5, ease: "power3.inOut" }
                );
            },
        });

        // In animation (slide overlay up from bottom to cover screen)
        tl.fromTo(
            overlayRef.current,
            { y: "100%" },
            { y: "0%", duration: 0.5, ease: "power3.inOut" }
        );
    };

    const renderRoute = () => {
        switch (currentRoute) {
            case "home":
                return <Home onNavigate={handleNavigate} />;
            case "product":
                return (
                    <HeroYeezy
                        productImageUrl={heroImage}
                        productName="Foam RNNR Ararat"
                        onNavigate={handleNavigate}
                    />
                );
            case "about":
                return <About onNavigate={handleNavigate} />;
            case "fins":
                return <Fins onNavigate={handleNavigate} />;
            case "contact":
                return <Contact onNavigate={handleNavigate} />;
            default:
                return <Home onNavigate={handleNavigate} />;
        }
    };

    return (
        <CartProvider>
            <div className="min-h-screen bg-ivory text-black-main relative overflow-hidden">
                {renderRoute()}

                {/* GSAP Page Transition Curtain Overlay */}
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 bg-black-main pointer-events-none transform translate-y-full flex items-center justify-center"
                >
                    <div className="text-ivory text-2xl font-extrabold tracking-widest uppercase font-display flex items-center gap-[1px]">
                        <span className="inline-block scale-x-[-1]">R</span>
                        <span>unner</span>
                    </div>
                </div>
            </div>
        </CartProvider>
    );
}

export default App;
