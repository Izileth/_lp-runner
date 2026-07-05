export type Route = "home" | "product" | "fins" | "about" | "contact";

export interface FinSpecs {
    material: string;
    base: string;
    depth: string;
    foil: string;
    configuration: string;
}

export interface FinProduct {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    description: string;
    specs: FinSpecs;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    details?: string;
}
