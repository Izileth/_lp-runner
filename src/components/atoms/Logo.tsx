import React from "react";

interface LogoProps {
    onClick: () => void;
}

export const Logo: React.FC<LogoProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-[1px] text-lg sm:text-xl font-extrabold tracking-tight text-black-main select-none cursor-pointer"
            aria-label="Runner home"
        >
            <span className="inline-block scale-x-[-1]">R</span>
            <span>unner</span>
        </button>
    );
};

export default Logo;
