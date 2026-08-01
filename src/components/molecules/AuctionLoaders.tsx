import React from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export const AuctionSkeletonLoader: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card-bg border border-border-main rounded-2xl overflow-hidden flex flex-col justify-between h-[380px]">
                    <div className="bg-gray-200 aspect-[16/10] w-full relative">
                        <div className="absolute top-3 left-3 w-20 h-5 bg-gray-300 rounded-full" />
                        <div className="absolute bottom-3 left-3 right-3 h-7 bg-gray-300 rounded-lg" />
                    </div>
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="w-16 h-3 bg-gray-200 rounded" />
                            <div className="w-3/4 h-6 bg-gray-200 rounded" />
                            <div className="w-1/2 h-3 bg-gray-200 rounded" />
                        </div>
                        <div className="pt-3 border-t border-border-main flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="w-12 h-2.5 bg-gray-200 rounded" />
                                <div className="w-24 h-6 bg-gray-200 rounded" />
                            </div>
                            <div className="w-24 h-9 bg-gray-200 rounded-lg" />
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
            <div className="flex items-center justify-between border-b border-border-main pb-6">
                <div className="space-y-2">
                    <div className="w-20 h-3 bg-gray-200 rounded" />
                    <div className="w-48 h-8 bg-gray-200 rounded" />
                </div>
                <div className="w-20 h-9 bg-gray-200 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-[16/9] w-full rounded-2xl bg-card-bg border border-border-main" />
                    <div className="bg-card-bg border border-border-main rounded-2xl p-6 space-y-4">
                        <div className="w-40 h-6 bg-gray-200 rounded" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="space-y-2">
                                    <div className="w-12 h-3 bg-gray-200 rounded" />
                                    <div className="w-20 h-5 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card-bg border border-border-main rounded-2xl p-6 space-y-6">
                        <div className="space-y-2">
                            <div className="w-20 h-3 bg-gray-200 rounded" />
                            <div className="w-40 h-10 bg-gray-200 rounded" />
                        </div>
                        <div className="w-full h-12 bg-gray-200 rounded-xl" />
                        <div className="w-full h-12 bg-gray-200 rounded-xl" />
                    </div>

                    <div className="bg-card-bg border border-border-main rounded-2xl p-6 space-y-4">
                        <div className="w-32 h-5 bg-gray-200 rounded" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="w-full h-12 bg-gray-100 rounded-xl border border-border-main" />
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
        <div className="min-h-[350px] w-full flex flex-col items-center justify-center p-8 bg-card-bg border border-border-main rounded-3xl text-center space-y-6 my-8">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
                <h3 className="text-xl font-bold text-black-main tracking-tight">{title}</h3>
                <p className="text-sm text-gray-sec leading-relaxed">{message}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-black-main hover:bg-gray-900 text-white transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Tentar Novamente
                    </button>
                )}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-white border border-border-main hover:bg-gray-50 text-black-main transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                    </button>
                )}
            </div>
        </div>
    );
};
