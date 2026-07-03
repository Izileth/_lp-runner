

import { useEffect, useState } from "react";

/**
 * HeroYeezy
 * ---------
 * Seção hero estilo "product drop", fiel ao layout de referência:
 * navbar + wordmark gigante + card de produto flutuante.
 *
 * A imagem principal (tênis) é passada via prop `productImageUrl`.
 * Enquanto não for definida, um placeholder tracejado ocupa o lugar
 * exato onde a imagem entrará, mantendo a composição correta.
 *
 * FONTE DO LETREIRO: o wordmark "YEEZY" usa Archivo Black, que dá o
 * peso condensado/geométrico da referência. O componente injeta o
 * Google Font automaticamente via useEffect — não é preciso nenhuma
 * configuração extra. Se preferir carregar a fonte globalmente (ex.:
 * no <head> do seu app ou via next/font), remova o useEffect abaixo
 * e garanta que "Archivo Black" esteja disponível no projeto.
 */

const WORDMARK_FONT_ID = "hero-yeezy-archivo-black-font";
const WORDMARK_FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap";

interface HeroYeezyProps {
    /** URL da imagem do produto (tênis). Se ausente, mostra um placeholder. */
    productImageUrl?: string;
    /** Nome curto do produto para o alt da imagem */
    productName?: string;
    /** Callback para navegação */
    onNavigate?: (route: string) => void;
}

export default function HeroYeezy({
    productImageUrl,
    productName = "Foam RNNR Ararat",
    onNavigate,
}: HeroYeezyProps) {
    const [size, setSize] = useState(3.5);

    const decreaseSize = () => setSize((s) => Math.max(3.5, s - 0.5));
    const increaseSize = () => setSize((s) => Math.min(13, s + 0.5));

    // Injeta a fonte "Archivo Black" (Google Fonts) uma única vez,
    // usada no letreiro "YEEZY" para reproduzir o peso condensado da referência.
    useEffect(() => {
        if (document.getElementById(WORDMARK_FONT_ID)) return;
        const link = document.createElement("link");
        link.id = WORDMARK_FONT_ID;
        link.rel = "stylesheet";
        link.href = WORDMARK_FONT_HREF;
        document.head.appendChild(link);
    }, []);

    return (
        <section className="relative w-full bg-[#F1EEE6] overflow-hidden">
            {/* ---------- NAVBAR ---------- */}
            <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-14 py-6 sm:py-8">
                {/* Logo */}
                <button
                    onClick={() => onNavigate?.("home")}
                    className="flex items-center gap-[1px] text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 select-none cursor-pointer"
                    aria-label="Runner home"
                >
                    <span className="inline-block scale-x-[-1]">R</span>
                    <span>unner</span>
                </button>

                {/* Nav links - hidden on small screens */}
                <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase text-neutral-900">
                    <button onClick={() => onNavigate?.("product")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Shop
                    </button>
                    <span className="text-neutral-400">/</span>
                    <button onClick={() => onNavigate?.("fins")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Fins
                    </button>
                    <button onClick={() => onNavigate?.("about")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        About
                    </button>
                    <a href="#" className="hover:opacity-60 transition-opacity">
                        Contact
                    </a>
                </nav>

                {/* Account / Bag */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <span className="hidden sm:inline text-[11px] font-semibold tracking-widest uppercase text-neutral-900">
                        Account
                    </span>
                    <div className="flex items-center gap-2 border border-neutral-900/80 rounded-full pl-4 pr-1.5 py-1.5">
                        <span className="text-[11px] font-semibold tracking-widest uppercase text-neutral-900 whitespace-nowrap">
                            Bag &middot; $930
                        </span>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold">
                            1
                        </span>
                    </div>
                </div>
            </header>

            {/* ---------- WORDMARK + PRODUCT IMAGE ---------- */}
            <div className="relative flex items-center justify-center px-4 min-h-[280px] sm:min-h-[380px] lg:min-h-[460px]">
                {/* Decorative floating pills */}
                <span className="pointer-events-none absolute left-[8%] top-[18%] w-10 h-6 sm:w-14 sm:h-8 rounded-full bg-neutral-300/70 rotate-[-20deg]" />
                <span className="pointer-events-none absolute left-[20%] top-[8%] w-7 h-4 sm:w-10 sm:h-6 rounded-full bg-neutral-300/60 rotate-[15deg]" />
                <span className="pointer-events-none absolute right-[10%] top-[12%] w-10 h-6 sm:w-14 sm:h-8 rounded-full bg-neutral-300/70 rotate-[25deg]" />
                <span className="pointer-events-none absolute right-[22%] bottom-[15%] w-8 h-5 sm:w-11 sm:h-7 rounded-full bg-neutral-300/60 rotate-[-10deg]" />

                {/* Wordmark */}
                <h1
                    className="select-none text-[20vw] sm:text-[16vw] lg:text-[11vw] leading-[0.8] text-neutral-900 whitespace-nowrap"
                    style={{
                        fontFamily: "'Archivo Black', sans-serif",
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
                            className="w-full h-full object-contain drop-shadow-xl"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-2xl border-2 border-dashed border-neutral-400/70 bg-neutral-100/40 text-neutral-500 text-xs sm:text-sm font-medium text-center px-4">
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
                    <div className="hidden sm:flex w-20 h-20 lg:w-24 lg:h-24 shrink-0 items-center justify-center rounded-md bg-neutral-300/70">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-9 h-9 lg:w-10 lg:h-10 fill-neutral-800"
                            aria-label="Adidas"
                        >
                            <path d="M8.5 2 4 13.2h3l1.2-3h6.4L19 2h-3.2l-2.8 7-2.4-7H8.5zM2 15l-2 5h3l1-2.5h6.6L9 20h3l2-5H2zm14 0-2 5h3l2-5h-3z" />
                        </svg>
                    </div>

                    {/* Title block */}
                    <div className="flex-1 flex flex-col justify-center gap-1">
                        <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-neutral-500">
                            Adidas Yeezy
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-neutral-900 leading-snug max-w-md">
                            {productName} sneakers / Estimated Delivery:{" "}
                            <span className="font-normal text-neutral-500">
                                (Mar 20 &ndash; Mar 26)
                            </span>
                        </p>
                    </div>

                    {/* Size / Price / CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 lg:items-stretch">
                        {/* Size selector */}
                        <div className="flex items-center justify-between gap-4 border border-neutral-300 rounded-md px-4 py-3 sm:min-w-[200px]">
                            <div>
                                <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-0.5">
                                    Size
                                </p>
                                <p className="text-sm font-semibold text-neutral-900 whitespace-nowrap">
                                    {size} UK Selected
                                </p>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={increaseSize}
                                    aria-label="Aumentar tamanho"
                                    className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-900 text-white text-xs leading-none hover:bg-neutral-700 transition-colors"
                                >
                                    +
                                </button>
                                <button
                                    type="button"
                                    onClick={decreaseSize}
                                    aria-label="Diminuir tamanho"
                                    className="flex items-center justify-center w-6 h-6 rounded-full border border-neutral-400 text-neutral-700 text-xs leading-none hover:bg-neutral-200 transition-colors"
                                >
                                    &minus;
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col justify-center border border-neutral-300 rounded-md px-4 py-3 sm:min-w-[110px]">
                            <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-0.5">
                                Price
                            </p>
                            <p className="text-sm font-semibold text-neutral-900">$1595</p>
                        </div>

                        {/* CTA */}
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-md bg-neutral-900 text-white text-xs sm:text-sm font-bold tracking-widest uppercase px-8 py-3 hover:bg-neutral-700 transition-colors"
                        >
                            Add to Bag
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

