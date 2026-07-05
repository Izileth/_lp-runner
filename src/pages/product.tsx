import React, { useState, useRef } from "react";
import type { Route } from "../types";
import { useCart } from "../context/CartContext";
import { useFloatingPills } from "../hooks/useFloatingPills";
import PageLayout from "../components/templates/PageLayout";
import FloatingPill from "../components/atoms/FloatingPill";
import IconAdidas from "../components/atoms/IconAdidas";
import SizeSelector from "../components/organisms/SizeSelector";
import Button from "../components/atoms/Button";

interface HeroYeezyProps {
    /** URL da imagem do produto (tênis). Se ausente, mostra um placeholder. */
    productImageUrl?: string;
    /** Nome curto do produto para o alt da imagem */
    productName?: string;
    /** Callback para navegação */
    onNavigate: (route: Route) => void;
}

export const HeroYeezy: React.FC<HeroYeezyProps> = ({
    productImageUrl,
    productName = "Foam RNNR Ararat",
    onNavigate,
}) => {
    const [size, setSize] = useState(3.5);
    const containerRef = useRef<HTMLElement>(null);
    const { addToBag } = useCart();

    const decreaseSize = () => setSize((s) => Math.max(3.5, s - 0.5));
    const increaseSize = () => setSize((s) => Math.min(13, s + 0.5));

    // Animates the floating elements on this page
    useFloatingPills(containerRef);

    const handleAddToBag = () => {
        addToBag({
            id: "yeezy-foam-rnnr",
            name: productName,
            price: 1595,
            details: `Size: ${size} UK`,
        });
        alert(`Added ${productName} (Size ${size} UK) to bag.`);
    };

    return (
        <PageLayout onNavigate={onNavigate} currentRoute="product" showFooterLinks={true}>
            <section ref={containerRef} className="relative w-full overflow-hidden">
                {/* ---------- WORDMARK + PRODUCT IMAGE ---------- */}
                <div className="relative flex items-center justify-center px-4 min-h-[280px] sm:min-h-[380px] lg:min-h-[460px]">
                    {/* Decorative floating pills */}
                    <FloatingPill className="left-[8%] top-[18%] w-10 h-6 sm:w-14 sm:h-8 rotate-[-20deg]" />
                    <FloatingPill className="left-[20%] top-[8%] w-7 h-4 sm:w-10 sm:h-6 rotate-[15deg] blur-[1px]" />
                    <FloatingPill className="right-[10%] top-[12%] w-10 h-6 sm:w-14 sm:h-8 rotate-[25deg]" />
                    <FloatingPill className="right-[22%] bottom-[15%] w-8 h-5 sm:w-11 sm:h-7 rotate-[-10deg] blur-[1px]" />

                    {/* Wordmark */}
                    <h1
                        className="select-none text-[20vw] sm:text-[16vw] lg:text-[11vw] leading-[0.8] text-black-main whitespace-nowrap font-display"
                        style={{
                            letterSpacing: "-0.03em",
                        }}
                    >
                        YEEZY
                    </h1>

                    {/* Product image, centered on top of the wordmark */}
                    <div className="absolute z-10 w-[62%] sm:w-[46%] lg:w-[34%] aspect-[4/3] flex items-center justify-center">
                        {productImageUrl ? (
                            <img
                                src={productImageUrl}
                                alt={productName}
                                className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.06)]"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center rounded-2xl border-2 border-dashed border-border-main bg-card-bg text-gray-sec text-xs sm:text-sm font-medium text-center px-4">
                                Imagem do produto
                                <br />
                                (adicionar posteriormente)
                            </div>
                        )}
                    </div>
                </div>

                {/* ---------- PRODUCT INFO BAR ---------- */}
                <div className="relative z-20 px-6 sm:px-10 lg:px-14 pb-10 sm:pb-14">
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">
                        {/* Adidas mark */}
                        <div className="hidden sm:flex w-20 h-20 lg:w-24 lg:h-24 shrink-0 items-center justify-center rounded-md bg-card-bg border border-border-main">
                            <IconAdidas />
                        </div>

                        {/* Title block */}
                        <div className="flex-1 flex flex-col justify-center gap-1">
                            <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-gray-sec">
                                Adidas Yeezy
                            </p>
                            <p className="text-sm sm:text-base font-semibold text-black-main leading-snug max-w-md">
                                {productName} sneakers / Estimated Delivery:{" "}
                                <span className="font-normal text-gray-sec">
                                    (Mar 20 &ndash; Mar 26)
                                </span>
                            </p>
                        </div>

                        {/* Size / Price / CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 lg:items-stretch">
                            {/* Size selector */}
                            <SizeSelector
                                currentSize={size}
                                onIncrease={increaseSize}
                                onDecrease={decreaseSize}
                            />

                            {/* Price */}
                            <div className="flex flex-col justify-center border border-border-main rounded-md px-4 py-3 sm:min-w-[110px] bg-card-bg">
                                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-sec mb-0.5">
                                    Price
                                </p>
                                <p className="text-sm font-semibold text-black-main">$1595</p>
                            </div>

                            {/* CTA */}
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleAddToBag}
                                className="px-8 py-3"
                            >
                                Add to Bag
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default HeroYeezy;
