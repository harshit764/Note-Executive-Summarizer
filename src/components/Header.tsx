import ThemeToggle from "./ThemeToggle";
import { FileText } from "lucide-react";

export default function Header() {
  return (
    <header id="app-header" className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 py-2.5 sm:py-3.5 px-3 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
        <div className="p-1.5 sm:p-2 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 truncate">
            Note & Executive Summarizer
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 truncate">
            Convert transcripts or text notes into professional structured summaries
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 pl-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
