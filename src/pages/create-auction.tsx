import React, { useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/templates/PageLayout";
import { usePageAnimations } from "../hooks/usePageAnimations";
import Button from "../components/atoms/Button";
import { ImageUpload } from "../components/molecules/ImageUpload";
import type { Route } from "../types";
import { ArrowLeft } from "lucide-react";

export interface CreateAuctionProps {
    onNavigate: (route: Route) => void;
}

export const CreateAuction: React.FC<CreateAuctionProps> = ({ onNavigate }) => {
    const pageRef = useRef<HTMLDivElement>(null);
    usePageAnimations(pageRef);

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form Vehicle fields
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [yearManufacture, setYearManufacture] = useState(String(new Date().getFullYear()));
    const [yearModel, setYearModel] = useState(String(new Date().getFullYear()));
    const [mileage, setMileage] = useState("0");
    const [color, setColor] = useState("");
    const [condition, setCondition] = useState<"novo" | "semi_novo" | "usado" | "colecionador">("usado");
    const [description, setDescription] = useState("");
    const [startingPrice, setStartingPrice] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);

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

            // 2. Inserir Imagens (se informadas)
            if (imageUrls.length > 0) {
                const imagesToInsert = imageUrls.map((url, idx) => ({
                    vehicle_id: vehicleData.id,
                    url: url,
                    is_cover: idx === 0,
                    position: idx
                }));
                await supabase.from("vehicle_images").insert(imagesToInsert);
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
        } catch (err: unknown) {
            console.error("Erro ao criar leilão:", err);
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao cadastrar o leilão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout 
            onNavigate={onNavigate} 
            currentRoute="create-auction"
            breadcrumbItems={[
                { label: "Início", route: "home" },
                { label: "Leilões", route: "auctions" },
                { label: "Criar Leilão" }
            ]}
        >
            <div ref={pageRef} className="relative flex-1 flex flex-col items-center w-full px-6 py-12">
                <div className="w-full max-w-4xl showcase-card anim-stagger bg-card-bg border border-border-main rounded-2xl p-8 sm:p-12 overflow-hidden shadow-xl transition-all duration-500 hover:border-black-main">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-black-main/5 to-transparent rounded-full blur-2xl pointer-events-none transition-all duration-700"></div>

                    <div className="flex items-center justify-between mb-10 border-b border-border-main pb-8 relative z-10">
                        <div>
                            <h1 className="text-3xl font-display font-black text-black-main uppercase tracking-tight">Criar Novo Leilão</h1>
                            <p className="text-sm text-gray-sec mt-2">Cadastre seu veículo e defina as regras do leilão.</p>
                        </div>
                        <Button
                            onClick={() => onNavigate("auctions")}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </Button>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-medium relative z-10">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        {/* Seção Veículo */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-bold text-black-main uppercase tracking-widest border-b border-border-main pb-2">1. Informações do Veículo</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Marca *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: Porsche, BMW, Ford"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Modelo *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: 911 Carrera S, M3 Competition"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Ano Fabr.</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder={String(new Date().getFullYear())}
                                        value={yearManufacture}
                                        onChange={(e) => setYearManufacture(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Ano Mod.</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder={String(new Date().getFullYear())}
                                        value={yearModel}
                                        onChange={(e) => setYearModel(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">KM</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="0"
                                        value={mileage}
                                        onChange={(e) => setMileage(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Cor</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Preto"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Condição</label>
                                    <select
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value as "novo" | "semi_novo" | "usado" | "colecionador")}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    >
                                        <option value="usado">Usado</option>
                                        <option value="semi_novo">Semi-Novo</option>
                                        <option value="novo">Novo</option>
                                        <option value="colecionador">Colecionador</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Imagens do Veículo</label>
                                <ImageUpload onUploadSuccess={(urls) => setImageUrls(urls)} maxFiles={5} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Descrição</label>
                                <textarea
                                    rows={4}
                                    placeholder="Detalhes do veículo, opcionais, estado de conservação..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors resize-none"
                                />
                            </div>
                        </div>

                        {/* Seção Leilão */}
                        <div className="space-y-6 pt-6 border-t border-border-main">
                            <h2 className="text-sm font-bold text-black-main uppercase tracking-widest border-b border-border-main pb-2">2. Regras do Leilão</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Lance Inicial (R$) *</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Ex: 150000"
                                        value={startingPrice}
                                        onChange={(e) => setStartingPrice(e.target.value)}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm font-mono focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Incremento Mínimo (R$)</label>
                                    <input
                                        type="number"
                                        value={minIncrement}
                                        onChange={(e) => setMinIncrement(e.target.value)}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm font-mono focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Início do Leilão *</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={startsAt}
                                        onChange={(e) => setStartsAt(e.target.value)}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Término do Leilão *</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={endsAt}
                                        onChange={(e) => setEndsAt(e.target.value)}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-center justify-center text-sm"
                            disabled={loading}
                        >
                            {loading ? "Cadastrando Leilão..." : "Publicar Leilão"}
                        </Button>
                    </form>
                </div>
            </div>
        </PageLayout>
    );
};
