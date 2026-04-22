"use client";

import { cn } from "@/lib/utils";

interface ResizeHandleProps {
    direction: "horizontal" | "vertical";
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
}

export function ResizeHandle({
    direction,
    isDragging,
    onMouseDown,
    onTouchStart,
}: ResizeHandleProps) {
    const isH = direction === "horizontal";
    return (
        <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className={cn(
                "shrink-0 relative group flex items-center justify-center transition-colors duration-150 z-10",
                isH
                    ? "w-[5px] cursor-col-resize hover:bg-emerald-500/20"
                    : "h-[5px] cursor-row-resize hover:bg-emerald-500/20",
                isDragging && "bg-emerald-500/30"
            )}
        >
            <div
                className={cn(
                    "flex gap-[2px] opacity-0 group-hover:opacity-100 transition-opacity",
                    isH ? "flex-col" : "flex-row"
                )}
            >
                {[0, 1, 2].map((i) => (
                    <div key={i} className="w-[3px] h-[3px] rounded-full bg-emerald-500/70" />
                ))}
            </div>
        </div>
    );
}