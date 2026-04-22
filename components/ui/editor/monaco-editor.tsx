"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type * as Monaco from "monaco-editor";

// Lazy-load Monaco để tránh SSR issues
const MonacoEditorLib = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center bg-[#080c10]">
            <span className="text-zinc-600 text-xs font-mono animate-pulse">Loading editor…</span>
        </div>
    ),
});

interface MonacoEditorProps {
    value: string;
    language?: string;
    onChange: (value: string) => void;
    onSave?: () => void;
}

export function MonacoEditor({ value, language = "csharp", onChange, onSave }: MonacoEditorProps) {
    const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

    function handleMount(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
        editorRef.current = editor;

        // Gán phím Ctrl+S / Cmd+S để save
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            () => onSave?.()
        );

        // Tắt minimap mặc định & tuỳ chỉnh editor options
        editor.updateOptions({
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 22,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            renderLineHighlight: "line",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 16, bottom: 16 },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            renderLineHighlightOnlyWhenFocus: true,
            lineNumbersMinChars: 4,
        });
    }

    return (
        <div className="absolute inset-0 overflow-hidden">
            <MonacoEditorLib
                height="100%"
                language={language}
                value={value}
                theme="cs-dark"
                onChange={(v) => onChange(v ?? "")}
                onMount={handleMount}
                beforeMount={(monaco) => {
                    // Định nghĩa custom theme khớp với palette của app
                    monaco.editor.defineTheme("cs-dark", {
                        base: "vs-dark",
                        inherit: true,
                        rules: [
                            { token: "comment", foreground: "4b5563", fontStyle: "italic" },
                            { token: "keyword", foreground: "34d399" },        // emerald-400
                            { token: "string", foreground: "6ee7b7" },         // emerald-300
                            { token: "number", foreground: "f59e0b" },         // amber-400
                            { token: "type", foreground: "7dd3fc" },           // sky-300
                            { token: "class", foreground: "93c5fd" },          // blue-300
                            { token: "function", foreground: "c4b5fd" },       // violet-300
                            { token: "variable", foreground: "e4e4e7" },       // zinc-200
                            { token: "operator", foreground: "34d399" },
                            { token: "delimiter", foreground: "71717a" },      // zinc-500
                            { token: "identifier", foreground: "d4d4d8" },
                        ],
                        colors: {
                            "editor.background": "#080c10",
                            "editor.foreground": "#e4e4e7",
                            "editor.lineHighlightBackground": "#0d1117",
                            "editor.lineHighlightBorder": "#1c2128",
                            "editorLineNumber.foreground": "#3f3f46",
                            "editorLineNumber.activeForeground": "#52525b",
                            "editor.selectionBackground": "#34d39930",
                            "editor.selectionHighlightBackground": "#34d39918",
                            "editorCursor.foreground": "#34d399",
                            "editor.inactiveSelectionBackground": "#34d39918",
                            "editorIndentGuide.background1": "#1c2128",
                            "editorIndentGuide.activeBackground1": "#2d3748",
                            "editorBracketMatch.background": "#34d39920",
                            "editorBracketMatch.border": "#34d39960",
                            "editorWhitespace.foreground": "#2d3748",
                            "scrollbar.shadow": "#00000080",
                            "scrollbarSlider.background": "#27272a50",
                            "scrollbarSlider.hoverBackground": "#3f3f4680",
                            "scrollbarSlider.activeBackground": "#52525b80",
                            "editorWidget.background": "#0d1117",
                            "editorWidget.border": "#27272a",
                            "editorSuggestWidget.background": "#0d1117",
                            "editorSuggestWidget.border": "#27272a",
                            "editorSuggestWidget.selectedBackground": "#1c2128",
                            "editorSuggestWidget.highlightForeground": "#34d399",
                            "input.background": "#161b22",
                            "input.border": "#27272a",
                        },
                    });
                }}
                options={{
                    automaticLayout: true,
                    wordWrap: "off",
                }}
            />
        </div>
    );
}