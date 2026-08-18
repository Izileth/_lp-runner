import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import gsap from "gsap";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

// Global state to manage toasts simply without a full Context provider for now
let addToastFn: (toast: Omit<ToastMessage, "id">) => void = () => {};

export const toast = {
    success: (message: string) => addToastFn({ type: "success", message }),
    error: (message: string) => addToastFn({ type: "error", message }),
    info: (message: string) => addToastFn({ type: "info", message })
};

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        addToastFn = (toast) => {
            const id = Math.random().toString(36).substring(2, 9);
            setToasts((prev) => [...prev, { ...toast, id }]);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                removeToast(id);
            }, 5000);
        };
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
    const elRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (elRef.current) {
            gsap.fromTo(
                elRef.current,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
            );
        }
    }, []);

    const bgColor = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
        error: "bg-red-50 border-red-200 text-red-800",
        info: "bg-blue-50 border-blue-200 text-blue-800"
    }[toast.type];

    const Icon = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info
    }[toast.type];

    return (
        <div
            ref={elRef}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColor}`}
            role="alert"
        >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={onRemove} className="ml-auto text-gray-500 hover:text-black">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
