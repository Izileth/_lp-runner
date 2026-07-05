import { useEffect } from "react";
import gsap from "gsap";

interface AnimationConfig {
    selector: string;
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
            animations.forEach(({ selector, from, to }) => {
                gsap.fromTo(selector, from, to);
            });
        }, containerRef);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerRef, ...dependencies]);
}
