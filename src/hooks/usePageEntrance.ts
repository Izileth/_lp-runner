import { useEffect } from "react";
import gsap from "gsap";

interface AnimationConfig {
    target: string | React.RefObject<any>;
    from: gsap.TweenVars;
    to: gsap.TweenVars;
}

/**
 * Custom hook to trigger standard page entrance animations via GSAP on mount.
 */
export function usePageEntrance(
    containerRef: React.RefObject<HTMLElement | null>,
    animations: AnimationConfig[],
    dependencies: React.DependencyList = []
) {
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            animations.forEach(({ target, from, to }) => {
                const element = typeof target === "string" ? target : target.current;
                if (element) {
                    gsap.fromTo(element, from, to);
                }
            });
        }, containerRef);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef, ...dependencies]);
}
