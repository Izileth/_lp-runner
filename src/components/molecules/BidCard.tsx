import React, { useState } from "react";
import { Gavel, TrendingUp, TrendingDown, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import type { ActiveBid } from "../../context/BidContext";
import type { Route } from "../../types";

interface BidCardProps {
    latestBid: ActiveBid | null;
    totalActiveBids: number;
    onNavigate: (route: Route, itemId?: string) => void;
}

function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatTimeLeft(endsAt: string): string {
    const diff = new Date(endsAt).getTime() - Date.now();
    if (diff <= 0) return "Encerrado";
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

export const BidCard: React.FC<BidCardProps> = ({ latestBid, totalActiveBids, onNavigate }) => {
    const [expanded, setExpanded] = useState(false);

    if (!latestBid) return null;

    const isWinning = latestBid.isWinning;

    return (
        <div className="relative">
            {/* Main pill button */}
            <button
                onClick={() => setExpanded((v) => !v)}
                className={`
                    flex items-center gap-2 border rounded-full pl-3 pr-2 py-1.5 cursor-pointer transition-all duration-300
                    ${isWinning
                        ? "border-emerald-500 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 group-winning"
                        : "border-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700"
                    }
                    group
                `}
                aria-label="Meus lances ativos"
            >
                <Gavel className="w-3 h-3 shrink-0" />
                <span className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">
                    Lance &middot; R$ {formatCurrency(latestBid.amount)}
                </span>
                <span className={`
                    flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-colors
                    ${isWinning
                        ? "bg-emerald-500 text-white group-hover:bg-white group-hover:text-emerald-600"
                        : "bg-amber-500 text-white group-hover:bg-white group-hover:text-amber-600"
                    }
                `}>
                    {totalActiveBids}
                </span>
                {expanded
                    ? <ChevronUp className="w-3 h-3 ml-0.5" />
                    : <ChevronDown className="w-3 h-3 ml-0.5" />
                }
            </button>

            {/* Dropdown card */}
            {expanded && (
                <div
                    className="absolute right-0 top-full mt-2 w-72 bg-white border border-border-main rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in"
                    style={{ animation: "bidCardIn 0.2s ease-out" }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border-main bg-card-bg flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-sec">
                            Meus Lances Ativos
                        </span>
                        <span className="text-[10px] font-bold text-gray-sec">
                            {totalActiveBids} leilão{totalActiveBids !== 1 ? "es" : ""}
                        </span>
                    </div>

                    {/* Latest bid highlight */}
                    <div className="px-4 py-4">
                        <div className={`
                            rounded-lg p-3 mb-1
                            ${isWinning ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}
                        `}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-bold tracking-widest uppercase text-gray-sec">
                                        {latestBid.vehicleBrand}
                                    </p>
                                    <p className="text-sm font-black text-black-main font-display uppercase leading-tight truncate">
                                        {latestBid.vehicleModel}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    {isWinning
                                        ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                        : <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                                    }
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isWinning ? "text-emerald-600" : "text-amber-600"}`}>
                                        {isWinning ? "Vencendo" : "Superado"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[9px] text-gray-sec uppercase tracking-wider font-semibold">Seu lance</p>
                                    <p className="text-lg font-black text-black-main font-display">
                                        R$ {formatCurrency(latestBid.amount)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-gray-sec uppercase tracking-wider font-semibold">Lance atual</p>
                                    <p className={`text-sm font-bold ${latestBid.currentPrice > latestBid.amount ? "text-amber-600" : "text-emerald-600"}`}>
                                        R$ {formatCurrency(latestBid.currentPrice || latestBid.amount)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
                                <span className="text-[9px] font-semibold text-gray-sec">
                                    Encerra em: <span className="text-black-main">{formatTimeLeft(latestBid.endsAt)}</span>
                                </span>
                                <button
                                    onClick={() => {
                                        setExpanded(false);
                                        const slug = `${latestBid.vehicleBrand}-${latestBid.vehicleModel}-${latestBid.auctionId}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                        onNavigate("auction-detail", slug);
                                    }}
                                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-black-main hover:opacity-60 transition-opacity cursor-pointer"
                                >
                                    Ver leilão <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        </div>

                        {totalActiveBids > 1 && (
                            <p className="text-[9px] text-gray-sec text-center mt-2">
                                + {totalActiveBids - 1} outro{totalActiveBids - 1 !== 1 ? "s" : ""} leilão{totalActiveBids - 1 !== 1 ? "es" : ""} ativo{totalActiveBids - 1 !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-3">
                        <button
                            onClick={() => {
                                setExpanded(false);
                                onNavigate("auctions");
                            }}
                            className="w-full text-center text-[10px] font-bold tracking-widest uppercase text-gray-sec hover:text-black-main transition-colors cursor-pointer py-1"
                        >
                            Ver todos os leilões
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close */}
            {expanded && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setExpanded(false)}
                />
            )}

            <style>{`
                @keyframes bidCardIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)  scale(1); }
                }
            `}</style>
        </div>
    );
};

export default BidCard;
