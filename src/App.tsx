import React, { useState } from "react";
import Header from "./components/Header";
import TranscriptInput from "./components/TranscriptInput";
import SummaryControls from "./components/SummaryControls";
import SummaryOutput from "./components/SummaryOutput";
import HistorySidebar from "./components/HistorySidebar";
import { useSummarize } from "./hooks/useSummarize";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, History, FileText } from "lucide-react";

export default function App() {
  const {
    history,
    activeResult,
    title,
    setTitle,
    transcript,
    setTranscript,
    isLoading,
    error,
    startNewSession,
    selectHistoryItem,
    deleteHistoryItem,
    handleSummarize,
    hasInput,
  } = useSummarize();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"input" | "summary">("input");

  const onTriggerSummarize = async () => {
    setMobileTab("summary");
    await handleSummarize();
  };

  const onTriggerNewNote = () => {
    startNewSession();
    setMobileTab("input");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Header />

      {/* Main split work area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        
        {/* Mobile History Top Bar */}
        <div className="md:hidden px-3.5 py-2 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 py-1.5 cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span>Past Summaries</span>
            <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full px-2 py-0.5 text-[10px] font-bold">
              {history.length}
            </span>
          </button>
          
          <button
            type="button"
            onClick={onTriggerNewNote}
            className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer border border-indigo-200/50 dark:border-indigo-800/50 transition-all"
          >
            + New Note
          </button>
        </div>

        {/* Desktop History Sidebar */}
        <div className="hidden md:block w-64 shrink-0 h-[calc(100vh-60px)] border-r border-slate-200 dark:border-slate-800">
          <HistorySidebar
            history={history}
            onSelect={(item) => {
              selectHistoryItem(item);
              setMobileTab("summary");
            }}
            onDelete={deleteHistoryItem}
            onNewNote={onTriggerNewNote}
            activeId={activeResult?.id || null}
          />
        </div>

        {/* Mobile History Drawer Overlay */}
        <AnimatePresence>
          {isHistoryOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                onClick={() => setIsHistoryOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative z-10 w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl"
              >
                <HistorySidebar
                  history={history}
                  onSelect={(item) => {
                    selectHistoryItem(item);
                    setIsHistoryOpen(false);
                    setMobileTab("summary");
                  }}
                  onDelete={deleteHistoryItem}
                  onNewNote={() => {
                    onTriggerNewNote();
                    setIsHistoryOpen(false);
                  }}
                  activeId={activeResult?.id || null}
                  onCloseMobile={() => setIsHistoryOpen(false)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Workspace Panel */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 h-auto md:h-[calc(100vh-60px)]">
          <div className="max-w-7xl mx-auto">
            
            {/* Server/Gemini Connection Errors */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 sm:mb-6 p-3.5 sm:p-4 bg-rose-500/10 dark:bg-rose-400/5 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-start space-x-3 text-rose-700 dark:text-rose-400"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Processing Error</p>
                  <p className="opacity-90 mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Mobile View Controller Tabs */}
            <div className="lg:hidden flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setMobileTab("input")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mobileTab === "input"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                ✏️ Note Input
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("summary")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileTab === "summary"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Executive Summary
                {activeResult && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Split workspace layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
              
              {/* Inputs Panel */}
              <div className={`${mobileTab === "input" ? "block" : "hidden"} lg:block space-y-5 sm:space-y-6`}>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/85 pb-3.5 sm:pb-4">
                    <h2 className="text-xs sm:text-sm font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Configure Note
                    </h2>
                    <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-semibold font-mono">STEP 1 OF 2</span>
                  </div>

                  {/* Transcript textarea */}
                  <TranscriptInput
                    value={transcript}
                    onChange={setTranscript}
                    disabled={isLoading}
                  />

                  {/* Submit controllers */}
                  <SummaryControls
                    title={title}
                    onTitleChange={setTitle}
                    onSubmit={onTriggerSummarize}
                    onReset={onTriggerNewNote}
                    isLoading={isLoading}
                    disabled={!hasInput}
                    hasInput={hasInput}
                  />
                </div>
              </div>

              {/* Outputs Panel */}
              <div className={`${mobileTab === "summary" ? "block" : "hidden"} lg:block lg:sticky lg:top-4`}>
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 sm:py-24 text-center"
                      >
                        <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-5 sm:mb-6">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20 animate-ping" />
                          <div className="relative p-3.5 sm:p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                            <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500 animate-pulse" />
                          </div>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 font-display">
                          Analyzing your notes...
                        </h3>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-xs space-y-1 leading-normal font-medium">
                          <p>Synthesizing note insights</p>
                          <p>Compiling key highlights & action items</p>
                        </div>
                      </motion.div>
                    ) : activeResult ? (
                      <motion.div
                        key="active-result"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <SummaryOutput result={activeResult} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <SummaryOutput result={null} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
