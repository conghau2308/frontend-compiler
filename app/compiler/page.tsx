"use client";

import { useCallback, useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Play, Hammer, Save, FilePlus, Loader2 } from "lucide-react";

import { useResize } from "@/hooks/useResize";
import * as CompilerService from "@/services/compiler.service";
import { LogLevel, LogLine, TerminalPanel } from "@/components/ui/editor/terminal-panel";
import { ActionBtn } from "@/components/ui/editor/action-button";
import { FileItem } from "@/components/ui/editor/file-item";
import { MonacoEditor } from "@/components/ui/editor/monaco-editor";
import { ResizeHandle } from "@/components/ui/editor/resize-handle";
import { CreateFileDialog, DeleteFileDialog, UnsavedDialog } from "@/components/ui/editor/dialogs";
import { Tab } from "@/components/ui/editor/tab";

// ─── Types ────────────────────────────────────────────────────

type FileTab = { name: string; content: string; dirty: boolean };

let logCounter = 0;
const mkLog = (text: string, level: LogLevel = "plain"): LogLine => ({
  text,
  level,
  id: logCounter++,
});

function inferLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    cs: "csharp",
    ts: "typescript",
    tsx: "typescriptreact",
    js: "javascript",
    jsx: "javascriptreact",
    json: "json",
    html: "html",
    css: "css",
    md: "markdown",
    py: "python",
    sh: "shell",
  };
  return map[ext] ?? "plaintext";
}

// ─── Page ─────────────────────────────────────────────────────

