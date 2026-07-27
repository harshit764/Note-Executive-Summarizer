import React from "react";
import { FileText, Loader2, RotateCcw } from "lucide-react";

interface SummaryControlsProps {
  title: string;
  onTitleChange: (val: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  disabled: boolean;
  hasInput: boolean;
}

export default function SummaryControls({
  title,
  onTitleChange,
  onSubmit,
  onReset,
  isLoading,
  disabled,
  hasInput,
}: SummaryControlsProps) {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Note Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={isLoading}
          placeholder="e.g. Marketing Strategy Sync, Design Critique, Weekly Notes..."
          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-100 transition-all"
        />
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || isLoading || !hasInput}
          className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow-indigo-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Note...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate Summary
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isLoading || (!title && !hasInput)}
          className="py-3 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium text-sm transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          title="Reset Inputs"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
