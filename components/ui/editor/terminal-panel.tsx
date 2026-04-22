"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Terminal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type LogLevel = "success" | "error" | "warning" | "info" | "muted" | "plain";
export type LogLine = { text: string; level: LogLevel; id: number };

export const LOG_COLORS: Record<LogLevel, string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-sky-400",
  muted: "text-zinc-500",
  plain: "text-zinc-300",
};

interface TerminalPanelProps {
  logs: LogLine[];
  height: number;
  onClear: () => void;
}

export function TerminalPanel({ logs, height, onClear }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll khi có log mới
  useEffect(() => {
    terminalRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [logs]);

  return (
    <div
      style={{ height, minHeight: height }}
      className="shrink-0 flex flex-col bg-[#080c10] border-t border-zinc-800/80"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2 text-zinc-500">
          <Terminal size={12} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">Output</span>
          {logs.length > 0 && (
            <span className="text-[9px] text-zinc-700 font-mono">{logs.length} lines</span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-5 text-[10px] text-zinc-600 hover:text-zinc-400 hover:bg-transparent px-2 tracking-wider"
          onClick={onClear}
        >
          CLEAR
        </Button>
      </div>

      {/* Log lines */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono text-[12px] leading-[1.7] select-text cursor-text"
      >
        {logs.map((line) => (
          <div key={line.id} className={cn("flex gap-3", LOG_COLORS[line.level])}>
            <ChevronRight size={10} className="shrink-0 mt-[5px] opacity-40 select-none" />
            <span className="whitespace-pre-wrap break-all">{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}