import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Route } from "../types";

interface CreateAuctionProps {
    onNavigate: (route: Route) => void;
}

export const CreateAuction: React.FC<CreateAuctionProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form Vehicle fields
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [yearManufacture, setYearManufacture] = useState(new Date().getFullYear());
    const [yearModel, setYearModel] = useState(new Date().getFullYear());
    const [mileage, setMileage] = useState(0);
    const [color, setColor] = useState("");
    const [condition, setCondition] = useState<"novo" | "semi_novo" | "usado" | "colecionador">("usado");
    const [description, setDescription] = useState("");
    const [startingPrice, setStartingPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Form Auction fields
    const [startsAt, setStartsAt] = useState("");
    const [endsAt, setEndsAt] = useState("");
    const [minIncrement, setMinIncrement] = useState("500");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError("Você precisa estar autenticado para criar um leilão.");
            return;
        }

        if (!brand || !model || !startingPrice || !startsAt || !endsAt) {
            setError("Preencha todos os campos obrigatórios.");
            return;
        }

        const start = new Date(startsAt);
        const end = new Date(endsAt);

        if (end <= start) {
            setError("A data de término deve ser posterior à data de início.");
            return;
        }

        try {
            setLoading(true);

            // 1. Inserir Veículo
            const { data: vehicleData, error: vehicleError } = await supabase
                .from("vehicles")
                .insert({
                    seller_id: user.id,
                    brand,
                    model,
                    year_manufacture: Number(yearManufacture),
                    year_model: Number(yearModel),
                    mileage: Number(mileage),
                    color,
                    condition,
                    description,
                    starting_price: Number(startingPrice),
                    status: "em_leilao"
                })
                .select()
                .single();

            if (vehicleError) throw vehicleError;

            // 2. Inserir Imagem (se informada)
            if (imageUrl.trim()) {
                await supabase.from("vehicle_images").insert({
                    vehicle_id: vehicleData.id,
                    url: imageUrl.trim(),
                    is_cover: true,
                    position: 0
                });
            }

            // 3. Criar Leilão
            const { error: auctionError } = await supabase
                .from("auctions")
                .insert({
                    vehicle_id: vehicleData.id,
                    status: start > new Date() ? "agendado" : "ativo",
                    starts_at: start.toISOString(),
                    ends_at: end.toISOString(),
                    min_increment: Number(minIncrement),
                    current_price: Number(startingPrice)
                });

            if (auctionError) throw auctionError;

            onNavigate("auctions");
        } catch (err: any) {
            console.error("Erro ao criar leilão:", err);
            setError(err.message || "Ocorreu um erro ao cadastrar o leilão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
            <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white">Criar Novo Leilão</h1>
                        <p className="text-neutral-400 text-sm mt-1">Cadastre seu veículo e defina as regras do leilão.</p>
                    </div>
                    <button
                        onClick={() => onNavigate("auctions")}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    >
                        Voltar
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Seção Veículo */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-amber-500 uppercase tracking-wider text-xs">1. Informações do Veículo</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Marca *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Porsche, BMW, Ford"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Modelo *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: 911 Carrera S, M3 Competition"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Ano Fabr.</label>
                                <input
                                    type="number"
                                    value={yearManufacture}
                                    onChange={(e) => setYearManufacture(Number(e.target.value))}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Ano Mod.</label>
                                <input
                                    type="number"
                                    value={yearModel}
                                    onChange={(e) => setYearModel(Number(e.target.value))}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">KM</label>
                                <input
                                    type="number"
                                    value={mileage}
                                    onChange={(e) => setMileage(Number(e.target.value))}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Cor</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Preto"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Condição</label>
                                <select
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value as any)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                >
                                    <option value="usado">Usado</option>
                                    <option value="semi_novo">Semi-Novo</option>
                                    <option value="novo">Novo</option>
                                    <option value="colecionador">Colecionador</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">URL da Imagem de Capa</label>
                            <input
                                type="url"
                                placeholder="https://exemplo.com/imagem.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-400 mb-1">Descrição</label>
                            <textarea
                                rows={3}
                                placeholder="Detalhes do veículo, opcionais, estado de conservação..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Seção Leilão */}
                    <div className="space-y-4 pt-6 border-t border-neutral-800">
                        <h2 className="text-lg font-bold text-amber-500 uppercase tracking-wider text-xs">2. Regras do Leilão</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Lance Inicial (R$) *</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="Ex: 150000"
                                    value={startingPrice}
                                    onChange={(e) => setStartingPrice(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Incremento Mínimo (R$)</label>
                                <input
                                    type="number"
                                    value={minIncrement}
                                    onChange={(e) => setMinIncrement(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Início do Leilão *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={startsAt}
                                    onChange={(e) => setStartsAt(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 mb-1">Término do Leilão *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={endsAt}
                                    onChange={(e) => setEndsAt(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase tracking-wider text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                        {loading ? "Cadastrando Leilão..." : "Publicar Leilão"}
                    </button>
                </form>
            </div>
        </div>
    );
};
