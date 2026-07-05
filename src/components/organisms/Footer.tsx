import React from "react";
import type { Route } from "../../types";

interface FooterProps {
    onNavigate?: (route: Route) => void;
    showLinks?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, showLinks = true }) => {
    return (
        <footer className="border-t border-border-main px-6 sm:px-10 lg:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-sec text-[11px] font-medium uppercase tracking-wider">
            {showLinks && onNavigate ? (
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <button
                        onClick={() => onNavigate("home")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => onNavigate("product")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        Sneakers
                    </button>
                    <button
                        onClick={() => onNavigate("fins")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        Fins
                    </button>
                    <button
                        onClick={() => onNavigate("about")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        About
                    </button>
                    <button
                        onClick={() => onNavigate("contact")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        Contact
                    </button>
                </div>
            ) : (
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-sec">
                    RUNNER SPACE &middot; NEXT-GEN DESIGN
                </div>
            )}
            <div className="text-center sm:text-right">
                &copy; 2026 Runner Space. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
