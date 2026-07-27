import React, { useState } from "react";
import { X, Copy, Check, Mail, ExternalLink, Share2, MessageSquare, Send } from "lucide-react";
import { SummaryResult } from "../types";
import { motion } from "motion/react";
import {
  generateEmailSubject,
  generateEmailBody,
  generateMailtoLink,
} from "../utils/formatters";

interface ShareModalProps {
  result: SummaryResult;
  onClose: () => void;
}

export default function ShareModal({ result, onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<"share" | "email">("share");
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const summaryText = `Note Summary: ${result.title}\n\n${result.summary}\n\nKey Takeaways:\n${result.takeaways.map((t) => `• ${t}`).join("\n")}`;

  const emailSubject = generateEmailSubject(result);
  const emailBody = generateEmailBody(result);
  const mailtoUrl = generateMailtoLink(result);

  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn("Clipboard API writeText blocked, trying execCommand fallback:", err);
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const res = document.execCommand("copy");
      document.body.removeChild(textarea);
      return res;
    } catch (e) {
      console.error("ExecCommand copy fallback failed:", e);
      return false;
    }
  };

  const handleCopySummaryText = async () => {
    const ok = await copyTextToClipboard(summaryText);
    if (ok) {
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 2000);
    }
  };

  const handleCopyEmailBody = async () => {
    const ok = await copyTextToClipboard(`Subject: ${emailSubject}\n\n${emailBody}`);
    if (ok) {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.title,
          text: summaryText,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      handleCopySummaryText();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Note Summary: ${result.title}\n\n${result.summary}`)}`;
  const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(summaryText)}`;

  return (
    <div id="share-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white leading-none">
                Share Note Summary
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Distribute summary & action items easily
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 md:px-6">
          <button
            type="button"
            onClick={() => setActiveTab("share")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "share"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Share2 className="w-4 h-4" />
            Quick Share
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "email"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email Template
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 md:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {activeTab === "share" ? (
            <div className="space-y-5">
              {/* Native / System Share Button if available */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share via Device Apps
                </button>
              )}

              {/* Quick Social & Messaging Share Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider">
                  Direct Share
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/50 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200/60 dark:border-sky-800/50 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-sky-700 dark:text-sky-300 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>Twitter / X</span>
                  </a>

                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200/60 dark:border-blue-800/50 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>


            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Send structured executive brief and task list directly to email:
              </p>

              <div className="space-y-3">
                {/* Subject Block */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Subject
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={emailSubject}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
                  />
                </div>

                {/* Body Block */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Body
                  </span>
                  <textarea
                    readOnly
                    value={emailBody}
                    className="w-full h-40 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 font-mono resize-none focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCopyEmailBody}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  {emailCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Email Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Email Body
                    </>
                  )}
                </button>

                <a
                  href={mailtoUrl}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Launch Mail App
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
