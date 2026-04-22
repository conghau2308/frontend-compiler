"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ActionBtnProps {
    icon: React.ReactNode;
    label: string;
    kbd?: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "ghost" | "outline" | "default";
    className?: string;
}

export function ActionBtn({
    icon,
    label,
    kbd,
    onClick,
    disabled,
    variant = "outline",
    className,
}: ActionBtnProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="sm"
                    variant={variant}
                    disabled={disabled}
                    onClick={onClick}
                    className={cn(
                        "h-7 gap-1.5 text-[12px] font-mono tracking-wide px-3 border-zinc-700/60 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
                        className
                    )}
                >
                    {icon}
                    {label}
                </Button>
            </TooltipTrigger>
            {kbd && (
                <TooltipContent
                    side="bottom"
                    className="bg-zinc-800 border-zinc-700 text-zinc-400 text-[11px]"
                >
                    {kbd}
                </TooltipContent>
            )}
        </Tooltip>
    );
}