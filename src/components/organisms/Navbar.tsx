import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import type { Route } from "../../types";
import { useCart } from "../../context/CartContext";
import Logo from "../atoms/Logo";
import BagButton from "../molecules/BagButton";

interface NavbarProps {
    onNavigate: (route: Route) => void;
    currentRoute: Route;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentRoute }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { bagTotal, bagItemsCount } = useCart();
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
                <Logo onClick={() => onNavigate("home")} />

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase text-black-main">
                    <button
                        onClick={() => onNavigate("product")}
                        className={`hover:opacity-60 transition-opacity cursor-pointer ${
                            currentRoute === "product" ? "underline underline-offset-4 decoration-border-main" : ""
                        }`}
                    >
                        Shop
                    </button>
                    <span className="text-border-main">/</span>
                    <button
                        onClick={() => onNavigate("fins")}
                        className={`hover:opacity-60 transition-opacity cursor-pointer ${
                            currentRoute === "fins" ? "underline underline-offset-4 decoration-border-main" : ""
                        }`}
                    >
                        Fins
                    </button>
                    <button
                        onClick={() => onNavigate("about")}
                        className={`hover:opacity-60 transition-opacity cursor-pointer ${
                            currentRoute === "about" ? "underline underline-offset-4 decoration-border-main" : ""
                        }`}
                    >
                        About
                    </button>
                    <button
                        onClick={() => onNavigate("contact")}
                        className={`hover:opacity-60 transition-opacity cursor-pointer ${
                            currentRoute === "contact" ? "underline underline-offset-4 decoration-border-main" : ""
                        }`}
                    >
                        Contact
                    </button>
                </nav>

                {/* Right Area: Account/Bag + Mobile Hamburger */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Account (hidden on tiny screens) */}
                    <span className="hidden sm:inline text-[11px] font-semibold tracking-widest uppercase text-black-main">
                        Account
                    </span>

                    {/* Bag Button */}
                    <BagButton
                        totalPrice={bagTotal}
                        itemsCount={bagItemsCount}
                        onClick={() => onNavigate("product")}
                    />

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
                        Home
                    </button>
                    <button
                        onClick={() => handleMobileLinkClick("product")}
                        className="mobile-nav-link text-left text-4xl sm:text-5xl font-bold tracking-tighter uppercase font-display cursor-pointer hover:text-gray-sec transition-colors"
                    >
                        Shop Sneakers
                    </button>
                    <button
                        onClick={() => handleMobileLinkClick("fins")}
                        className="mobile-nav-link text-left text-4xl sm:text-5xl font-bold tracking-tighter uppercase font-display cursor-pointer hover:text-gray-sec transition-colors"
                    >
                        Explore Fins
                    </button>
                    <button
                        onClick={() => handleMobileLinkClick("about")}
                        className="mobile-nav-link text-left text-4xl sm:text-5xl font-bold tracking-tighter uppercase font-display cursor-pointer hover:text-gray-sec transition-colors"
                    >
                        About Studio
                    </button>
                    <button
                        onClick={() => handleMobileLinkClick("contact")}
                        className="mobile-nav-link text-left text-4xl sm:text-5xl font-bold tracking-tighter uppercase font-display cursor-pointer hover:text-gray-sec transition-colors"
                    >
                        Contact
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
