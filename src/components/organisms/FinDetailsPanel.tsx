import React from "react";
import type { FinProduct } from "../../types";
import TechSpecItem from "../molecules/TechSpecItem";
import Button from "../atoms/Button";

interface FinDetailsPanelProps {
    fin: FinProduct;
    onAddToBag: () => void;
}

export const FinDetailsPanel: React.FC<FinDetailsPanelProps> = ({ fin, onAddToBag }) => {
    return (
        <div className="details-panel lg:col-span-8 bg-card-bg border border-border-main rounded-xl p-8 sm:p-12 flex flex-col justify-between">
            <div className="details-content flex flex-col gap-6">
                <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-sec">
                        Carbon Engineering
                    </span>
                    <h2 className="text-3xl font-extrabold text-black-main mt-1 font-display">
                        {fin.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-sec italic mt-0.5">
                        {fin.subtitle}
                    </p>
                </div>

                <p className="text-sm sm:text-base text-black-main leading-relaxed max-w-2xl">
                    {fin.description}
                </p>

                {/* Tech Specs Grid */}
                <div className="border-t border-border-main pt-6 mt-2">
                    <h4 className="text-[10px] font-bold tracking-widest uppercase text-black-main mb-4">
                        Technical Specifications
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <TechSpecItem label="Material" value={fin.specs.material} />
                        <TechSpecItem label="Base" value={fin.specs.base} />
                        <TechSpecItem label="Depth" value={fin.specs.depth} />
                        <TechSpecItem label="Foil type" value={fin.specs.foil} />
                        <TechSpecItem label="Config" value={fin.specs.configuration} />
                    </div>
                </div>
            </div>

            {/* CTA / Price Panel */}
            <div className="details-content flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border-main pt-8 mt-12">
                <div>
                    <p className="text-[9px] font-bold tracking-widest text-gray-sec uppercase">Price</p>
                    <p className="text-2xl font-extrabold text-black-main">${fin.price} USD</p>
                </div>
                <Button
                    type="button"
                    onClick={onAddToBag}
                    className="w-full sm:w-auto"
                >
                    Add Set to Bag
                </Button>
            </div>
        </div>
    );
};

export default FinDetailsPanel;
