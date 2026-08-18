import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/templates/PageLayout";
import { usePageAnimations } from "../hooks/usePageAnimations";
import Button from "../components/atoms/Button";
import { ImageUpload } from "../components/molecules/ImageUpload";
import type { Route } from "../types";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";

interface EditAuctionProps {
    onNavigate: (route: Route) => void;
}

export const EditAuction: React.FC<EditAuctionProps> = ({ onNavigate }) => {
    const pageRef = useRef<HTMLDivElement>(null);
    usePageAnimations(pageRef);

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { id } = useParams<{ id: string }>();
    const [vehicleId, setVehicleId] = useState<string | null>(null);

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
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    // Form Auction fields
    const [startsAt, setStartsAt] = useState("");
    const [endsAt, setEndsAt] = useState("");
    const [minIncrement, setMinIncrement] = useState("500");

    useEffect(() => {
        if (!id) return;
        const fetchAuction = async () => {
            try {
                const { data, error } = await supabase
                    .from('auctions')
                    .select('*, vehicle:vehicles(*)')
                    .eq('id', id)
                    .single();
                if (error) throw error;
                
                const vehicle = data.vehicle;
                setVehicleId(vehicle.id);
                setBrand(vehicle.brand);
                setModel(vehicle.model);
                setYearManufacture(vehicle.year_manufacture);
                setYearModel(vehicle.year_model);
                setMileage(vehicle.mileage);
                setColor(vehicle.color || "");
                setCondition(vehicle.condition);
                setDescription(vehicle.description || "");
                setStartingPrice(vehicle.starting_price.toString());
                
                setStartsAt(data.starts_at.slice(0, 16));
                setEndsAt(data.ends_at.slice(0, 16));
                setMinIncrement(data.min_increment.toString());
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar os dados do leilão.");
            }
        };
        fetchAuction();
    }, [id]);

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

            if (vehicleId) {
                const { error: vehicleError } = await supabase
                    .from("vehicles")
                    .update({
                        brand,
                        model,
                        year_manufacture: Number(yearManufacture),
                        year_model: Number(yearModel),
                        mileage: Number(mileage),
                        color,
                        condition,
                        description,
                        starting_price: Number(startingPrice)
                    })
                    .eq('id', vehicleId);

                if (vehicleError) throw vehicleError;

                if (imageUrls.length > 0) {
                    const imagesToInsert = imageUrls.map((url) => ({
                        vehicle_id: vehicleId,
                        url: url,
                        is_cover: false,
                        position: 99
                    }));
                    await supabase.from("vehicle_images").insert(imagesToInsert);
                }
            }

            const { error: auctionError } = await supabase
                .from("auctions")
                .update({
                    status: start > new Date() ? "agendado" : "ativo",
                    starts_at: start.toISOString(),
                    ends_at: end.toISOString(),
                    min_increment: Number(minIncrement),
                    current_price: Number(startingPrice)
                })
                .eq('id', id);

            if (auctionError) throw auctionError;

            onNavigate("profile");
        } catch (err: unknown) {
            console.error("Erro ao atualizar leilão:", err);
            setError(err instanceof Error ? err.message : "Ocorreu um erro ao atualizar o leilão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="edit-auction">
            <div ref={pageRef} className="relative flex-1 flex flex-col items-center w-full px-6 py-12">
                <div className="w-full max-w-4xl showcase-card anim-stagger bg-card-bg border border-border-main rounded-2xl p-8 sm:p-12 overflow-hidden shadow-xl transition-all duration-500 hover:border-black-main">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-black-main/5 to-transparent rounded-full blur-2xl pointer-events-none transition-all duration-700"></div>

                    <div className="flex items-center justify-between mb-10 border-b border-border-main pb-8 relative z-10">
                        <div>
                            <h1 className="text-3xl font-display font-black text-black-main uppercase tracking-tight">Editar Leilão</h1>
                            <p className="text-sm text-gray-sec mt-2">Altere os dados do seu veículo e as regras do leilão.</p>
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
                                        type="number"
                                        value={yearManufacture}
                                        onChange={(e) => setYearManufacture(Number(e.target.value))}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">Ano Mod.</label>
                                    <input
                                        type="number"
                                        value={yearModel}
                                        onChange={(e) => setYearModel(Number(e.target.value))}
                                        className="w-full bg-white border border-border-main rounded-xl px-4 py-3 text-black-main text-sm focus:border-black-main focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-gray-sec uppercase mb-2">KM</label>
                                    <input
                                        type="number"
                                        value={mileage}
                                        onChange={(e) => setMileage(Number(e.target.value))}
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
