import type { FinProduct } from "../types";

export const FINS_DATA: FinProduct[] = [
    {
        id: "apex-thruster",
        name: "Apex Thruster",
        subtitle: "High-Speed Carving & Release",
        price: 185,
        description:
            "Engineered from solid high-density pre-preg carbon fiber. The Apex Thruster set offers unmatched rigidity, explosive response off the lip, and smooth release through hard turns.",
        specs: {
            material: "100% Pre-Preg Carbon Fiber",
            base: "4.55 inches",
            depth: "4.62 inches",
            foil: "Flat (Center: 50/50)",
            configuration: "Thruster (3 Fin Set)",
        },
    },
    {
        id: "stealth-keel",
        name: "Stealth Keel",
        subtitle: "Retro Drive & Modern Control",
        price: 145,
        description:
            "Optimized for modern twin-fins and retro fish designs. Provides ultimate drive, stability at speed, and locked-in control through long, sweeping cutbacks.",
        specs: {
            material: "Carbon-Kevlar Composite",
            base: "6.25 inches",
            depth: "4.85 inches",
            foil: "Flat / Single Bevel",
            configuration: "Twin (2 Fin Set)",
        },
    },
    {
        id: "vortex-twin",
        name: "Vortex Twin+1",
        subtitle: "Pivot & Pivot-plus-Release",
        price: 160,
        description:
            "Featuring a high-aspect ratio template that allows fast pivots in tight pockets. The optional trailer fin adds stability without compromising freedom.",
        specs: {
            material: "Recycled Carbon Composite",
            base: "4.80 inches",
            depth: "5.10 inches",
            foil: "80/20 Asymmetric",
            configuration: "Twin + Trailer (3 Fins)",
        },
    },
];