export default function CSCompilerPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [tabs, setTabs] = useState<FileTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([
    mkLog("CS Compiler v2.0.0 — ready.", "success"),
    mkLog("Monaco Editor powered. Select a file or create a new one.", "muted"),
  ]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [unsavedTarget, setUnsavedTarget] = useState<string | null>(null);

  const sidebar = useResize({ initial: 220, min: 160, max: 400, direction: "horizontal" });
  const terminal = useResize({ initial: 200, min: 100, max: 480, direction: "vertical", reverse: true });

  const log = useCallback((text: string, level: LogLevel = "plain") => {
    setLogs((prev) => [...prev, mkLog(text, level)]);
  }, []);

  const activeFile = tabs.find((t) => t.name === activeTab) ?? null;

  // ─── File operations ────────────────────────────────────────

  const fetchFiles = useCallback(async () => {
    try {
      const data = await CompilerService.listFiles();
      setFiles(data);
    } catch (e) {
      log(`✗ Cannot load file list: ${(e as Error).message}`, "error");
    }
  }, [log]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const openFile = useCallback(
    async (filename: string) => {
      if (tabs.find((t) => t.name === filename)) {
        setActiveTab(filename);
        return;
      }
      try {
        const content = await CompilerService.readFile(filename);
        setTabs((prev) => [...prev, { name: filename, content, dirty: false }]);
        setActiveTab(filename);
        log(`→ Opened ${filename}`, "info");
      } catch (e) {
        log(`✗ Cannot open ${filename}: ${(e as Error).message}`, "error");
      }
    },
    [tabs, log]
  );

  const forceCloseTab = useCallback(
    (filename: string) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.name !== filename);
        if (activeTab === filename) setActiveTab(next[next.length - 1]?.name ?? null);
        return next;
      });
    },
    [activeTab]
  );

  const closeTab = useCallback(
    (filename: string) => {
      const tab = tabs.find((t) => t.name === filename);
      if (tab?.dirty) {
        setUnsavedTarget(filename);
        return;
      }
      forceCloseTab(filename);
    },
    [tabs, forceCloseTab]
  );

  const handleEditorChange = useCallback(
    (value: string) => {
      setTabs((prev) =>
        prev.map((t) => (t.name === activeTab ? { ...t, content: value, dirty: true } : t))
      );
    },
    [activeTab]
  );

  // ─── Save ────────────────────────────────────────────────────

  const saveFile = useCallback(async (filename?: string) => {
    const target = filename
      ? tabs.find((t) => t.name === filename)
      : activeFile;
    if (!target) return;
    try {
      await CompilerService.editFile(target.name, target.content);
      setTabs((prev) =>
        prev.map((t) => (t.name === target.name ? { ...t, dirty: false } : t))
      );
      log(`✓ Saved ${target.name}`, "success");
    } catch (e) {
      log(`✗ Save failed: ${(e as Error).message}`, "error");
      throw e;
    }
  }, [tabs, activeFile, log]);

  // ─── Unsaved dialog handlers ──────────────────────────────────

  const handleUnsavedSaveAndClose = useCallback(async () => {
    if (!unsavedTarget) return;
    try {
      await saveFile(unsavedTarget);
      forceCloseTab(unsavedTarget);
    } catch {
      // save lỗi → không đóng tab
    } finally {
      setUnsavedTarget(null);
    }
  }, [unsavedTarget, saveFile, forceCloseTab]);

  const handleUnsavedDiscard = useCallback(() => {
    if (!unsavedTarget) return;
    forceCloseTab(unsavedTarget);
    setUnsavedTarget(null);
  }, [unsavedTarget, forceCloseTab]);

  // ─── Core: save → build (trả về true nếu thành công) ─────────

  const saveAndBuild = useCallback(async (filename: string): Promise<boolean> => {
    // 1. Auto-save nếu dirty
    const tab = tabs.find((t) => t.name === filename);
    if (tab?.dirty) {
      log(`💾 Auto-saving ${filename}…`, "muted");
      try {
        await saveFile(filename);
      } catch {
        log("✗ Auto-save failed, aborted.", "error");
        return false;
      }
    }

    // 2. Build
    log(`⚙  Building ${filename}…`, "warning");
    try {
      const output = await CompilerService.buildFile(filename);
      const lines = output.split("\n").filter(Boolean);
      if (lines.length === 0) {
        log("✓ Build successful — no output.", "success");
      } else {
        lines.forEach((l) => log(l, /error|fail/i.test(l) ? "error" : "success"));
      }
      // Nếu output có chứa "error" thì coi như build thất bại
      const hasError = lines.some((l) => /error|fail/i.test(l));
      return !hasError;
    } catch (e) {
      log(`✗ Build error: ${(e as Error).message}`, "error");
      return false;
    }
  }, [tabs, saveFile, log]);

  // ─── Build (chỉ save + build) ────────────────────────────────

  const buildFile = useCallback(async () => {
    if (!activeFile) return;
    setIsBuilding(true);
    try {
      await saveAndBuild(activeFile.name);
    } finally {
      setIsBuilding(false);
    }
  }, [activeFile, saveAndBuild]);

  // ─── Run (save → build → run) ────────────────────────────────

  const runFile = useCallback(async () => {
    if (!activeFile) return;
    setIsRunning(true);

    try {
      // Save + build trước
      const buildOk = await saveAndBuild(activeFile.name);
      if (!buildOk) {
        log("⚠  Build had errors — run aborted.", "warning");
        return;
      }

      // Run
      log("▶  Running…", "info");
      const output = await CompilerService.runFile();
      const lines = output.split("\n").filter(Boolean);
      lines.forEach((l) => log(l));
      if (lines.length === 0) log("(no output)", "muted");
    } catch (e) {
      log(`✗ Run error: ${(e as Error).message}`, "error");
    } finally {
      setIsRunning(false);
    }
  }, [activeFile, saveAndBuild, log]);

  // ─── Create / Delete ─────────────────────────────────────────

  const handleCreateFile = useCallback(async () => {
    const name = newFileName.trim();
    if (!name) return;
    try {
      const created = await CompilerService.createFile(name);
      log(`✓ Created ${created}`, "success");
      setNewFileName("");
      setNewFileOpen(false);
      await fetchFiles();
      openFile(created);
    } catch (e) {
      log(`✗ Create failed: ${(e as Error).message}`, "error");
    }
  }, [newFileName, fetchFiles, openFile, log]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await CompilerService.deleteFile(deleteTarget);
      setFiles((prev) => prev.filter((f) => f !== deleteTarget));
      forceCloseTab(deleteTarget);
      log(`✓ Deleted ${deleteTarget}`, "warning");
    } catch (e) {
      log(`✗ Delete failed: ${(e as Error).message}`, "error");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, forceCloseTab, log]);

  // ─── Render ──────────────────────────────────────────────────

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-screen bg-[#080c10] text-zinc-200 font-mono overflow-hidden select-none">

        {/* Header */}
        <header className="flex items-center justify-between px-4 h-12 border-b border-zinc-800/80 bg-[#0d1117] shrink-0 z-20">
          <div className="flex items-baseline gap-2">
            <span className="text-emerald-400 font-black text-base tracking-[0.2em] uppercase">CS</span>
            <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase">compiler</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ActionBtn icon={<FilePlus size={14} />} label="New File" kbd="N" onClick={() => setNewFileOpen(true)} variant="ghost" />
            <ActionBtn icon={<Save size={14} />} label="Save" kbd="⌘S" onClick={() => saveFile()} disabled={!activeFile} variant="ghost" />
            <Separator orientation="vertical" className="h-5 bg-zinc-800 mx-1" />
            <ActionBtn
              icon={isBuilding ? <Loader2 size={14} className="animate-spin" /> : <Hammer size={14} />}
              label={isBuilding ? "Building…" : "Build"}
              onClick={buildFile}
              disabled={!activeFile || isBuilding || isRunning}
              variant="ghost"
              className="text-amber-400 border-amber-400/20 hover:bg-amber-400/10 hover:text-amber-300"
            />
            <ActionBtn
              icon={isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              label={isRunning ? "Running…" : "Run"}
              onClick={runFile}
              disabled={!activeFile || isRunning || isBuilding}
              className="bg-emerald-500 text-zinc-900 hover:bg-emerald-400 font-bold border-0"
            />
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <aside
            style={{ width: sidebar.size, minWidth: sidebar.size }}
            className="flex flex-col bg-[#0d1117] border-r border-zinc-800/80 overflow-hidden shrink-0"
          >
            <div className="flex items-center justify-between px-3 pt-3 pb-1">
              <span className="text-[10px] tracking-[0.25em] text-zinc-600 uppercase font-semibold">Explorer</span>
            </div>
            <ScrollArea className="flex-1">
              {files.length === 0 ? (
                <p className="text-[11px] text-zinc-600 px-3 py-2 italic">No files yet.</p>
              ) : (
                <div className="py-1">
                  {files.map((f) => (
                    <FileItem
                      key={f}
                      name={f}
                      active={activeTab === f}
                      dirty={tabs.find((t) => t.name === f)?.dirty ?? false}
                      onClick={() => openFile(f)}
                      onDelete={() => setDeleteTarget(f)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </aside>

          <ResizeHandle direction="horizontal" isDragging={sidebar.isDragging} {...sidebar.handleProps} />

          {/* Main */}
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">

            {/* Tab bar */}
            <div className="flex items-center bg-[#0d1117] border-b border-zinc-800/80 overflow-x-auto shrink-0 min-h-[36px]">
              {tabs.length === 0
                ? <span className="text-[11px] text-zinc-600 px-4 italic">No open files</span>
                : tabs.map((t) => (
                  <Tab
                    key={t.name}
                    name={t.name}
                    active={activeTab === t.name}
                    dirty={t.dirty}
                    onClick={() => setActiveTab(t.name)}
                    onClose={() => closeTab(t.name)}
                  />
                ))}
            </div>

            {/* Editor area */}
            <div className="flex-1 overflow-hidden relative">
              {activeFile ? (
                <MonacoEditor
                  value={activeFile.content}
                  language={inferLanguage(activeFile.name)}
                  onChange={handleEditorChange}
                  onSave={() => saveFile()}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none">
                  <span className="text-[64px] font-black text-zinc-800 tracking-[0.15em]">CS</span>
                  <p className="text-zinc-600 text-[13px]">
                    Open a file or{" "}
                    <button className="text-emerald-500 hover:underline" onClick={() => setNewFileOpen(true)}>
                      create a new one
                    </button>
                  </p>
                </div>
              )}
            </div>

            <ResizeHandle direction="vertical" isDragging={terminal.isDragging} {...terminal.handleProps} />

            <TerminalPanel
              logs={logs}
              height={terminal.size}
              onClear={() => setLogs([])}
            />
          </div>
        </div>
      </div>

      <CreateFileDialog
        open={newFileOpen}
        fileName={newFileName}
        onOpenChange={setNewFileOpen}
        onFileNameChange={setNewFileName}
        onCreate={handleCreateFile}
      />
      <DeleteFileDialog
        target={deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <UnsavedDialog
        fileName={unsavedTarget}
        onSaveAndClose={handleUnsavedSaveAndClose}
        onDiscardAndClose={handleUnsavedDiscard}
        onCancel={() => setUnsavedTarget(null)}
      />
    </TooltipProvider>
  );
}