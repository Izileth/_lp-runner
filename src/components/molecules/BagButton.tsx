import React from "react";

interface BagButtonProps {
    totalPrice: number;
    itemsCount: number;
    onClick: () => void;
}

export const BagButton: React.FC<BagButtonProps> = ({ totalPrice, itemsCount, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 border border-border-main rounded-full pl-4 pr-1.5 py-1.5 cursor-pointer bg-card-bg hover:bg-black-main hover:text-white transition-all duration-300 group"
        >
            <span className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">
                Bag &middot; ${totalPrice}
            </span>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black-main text-white text-[10px] font-bold group-hover:bg-white group-hover:text-black-main transition-colors">
                {itemsCount}
            </span>
        </button>
    );
};

export default BagButton;
