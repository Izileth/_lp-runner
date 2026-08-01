import React, { useEffect, useState } from "react";
import type { Auction } from "../../types";

interface VehicleCardProps {
    auction: Auction;
    onSelect?: (auctionId: string) => void;
    onFavoriteToggle?: (vehicleId: string) => void;
    isFavorite?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
    auction,
    onSelect,
    onFavoriteToggle,
    isFavorite = false,
}) => {
    const { vehicle, status, starts_at, ends_at, current_price } = auction;
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isLive, setIsLive] = useState<boolean>(status === "ativo");

    // Cálculo do contador regressivo
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const targetTime = status === "agendado" ? new Date(starts_at).getTime() : new Date(ends_at).getTime();
            const diff = targetTime - now;

            if (diff <= 0) {
                if (status === "ativo") setTimeLeft("Leilão Encerrado");
                else if (status === "agendado") setTimeLeft("Em breve");
                else setTimeLeft("Finalizado");
                setIsLive(false);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [starts_at, ends_at, status]);

    const coverImage = vehicle?.images?.find((img) => img.is_cover)?.url ||
        vehicle?.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80";

    const displayPrice = current_price || vehicle?.starting_price || 0;

    return (
        <div 
            onClick={() => onSelect && onSelect(auction.id)}
            className="group relative bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
            {/* Header / Imagem */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                <img
                    src={coverImage}
                    alt={`${vehicle?.brand} ${vehicle?.model}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlays / Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    {status === "ativo" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-black backdrop-blur-md animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-black"></span>
                            AO VIVO
                        </span>
                    )}
                    {status === "agendado" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-black backdrop-blur-md">
                            EM BREVE
                        </span>
                    )}
                    {status === "encerrado" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-700 text-neutral-300 backdrop-blur-md">
                            ENCERRADO
                        </span>
                    )}
                </div>

                {/* Botão de Favorito */}
                {onFavoriteToggle && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (vehicle) onFavoriteToggle(vehicle.id);
                        }}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
                        title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                    >
                        <svg
                            className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"}`}
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                )}

                {/* Timer Badge (Footer da imagem) */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-neutral-200">
                    <span className="font-medium text-neutral-400">Tempo restante:</span>
                    <span className={`font-mono font-bold ${isLive ? "text-emerald-400" : "text-neutral-300"}`}>
                        {timeLeft}
                    </span>
                </div>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                        <span className="font-semibold uppercase tracking-wider text-amber-500">{vehicle?.brand}</span>
                        <span>{vehicle?.year_manufacture}{vehicle?.year_model ? `/${vehicle.year_model}` : ''}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors line-clamp-1">
                        {vehicle?.model}
                    </h3>

                    <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                        {vehicle?.mileage ? `${vehicle.mileage.toLocaleString('pt-BR')} km` : '0 km'} • {vehicle?.color || 'Cor N/I'} • {vehicle?.condition?.toUpperCase()}
                    </p>
                </div>

                {/* Preços e Ação */}
                <div className="pt-3 border-t border-neutral-800 flex items-end justify-between">
                    <div>
                        <span className="block text-[10px] uppercase font-medium text-neutral-400">
                            {current_price ? "Lance Atual" : "Lance Inicial"}
                        </span>
                        <div className="text-xl font-black text-emerald-400 font-mono">
                            R$ {displayPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <button 
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-lg shadow-amber-500/10"
                    >
                        Dar Lance
                    </button>
                </div>
            </div>
        </div>
    );
};
