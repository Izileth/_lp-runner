import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import type { Route } from "../../types";
import { useAuth } from "../../context/AuthContext";
import{ useProfile} from "../../hooks/useProfile";
import { useBid } from "../../context/BidContext";
import BidCard from "../molecules/BidCard";
import { User, LogOut } from "lucide-react";
import Logo from '../../assets/logo.svg'

interface NavbarProps {
    onNavigate: (route: Route) => void;
    currentRoute: Route;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentRoute }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { signOut } = useAuth();
    const { profile } = useProfile();
    const { latestBid, totalActiveBids } = useBid();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const menuBtnRef = useRef<HTMLButtonElement>(null);

    // Sidebar open/close animation with GSAP
    useEffect(() => {
        if (isOpen) {
            // Block scrolling when menu is open
            document.body.style.overflow = "hidden";

            // Open Animation
            gsap.fromTo(
                sidebarRef.current,
                { x: "100%" },
                { x: "0%", duration: 0.5, ease: "power3.out" }
            );

            gsap.fromTo(
                ".mobile-nav-link",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    delay: 0.15,
                    ease: "power2.out",
                }
            );
        } else {
            document.body.style.overflow = "";

            // Close Animation
            gsap.to(sidebarRef.current, {
                x: "100%",
                duration: 0.4,
                ease: "power3.inOut",
            });
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleMobileLinkClick = (route: Route) => {
        setIsOpen(false);
        // Delay navigation slightly to let the menu close smoothly
        setTimeout(() => {
            onNavigate(route);
        }, 300);
    };

    return (
        <>
            {/* ---------- MAIN HEADER ---------- */}
            <header className="relative z-30 flex items-center justify-between px-6 sm:px-10 lg:px-14 py-6 sm:py-8 bg-transparent">
                {/* Logo */}
                <img 
                    src={Logo} 
                    alt="Logo" 
                    onClick={() => onNavigate("home")} 
                    className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity" 
                />

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase text-black-main">
                    <button
                        onClick={() => onNavigate("home")}
                        className={`hover:opacity-60 transition-opacity cursor-pointer ${
                            currentRoute === "home" ? "underline underline-offset-4 decoration-border-main" : ""
                        }`}
                    >
                        Início
                    </button>
                    <span className="text-border-main">/</span>
                    <button
                        onClick={() => onNavigate("auctions")}
                        className={`hover:opacity-60 transition-opacity cursor-pointer ${
                            currentRoute === "auctions" || currentRoute === "create-auction" || currentRoute === "auction-detail" ? "underline underline-offset-4 decoration-border-main" : ""
                        }`}
                    >
                        Leilões
                    </button>
                    {profile && (
                        <>
                            <span className="text-border-main">/</span>
                            <button
                                onClick={() => onNavigate("create-auction")}
                                className={`hover:opacity-60 transition-opacity cursor-pointer ${
                                    currentRoute === "create-auction" ? "underline underline-offset-4 decoration-border-main" : ""
                                }`}
                            >
                                Criar Leilão
                            </button>
                        </>
                    )}
                </nav>

                {/* Right Area: Account/Bag + Mobile Hamburger */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Account Button */}
                    {profile ? (
                        <div className="hidden sm:flex items-center gap-3">
                            <button
                                onClick={() => onNavigate("profile")}
                                className={`flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-black-main hover:opacity-60 transition-opacity cursor-pointer ${
                                    currentRoute === "profile" ? "underline underline-offset-4 decoration-border-main" : ""
                                }`}
                            >
                                {profile ? (
                                    <img src={profile?.avatar_url || "https://via.placeholder.com/150"} alt="User Avatar" className="w-5 h-5 rounded-full object-cover" />
                                ) : (
                                    <User className="w-3.5 h-3.5" />
                                )}
                                {profile?.full_name?.split(" ")[0] || "Conta"}
                            </button>
                            <button
                                onClick={() => signOut()}
                                className="text-gray-sec hover:text-black-main transition-colors cursor-pointer"
                                aria-label="Sair"
                                title="Sair"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onNavigate("login" as Route)}
                            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-black-main hover:opacity-60 transition-opacity cursor-pointer"
                        >
                            <User className="w-3.5 h-3.5" />
                            Entrar
                        </button>
                    )}

                    {/* Active Bid Card (only shown when user has active bids) */}
                    {profile && latestBid && (
                        <BidCard
                            latestBid={latestBid}
                            totalActiveBids={totalActiveBids}
                            onNavigate={onNavigate}
                        />
                    )}
             

                    {/* Mobile Hamburger Button */}
                    <button
                        ref={menuBtnRef}
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex md:hidden flex-col justify-between w-6 h-4 cursor-pointer focus:outline-none z-50 group"
                        aria-label="Toggle mobile menu"
                    >
                        <span
                            className={`w-full h-[2px] bg-black-main rounded-full transition-all duration-300 ${
                                isOpen ? "rotate-45 translate-y-[7px]" : ""
                            }`}
                        />
                        <span
                            className={`w-full h-[2px] bg-black-main rounded-full transition-all duration-300 ${
                                isOpen ? "opacity-0" : ""
                            }`}
                        />
                        <span
                            className={`w-full h-[2px] bg-black-main rounded-full transition-all duration-300 ${
                                isOpen ? "-rotate-45 -translate-y-[7px]" : ""
                            }`}
                        />
                    </button>
                </div>
            </header>

            {/* ---------- FULL SCREEN SIDEBAR MOBILE OVERLAY ---------- */}
            <div
                ref={sidebarRef}
                className="fixed inset-0 z-40 bg-ivory text-black-main transform translate-x-full md:hidden flex flex-col justify-between px-8 py-24 border-l border-border-main"
            >
                {/* Mobile Links Container */}
                <div className="flex flex-col gap-8 mt-12">
                    <button
                        onClick={() => handleMobileLinkClick("home")}
                        className="mobile-nav-link text-left text-4xl sm:text-5xl font-bold tracking-tighter uppercase font-display cursor-pointer hover:text-gray-sec transition-colors"
                    >
                        Início
                    </button>
                    <button
                        onClick={() => handleMobileLinkClick("auctions")}
                        className="mobile-nav-link text-left text-4xl sm:text-5xl font-bold tracking-tighter uppercase font-display cursor-pointer hover:text-gray-sec transition-colors"
                    >
                        Leilões
                    </button>
                    {profile && (
                        <button
                            onClick={() => handleMobileLinkClick("create-auction")}
                            className="mobile-nav-link text-left text-4xl sm:text-5xl font-bold tracking-tighter uppercase font-display cursor-pointer hover:text-gray-sec transition-colors"
                        >
                            Criar Leilão
                        </button>
                    )}
                    <button
                        onClick={() => handleMobileLinkClick("profile")}
                        className="mobile-nav-link text-left text-4xl sm:text-5xl font-bold tracking-tighter uppercase font-display cursor-pointer hover:text-gray-sec transition-colors"
                    >
                        Minha Conta
                    </button>
                </div>

                {/* Mobile Sidebar Footer */}
                <div className="mobile-nav-link border-t border-border-main pt-8 flex flex-col gap-2 text-[10px] font-bold tracking-widest text-gray-sec uppercase">
                    <div>Runner Space &middot; Next-Gen Design</div>
                    <div>&copy; 2026. All rights reserved.</div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
