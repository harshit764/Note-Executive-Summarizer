import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { SummaryResult, ApiResponse } from "../types";
import { summarizeMeeting } from "../utils/api";

export function useSummarize() {
  const [history, setHistory] = useLocalStorage<SummaryResult[]>("meeting_summaries_archive", []);
  const [activeResult, setActiveResult] = useState<SummaryResult | null>(null);

  // Input states
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewSession = () => {
    setActiveResult(null);
    setTitle("");
    setTranscript("");
    setError(null);
  };

  const selectHistoryItem = (item: SummaryResult) => {
    setActiveResult(item);
    setTitle(item.title);
    setTranscript("");
    setError(null);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeResult?.id === id) {
      setActiveResult(null);
    }
  };

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      setError("Please write or paste your transcript or notes text.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const activeTitle = title.trim() || `Note on ${new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}`;

    try {
      const response: ApiResponse = await summarizeMeeting({
        transcript: transcript.trim(),
      });

      const uuid = typeof crypto !== "undefined" && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

      const newResult: SummaryResult = {
        id: uuid,
        title: activeTitle,
        summary: response.summary,
        takeaways: response.takeaways,
        actionItems: response.actionItems,
        createdAt: new Date().toISOString(),
      };

      setHistory((prev) => [newResult, ...prev]);
      setActiveResult(newResult);
    } catch (err: any) {
      console.error("AI summarization failed:", err);
      setError(err.message || "An unexpected issue occurred while analyzing with Gemini. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasInput = !!transcript.trim();

  return {
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
  };
}
