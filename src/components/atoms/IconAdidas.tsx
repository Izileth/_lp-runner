import React from "react";

interface IconAdidasProps {
    className?: string;
}

export const IconAdidas: React.FC<IconAdidasProps> = ({ className = "w-9 h-9 lg:w-10 lg:h-10 fill-black-main" }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-label="Adidas logo"
        >
            <path d="M8.5 2 4 13.2h3l1.2-3h6.4L19 2h-3.2l-2.8 7-2.4-7H8.5zM2 15l-2 5h3l1-2.5h6.6L9 20h3l2-5H2zm14 0-2 5h3l2-5h-3z" />
        </svg>
    );
};

export default IconAdidas;
