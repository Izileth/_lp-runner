import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    fullWidth = false,
    className = "",
    children,
    ...props
}) => {
    const baseStyles =
        "px-8 py-4 text-[11px] font-bold tracking-widest uppercase rounded-md transition-all duration-300 active:scale-[0.98] cursor-pointer inline-flex items-center justify-center";
    
    const variants = {
        primary: "bg-black-main text-white border border-black-main hover:opacity-90 hover:scale-[1.02]",
        secondary: "bg-card-bg text-black-main border border-border-main hover:bg-black-main hover:text-white hover:scale-[1.02]",
        outline: "bg-transparent text-black-main border border-border-main hover:bg-card-bg hover:scale-[1.02]",
    };

    const widthStyle = fullWidth ? "w-full" : "w-auto";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
