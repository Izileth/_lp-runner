import React from "react";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import Select from "../atoms/Select";

interface FormFieldProps {
    id: string;
    label: string;
    type?: "text" | "email" | "select" | "textarea";
    required?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    options?: { value: string; label: string }[] | string[];
    rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    type = "text",
    required = false,
    placeholder,
    value,
    onChange,
    options = [],
    rows = 4,
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-gray-sec">
                {label}
            </label>
            {type === "textarea" ? (
                <TextArea
                    id={id}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                    rows={rows}
                />
            ) : type === "select" ? (
                <Select
                    id={id}
                    required={required}
                    value={value}
                    onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
                    options={options}
                />
            ) : (
                <Input
                    id={id}
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
                />
            )}
        </div>
    );
};

export default FormField;
