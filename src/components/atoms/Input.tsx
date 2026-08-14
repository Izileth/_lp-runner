import React from "react";

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => {
    return (
        <input
            className={`px-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main placeholder-gray-sec/50 outline-none focus:border-black-main transition-colors ${className}`}
            {...props}
        />
    );
};

export default Input;
