import { useEffect, useState } from "react";

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

    useEffect(() => {
        if (document.getElementById(WORDMARK_FONT_ID)) return;
        const link = document.createElement("link");
        link.id = WORDMARK_FONT_ID;
        link.rel = "stylesheet";
        link.href = WORDMARK_FONT_HREF;
        document.head.appendChild(link);
    }, []);

    return (
        <section className="relative w-full min-h-screen bg-ivory text-black-main overflow-hidden">
            {/* ---------- NAVBAR ---------- */}
            <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-14 py-6 sm:py-8">
                {/* Logo */}
                <button
                    onClick={() => onNavigate?.("home")}
                    className="flex items-center gap-[1px] text-lg sm:text-xl font-extrabold tracking-tight text-black-main select-none cursor-pointer"
                    aria-label="Runner home"
                >
                    <span className="inline-block scale-x-[-1]">R</span>
                    <span>unner</span>
                </button>

                {/* Nav links - hidden on small screens */}
                <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase text-black-main">
                    <button onClick={() => onNavigate?.("product")} className="hover:opacity-60 transition-opacity cursor-pointer">
                        Shop
                    </button>
                    <span className="text-border-main">/</span>
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
                    <span className="hidden sm:inline text-[11px] font-semibold tracking-widest uppercase text-black-main">
                        Account
                    </span>
                    <div className="flex items-center gap-2 border border-border-main rounded-full pl-4 pr-1.5 py-1.5 bg-card-bg">
                        <span className="text-[11px] font-semibold tracking-widest uppercase text-black-main whitespace-nowrap">
                            Bag &middot; $930
                        </span>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black-main text-white text-[10px] font-bold">
                            1
                        </span>
                    </div>
                </div>
            </header>

            {/* ---------- WORDMARK + PRODUCT IMAGE ---------- */}
            <div className="relative flex items-center justify-center px-4 min-h-[280px] sm:min-h-[380px] lg:min-h-[460px]">
                {/* Decorative floating pills (matching shoe material/color: cream/off-white) */}
                <span className="pointer-events-none absolute left-[8%] top-[18%] w-10 h-6 sm:w-14 sm:h-8 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[-20deg] blur-[0.5px]" />
                <span className="pointer-events-none absolute left-[20%] top-[8%] w-7 h-4 sm:w-10 sm:h-6 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[15deg] blur-[1px]" />
                <span className="pointer-events-none absolute right-[10%] top-[12%] w-10 h-6 sm:w-14 sm:h-8 rounded-full bg-card-bg border border-border-main opacity-85 rotate-[25deg] blur-[0.5px]" />
                <span className="pointer-events-none absolute right-[22%] bottom-[15%] w-8 h-5 sm:w-11 sm:h-7 rounded-full bg-card-bg border border-border-main opacity-70 rotate-[-10deg] blur-[1px]" />

                {/* Wordmark */}
                <h1
                    className="select-none text-[20vw] sm:text-[16vw] lg:text-[11vw] leading-[0.8] text-black-main whitespace-nowrap"
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
                        <svg
                            viewBox="0 0 24 24"
                            className="w-9 h-9 lg:w-10 lg:h-10 fill-black-main"
                            aria-label="Adidas"
                        >
                            <path d="M8.5 2 4 13.2h3l1.2-3h6.4L19 2h-3.2l-2.8 7-2.4-7H8.5zM2 15l-2 5h3l1-2.5h6.6L9 20h3l2-5H2zm14 0-2 5h3l2-5h-3z" />
                        </svg>
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
                        <div className="flex items-center justify-between gap-4 border border-border-main rounded-md px-4 py-3 sm:min-w-[200px] bg-card-bg">
                            <div>
                                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-sec mb-0.5">
                                    Size
                                </p>
                                <p className="text-sm font-semibold text-black-main whitespace-nowrap">
                                    {size} UK Selected
                                </p>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={increaseSize}
                                    aria-label="Aumentar tamanho"
                                    className="flex items-center justify-center w-6 h-6 rounded-full bg-black-main text-white text-xs leading-none hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                    +
                                </button>
                                <button
                                    type="button"
                                    onClick={decreaseSize}
                                    aria-label="Diminuir tamanho"
                                    className="flex items-center justify-center w-6 h-6 rounded-full border border-border-main text-black-main text-xs leading-none hover:bg-ivory transition-colors cursor-pointer"
                                >
                                    &minus;
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col justify-center border border-border-main rounded-md px-4 py-3 sm:min-w-[110px] bg-card-bg">
                            <p className="text-[9px] font-bold tracking-widest uppercase text-gray-sec mb-0.5">
                                Price
                            </p>
                            <p className="text-sm font-semibold text-black-main">$1595</p>
                        </div>

                        {/* CTA */}
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-md bg-black-main text-white text-xs sm:text-sm font-bold tracking-widest uppercase px-8 py-3 hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            Add to Bag
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
