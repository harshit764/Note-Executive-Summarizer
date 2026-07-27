import React, { useState } from "react";
import { Copy, Check, Download, BookOpen, ListFilter, ClipboardList, FileText, Share2 } from "lucide-react";
import { SummaryResult } from "../types";
import { formatResultToMarkdown, downloadMarkdownFile } from "../utils/formatters";
import ShareModal from "./ShareModal";

interface SummaryOutputProps {
  result: SummaryResult | null;
}

export default function SummaryOutput({ result }: SummaryOutputProps) {
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!result) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50/40 dark:bg-slate-900/10">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm mb-4">
          <ClipboardList className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 font-display">No Summary Active</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
          Enter a meeting transcript or text notes, then generate structured summaries to inspect insights here.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    const markdown = formatResultToMarkdown(result);
    let success = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(markdown);
        success = true;
      }
    } catch (err) {
      console.warn("Clipboard API write failed, trying fallback:", err);
    }

    if (!success) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = markdown;
        textarea.style.position = "fixed";
        textarea.style.left = "-999999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (e) {
        console.error("Fallback copy failed:", e);
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Output Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/60 rounded-xl">
        <div className="min-w-0 flex items-center space-x-2.5">
          <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
          <div className="truncate">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Generated Result
            </span>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate font-display">
              {result.title}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex-1 sm:flex-none px-2.5 sm:px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
            title="Generate a shareable link or email composition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Email</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 sm:flex-none px-2.5 sm:px-3 py-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-xs border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
            title="Copy Markdown representation to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-500" />
                <span>Copy MD</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => downloadMarkdownFile(result)}
            className="flex-1 sm:flex-none px-2.5 sm:px-3 py-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-xs border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
            title="Download summary as standard .md file"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
            1. Executive Summary
          </h3>
        </div>

        <div className="p-4 bg-indigo-500/[0.03] dark:bg-indigo-400/[0.02] border border-indigo-100/60 dark:border-indigo-900/30 rounded-xl">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-medium">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Key Takeaways Section */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-indigo-500 shrink-0" />
          2. Key Takeaways
        </h3>
        <ul className="space-y-2.5 bg-slate-50/40 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80">
          {result.takeaways.map((item, index) => (
            <li key={index} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-block w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full mt-2.5 mr-2.5 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {isShareModalOpen && (
        <ShareModal result={result} onClose={() => setIsShareModalOpen(false)} />
      )}
    </div>
  );
}

