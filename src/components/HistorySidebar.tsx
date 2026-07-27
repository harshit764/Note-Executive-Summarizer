import React, { useState } from "react";
import { History, Trash2, Calendar, FileText, Plus, Search, X } from "lucide-react";
import { SummaryResult } from "../types";

interface HistorySidebarProps {
  history: SummaryResult[];
  onSelect: (result: SummaryResult) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onNewNote: () => void;
  activeId: string | null;
  onCloseMobile?: () => void;
}

export default function HistorySidebar({
  history,
  onSelect,
  onDelete,
  onNewNote,
  activeId,
  onCloseMobile,
}: HistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const titleMatch = item.title.toLowerCase().includes(query);
    const summaryMatch = item.summary.toLowerCase().includes(query);
    const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).toLowerCase();
    const dateMatch = dateStr.includes(query);
    return titleMatch || summaryMatch || dateMatch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950/20 border-r border-slate-200 dark:border-slate-800 w-full transition-all">
      {/* Sidebar Header with New Session button */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-500" />
          Past Summaries
        </h3>
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={onNewNote}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-sm active:scale-95 transition-all"
            title="Create a new note"
          >
            <Plus className="w-3.5 h-3.5" />
            New Note
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close history drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input Filter */}
      {history.length > 0 && (
        <div className="px-3 pt-3 pb-1">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search summaries or date..."
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Scrollable History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {history.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400 dark:text-slate-500">
            <History className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-500" />
            <p className="text-xs font-medium">No past notes found.</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">Your summaries will automatically persist here.</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 dark:text-slate-500 space-y-2">
            <Search className="w-6 h-6 mx-auto opacity-40 text-slate-400" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              No results for &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isActive = item.id === activeId;
            const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  isActive
                    ? "bg-indigo-500/[0.04] dark:bg-indigo-400/[0.03] border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-400"
                    : "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                  <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-indigo-500" : "text-slate-400"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                      <Calendar className="w-2.5 h-2.5" />
                      {dateStr}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => onDelete(item.id, e)}
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer ml-1"
                  title="Remove from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
