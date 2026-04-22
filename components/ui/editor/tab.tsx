"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabProps {
    name: string;
    active: boolean;
    dirty: boolean;
    onClick: () => void;
    onClose: () => void;
}

export function Tab({ name, active, dirty, onClick, onClose }: TabProps) {
    return (
        <div
            role="tab"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            className={cn(
                "group flex items-center gap-1.5 px-4 py-[8px] text-[12px] cursor-pointer whitespace-nowrap border-r border-zinc-800/60 select-none transition-colors border-b-2",
                active
                    ? "text-zinc-100 bg-[#080c10] border-b-emerald-400"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 border-b-transparent"
            )}
        >
            {dirty && <span className="text-amber-400 text-[8px]">●</span>}
            <span>{name}</span>
            <button
                className="ml-1 text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                aria-label={`Close ${name}`}
            >
                <X size={11} />
            </button>
        </div>
    );
}