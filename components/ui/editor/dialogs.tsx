"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─── Create File Dialog ────────────────────────────────────────

interface CreateFileDialogProps {
    open: boolean;
    fileName: string;
    onOpenChange: (open: boolean) => void;
    onFileNameChange: (name: string) => void;
    onCreate: () => void;
}

export function CreateFileDialog({
    open,
    fileName,
    onOpenChange,
    onFileNameChange,
    onCreate,
}: CreateFileDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-200 font-mono max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-emerald-400 tracking-wider text-sm">
                        New File
                    </DialogTitle>
                </DialogHeader>
                <div className="py-2">
                    <Input
                        autoFocus
                        className="bg-zinc-800 border-zinc-700 text-zinc-200 font-mono text-sm placeholder-zinc-600 focus-visible:ring-emerald-500/50"
                        placeholder="filename.cs"
                        value={fileName}
                        onChange={(e) => onFileNameChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onCreate();
                            if (e.key === "Escape") onOpenChange(false);
                        }}
                    />
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-500 hover:text-zinc-300 font-mono text-xs"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold font-mono text-xs"
                        onClick={onCreate}
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Unsaved File Dialog ───────────────────────────────────────

interface UnsavedDialogProps {
    fileName: string | null;
    onSaveAndClose: () => void;
    onDiscardAndClose: () => void;
    onCancel: () => void;
}

export function UnsavedDialog({
    fileName,
    onSaveAndClose,
    onDiscardAndClose,
    onCancel,
}: UnsavedDialogProps) {
    return (
        <AlertDialog open={!!fileName} onOpenChange={(o) => !o && onCancel()}>
            <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-zinc-200 font-mono max-w-sm">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-amber-400 text-sm tracking-wider flex items-center gap-2">
                        <span className="text-amber-400">●</span> Unsaved changes
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-500 text-xs leading-relaxed">
                        <code className="text-zinc-300">{fileName}</code> has unsaved changes.
                        <br />Do you want to save before closing?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 flex-row justify-end">
                    <AlertDialogCancel
                        className="bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 font-mono text-xs"
                        onClick={onCancel}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-zinc-700/50 border border-zinc-600 text-zinc-300 hover:bg-zinc-700 font-mono text-xs"
                        onClick={onDiscardAndClose}
                    >
                        Discard
                    </AlertDialogAction>
                    <AlertDialogAction
                        className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 font-mono text-xs"
                        onClick={onSaveAndClose}
                    >
                        Save & Close
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ─── Delete Confirm Dialog ─────────────────────────────────────

interface DeleteFileDialogProps {
    target: string | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DeleteFileDialog({
    target,
    onOpenChange,
    onConfirm,
}: DeleteFileDialogProps) {
    return (
        <AlertDialog open={!!target} onOpenChange={(o) => !o && onOpenChange(false)}>
            <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-zinc-200 font-mono max-w-sm">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-400 text-sm tracking-wider">
                        Delete file?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-500 text-xs">
                        <code className="text-zinc-300">{target}</code> will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 font-mono text-xs">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 font-mono text-xs"
                        onClick={onConfirm}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}