import { useRef } from "react";
import { Routes, Route as RouterRoute, useNavigate, useLocation, useParams } from "react-router-dom";
import gsap from "gsap";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import { Auctions } from "./pages/auctions";
import { CreateAuction } from "./pages/create-auction";
import { AuctionDetail } from "./pages/auction-detail";
import NotFound from "./pages/not-found";
import type { Route } from "./types";
import { AuthProvider } from "./context/AuthContext";
import { BidProvider } from "./context/BidContext";
import ErrorBoundary from "./components/organisms/ErrorBoundary";

function AuctionDetailWrapper({ onNavigate }: { onNavigate: (route: Route, itemId?: string) => void }) {
    const { id } = useParams<{ id: string }>();
    return <AuctionDetail auctionId={id || ""} onNavigate={onNavigate} />;
}

function App() {

    const navigate = useNavigate();
    const location = useLocation();
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleNavigate = (route: Route, itemId?: string) => {
        const paths: Record<Route, string> = {
            home: "/",
            login: "/login",
            register: "/register",
            profile: "/profile",
            auctions: "/auctions",
            "create-auction": "/auctions/create",
            "auction-detail": itemId ? `/auctions/${itemId}` : "/auctions",
            "not-found": "/404",
        };
        const targetPath = paths[route] || "/";

        if (location.pathname === targetPath) return;

        // Visual transition timeline
        const tl = gsap.timeline({
            onComplete: () => {
                navigate(targetPath);
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

    return (
        <ErrorBoundary>
            <AuthProvider>
                    <BidProvider>
                        <div className="min-h-screen bg-ivory text-black-main relative overflow-hidden">
                            <Routes>
                                <RouterRoute path="/" element={<Home onNavigate={handleNavigate} />} />
                                <RouterRoute path="/login" element={<Login onNavigate={handleNavigate} />} />
                                <RouterRoute path="/register" element={<Register onNavigate={handleNavigate} />} />
                                <RouterRoute path="/profile" element={<Profile onNavigate={handleNavigate} />} />
                                <RouterRoute path="/auctions" element={<Auctions onNavigate={handleNavigate} />} />
                                <RouterRoute path="/auctions/create" element={<CreateAuction onNavigate={handleNavigate} />} />
                                <RouterRoute path="/auctions/:id" element={<AuctionDetailWrapper onNavigate={handleNavigate} />} />
                                <RouterRoute path="*" element={<NotFound onNavigate={handleNavigate} />} />
                            </Routes>

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
                    </BidProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;

