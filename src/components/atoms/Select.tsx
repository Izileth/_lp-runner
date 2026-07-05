import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[] | string[];
}

export const Select: React.FC<SelectProps> = ({ options, className = "", ...props }) => {
    return (
        <select
            className={`px-4 py-3 bg-ivory border border-border-main rounded-md text-sm text-black-main outline-none focus:border-black-main transition-colors cursor-pointer ${className}`}
            {...props}
        >
            {options.map((opt) => {
                const value = typeof opt === "string" ? opt : opt.value;
                const label = typeof opt === "string" ? opt : opt.label;
                return (
                    <option key={value} value={value}>
                        {label}
                    </option>
                );
            })}
        </select>
    );
};

export default Select;
