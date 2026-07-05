import React from "react";

interface TechSpecItemProps {
    label: string;
    value: string;
}

export const TechSpecItem: React.FC<TechSpecItemProps> = ({ label, value }) => {
    return (
        <div>
            <p className="text-[9px] font-semibold tracking-wider text-gray-sec uppercase">{label}</p>
            <p className="text-xs sm:text-sm font-semibold text-black-main mt-0.5">{value}</p>
        </div>
    );
};

export default TechSpecItem;
