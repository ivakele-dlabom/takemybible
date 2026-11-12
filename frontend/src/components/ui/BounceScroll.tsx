import { useEffect, useRef, type ReactNode } from "react";

export default function BounceScroll({
                                         children,
                                         className = "",
                                     }: {
    children: ReactNode;
    className?: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scroller = scrollRef.current!;
        const inner = innerRef.current!;
        const MAX = 120;
        let offset = 0;
        let startY = 0;
        let timer: number;

        const atTop = () => scroller.scrollTop <= 0;
        const atBottom = () =>
            scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;

        const apply = (y: number, animate: boolean) => {
            inner.style.transition = animate
                ? "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none";
            inner.style.transform = y ? `translateY(${y}px)` : "";
        };

        const release = () => {
            offset = 0;
            apply(0, true);
        };

        // Wheel / trackpad
        const onWheel = (e: WheelEvent) => {
            const top = atTop() && (e.deltaY < 0 || offset > 0);
            const bottom = atBottom() && (e.deltaY > 0 || offset < 0);
            if (!top && !bottom) return;

            e.preventDefault();
            const resistance = 1 - Math.min(Math.abs(offset) / 300, 0.85);
            offset -= e.deltaY * resistance * 0.5;
            offset = top ? Math.min(Math.max(offset, 0), MAX) : Math.max(Math.min(offset, 0), -MAX);

            apply(offset, false);
            clearTimeout(timer);
            timer = window.setTimeout(release, 80);
        };

        // Touch
        const onTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
        };
        const onTouchMove = (e: TouchEvent) => {
            const dy = e.touches[0].clientY - startY;
            if ((atTop() && dy > 0) || (atBottom() && dy < 0)) {
                e.preventDefault();
                offset = Math.max(Math.min(dy * 0.4, MAX), -MAX);
                apply(offset, false);
            }
        };

        scroller.addEventListener("wheel", onWheel, { passive: false });
        scroller.addEventListener("touchstart", onTouchStart, { passive: true });
        scroller.addEventListener("touchmove", onTouchMove, { passive: false });
        scroller.addEventListener("touchend", release);

        return () => {
            clearTimeout(timer);
            scroller.removeEventListener("wheel", onWheel);
            scroller.removeEventListener("touchstart", onTouchStart);
            scroller.removeEventListener("touchmove", onTouchMove);
            scroller.removeEventListener("touchend", release);
        };
    }, []);

    return (
        <div ref={scrollRef} className={`overflow-y-auto overscroll-contain ${className}`}>
            <div ref={innerRef} className="will-change-transform">
                {children}
            </div>
        </div>
    );
}