import React from "react";
import type { FinProduct } from "../../types";

interface FinSelectorButtonProps {
    fin: FinProduct;
    isSelected: boolean;
    onClick: () => void;
}

export const FinSelectorButton: React.FC<FinSelectorButtonProps> = ({
    fin,
    isSelected,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={`fin-selector-btn text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                isSelected
                    ? "bg-black-main border-black-main text-white shadow-xl shadow-black-main/10"
                    : "bg-card-bg border-border-main text-black-main hover:bg-[#eae6db]"
            }`}
        >
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-base font-display">{fin.name}</h3>
                <span
                    className={`text-xs font-semibold ${
                        isSelected ? "text-neutral-400" : "text-gray-sec"
                    }`}
                >
                    ${fin.price}
                </span>
            </div>
            <p
                className={`text-xs mt-1 leading-normal ${
                    isSelected ? "text-neutral-400" : "text-gray-sec"
                }`}
            >
                {fin.subtitle}
            </p>
        </button>
    );
};

export default FinSelectorButton;
