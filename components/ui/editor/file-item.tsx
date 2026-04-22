"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileItemProps {
    name: string;
    active: boolean;
    dirty: boolean;
    onClick: () => void;
    onDelete: () => void;
}

export function FileItem({ name, active, dirty, onClick, onDelete }: FileItemProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "group flex items-center gap-2 px-3 py-[5px] cursor-pointer text-[12px] transition-colors border-l-2",
                active
                    ? "bg-zinc-800/60 text-zinc-100 border-emerald-400"
                    : "text-zinc-400 border-transparent hover:bg-zinc-800/40 hover:text-zinc-200"
            )}
        >
            <Badge
                variant="outline"
                className="h-4 px-1 text-[9px] font-bold tracking-wider text-emerald-400 border-emerald-800/60 bg-emerald-900/20 rounded-sm shrink-0"
            >
                cs
            </Badge>
            <span className="flex-1 truncate">{name}</span>
            {dirty && <span className="text-amber-400 text-[8px] shrink-0">●</span>}
            {hovered && (
                <button
                    className="shrink-0 text-zinc-600 hover:text-red-400 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    aria-label={`Delete ${name}`}
                >
                    <Trash2 size={11} />
                </button>
            )}
        </div>
    );
}