import React from "react";

interface FloatingPillProps {
    className?: string;
}

export const FloatingPill: React.FC<FloatingPillProps> = ({ className = "" }) => {
    return (
        <span
            className={`floating-pill pointer-events-none absolute rounded-full bg-card-bg border border-border-main blur-[0.5px] ${className}`}
        />
    );
};

export default FloatingPill;
