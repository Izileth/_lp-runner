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
                        Início
                    </button>
                    <button
                        onClick={() => onNavigate("auctions")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        Leilões
                    </button>
                    <button
                        onClick={() => onNavigate("create-auction")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        Criar Leilão
                    </button>
                    <button
                        onClick={() => onNavigate("login")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => onNavigate("register")}
                        className="hover:text-black-main transition-colors cursor-pointer"
                    >
                        Cadastrar
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
