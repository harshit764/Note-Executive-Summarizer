import React, { useRef, useState } from "react";
import { Clipboard, FileText, Trash2, Info } from "lucide-react";

interface TranscriptInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function TranscriptInput({ value, onChange, disabled }: TranscriptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  const handlePaste = async () => {
    setPasteNotice(null);
    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange(text);
          return;
        }
      }
      throw new Error("Clipboard read not supported or permission denied");
    } catch (err) {
      console.warn("Clipboard API read blocked or unpermitted:", err);
      textareaRef.current?.focus();
      setPasteNotice("Direct clipboard access is restricted in iframe preview. Please press Ctrl+V (or Cmd+V) to paste.");
      setTimeout(() => setPasteNotice(null), 5000);
    }
  };

  const handleClear = () => {
    setPasteNotice(null);
    onChange("");
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0">
        <label htmlFor="transcript-textarea" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          Transcript or Notes
        </label>
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 py-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={handlePaste}
            disabled={disabled}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50 py-1"
          >
            <Clipboard className="w-3.5 h-3.5" />
            Paste from clipboard
          </button>
        </div>
      </div>

      {pasteNotice && (
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 shrink-0 text-amber-500" />
          <span>{pasteNotice}</span>
        </div>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          id="transcript-textarea"
          value={value}
          onChange={(e) => {
            if (pasteNotice) setPasteNotice(null);
            onChange(e.target.value);
          }}
          disabled={disabled}
          placeholder="Paste meeting logs, conversational transcriptions, audio drafts, or quick notes here..."
          className="w-full h-56 p-4 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-100 resize-none transition-all disabled:opacity-75"
        />
        <div className="absolute bottom-3 right-4 text-xs text-slate-400 dark:text-slate-500 font-mono">
          {value.length.toLocaleString()} chars
        </div>
      </div>
    </div>
  );
}
