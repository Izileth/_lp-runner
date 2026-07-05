import React from "react";

interface SizeSelectorProps {
    currentSize: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
    currentSize,
    onIncrease,
    onDecrease,
}) => {
    return (
        <div className="flex items-center justify-between gap-4 border border-border-main rounded-md px-4 py-3 sm:min-w-[200px] bg-card-bg">
            <div>
                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-sec mb-0.5">
                    Size
                </p>
                <p className="text-sm font-semibold text-black-main whitespace-nowrap">
                    {currentSize} UK Selected
                </p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
                <button
                    type="button"
                    onClick={onIncrease}
                    aria-label="Aumentar tamanho"
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-black-main text-white text-xs leading-none hover:opacity-90 transition-opacity cursor-pointer font-bold"
                >
                    +
                </button>
                <button
                    type="button"
                    onClick={onDecrease}
                    aria-label="Diminuir tamanho"
                    className="flex items-center justify-center w-6 h-6 rounded-full border border-border-main text-black-main text-xs leading-none hover:bg-ivory transition-colors cursor-pointer font-bold"
                >
                    &minus;
                </button>
            </div>
        </div>
    );
};

export default SizeSelector;
