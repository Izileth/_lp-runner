import { useEffect } from "react";
import gsap from "gsap";

/**
 * Custom hook to animate floating decorative elements (floating-pill)
 * using GSAP.
 */
export function useFloatingPills(containerRef: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(".floating-pill", {
                y: "random(-12, 12)",
                x: "random(-8, 8)",
                rotation: "random(-12, 12)",
                duration: "random(4, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, containerRef);

        return () => ctx.revert();
    }, [containerRef]);
}
