import React from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export const AuctionSkeletonLoader: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between h-[380px]">
                    <div className="bg-neutral-800/60 aspect-[16/10] w-full relative">
                        <div className="absolute top-3 left-3 w-20 h-5 bg-neutral-700/50 rounded-full" />
                        <div className="absolute bottom-3 left-3 right-3 h-7 bg-neutral-700/50 rounded-lg" />
                    </div>
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="w-16 h-3 bg-neutral-800 rounded" />
                            <div className="w-3/4 h-6 bg-neutral-800 rounded" />
                            <div className="w-1/2 h-3 bg-neutral-800/60 rounded" />
                        </div>
                        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="w-12 h-2.5 bg-neutral-800/60 rounded" />
                                <div className="w-24 h-6 bg-neutral-800 rounded" />
                            </div>
                            <div className="w-24 h-9 bg-neutral-800 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const AuctionDetailSkeletonLoader: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
                <div className="space-y-2">
                    <div className="w-20 h-3 bg-neutral-800 rounded" />
                    <div className="w-48 h-8 bg-neutral-800 rounded" />
                </div>
                <div className="w-20 h-9 bg-neutral-800 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-[16/9] w-full rounded-2xl bg-neutral-900 border border-neutral-800" />
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                        <div className="w-40 h-6 bg-neutral-800 rounded" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="space-y-2">
                                    <div className="w-12 h-3 bg-neutral-800/60 rounded" />
                                    <div className="w-20 h-5 bg-neutral-800 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                        <div className="space-y-2">
                            <div className="w-20 h-3 bg-neutral-800/60 rounded" />
                            <div className="w-40 h-10 bg-neutral-800 rounded" />
                        </div>
                        <div className="w-full h-12 bg-neutral-800 rounded-xl" />
                        <div className="w-full h-12 bg-neutral-800/80 rounded-xl" />
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                        <div className="w-32 h-5 bg-neutral-800 rounded" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="w-full h-12 bg-neutral-950 rounded-xl border border-neutral-800/50" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface AuctionErrorProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    onBack?: () => void;
}

export const AuctionErrorState: React.FC<AuctionErrorProps> = ({
    title = "Ocorreu um erro ao carregar os dados",
    message = "Não foi possível sincronizar as informações com a rede do leilão. Por favor, tente novamente.",
    onRetry,
    onBack,
}) => {
    return (
        <div className="min-h-[350px] w-full flex flex-col items-center justify-center p-8 bg-neutral-900/60 border border-neutral-800/80 rounded-3xl text-center space-y-6 backdrop-blur-sm my-8">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{message}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-all flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Tentar Novamente
                    </button>
                )}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                    </button>
                )}
            </div>
        </div>
    );
};
