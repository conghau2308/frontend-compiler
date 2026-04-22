"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseResizeOptions {
    initial: number;
    min: number;
    max: number;
    direction: "horizontal" | "vertical";
    /**
     * Đảo chiều delta — dùng cho panel nằm ở bottom/right.
     * Mặc định: false
     */
    reverse?: boolean;
}

interface UseResizeReturn {
    size: number;
    handleProps: {
        onMouseDown: (e: React.MouseEvent) => void;
        onTouchStart: (e: React.TouchEvent) => void;
    };
    isDragging: boolean;
}

export function useResize({
    initial,
    min,
    max,
    direction,
    reverse = false,
}: UseResizeOptions): UseResizeReturn {
    const [size, setSize] = useState(initial);
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef(0);
    const startSize = useRef(initial);

    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            const raw =
                direction === "horizontal"
                    ? e.clientX - startPos.current
                    : e.clientY - startPos.current;
            const delta = reverse ? -raw : raw;
            setSize(clamp(startSize.current + delta));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [direction, reverse, min, max]
    );

    const onTouchMove = useCallback(
        (e: TouchEvent) => {
            const touch = e.touches[0];
            const raw =
                direction === "horizontal"
                    ? touch.clientX - startPos.current
                    : touch.clientY - startPos.current;
            const delta = reverse ? -raw : raw;
            setSize(clamp(startSize.current + delta));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [direction, reverse, min, max]
    );

    const stopDrag = useCallback(() => {
        setIsDragging(false);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", stopDrag);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", stopDrag);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    }, [onMouseMove, onTouchMove]);

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            startPos.current = direction === "horizontal" ? e.clientX : e.clientY;
            startSize.current = size;
            setIsDragging(true);
            document.body.style.cursor =
                direction === "horizontal" ? "col-resize" : "row-resize";
            document.body.style.userSelect = "none";
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", stopDrag);
        },
        [direction, size, onMouseMove, stopDrag]
    );

    const onTouchStart = useCallback(
        (e: React.TouchEvent) => {
            const touch = e.touches[0];
            startPos.current =
                direction === "horizontal" ? touch.clientX : touch.clientY;
            startSize.current = size;
            setIsDragging(true);
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", stopDrag);
        },
        [direction, size, onTouchMove, stopDrag]
    );

    useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", stopDrag);
        };
    }, [onMouseMove, onTouchMove, stopDrag]);

    return {
        size,
        handleProps: { onMouseDown, onTouchStart },
        isDragging,
    };
}