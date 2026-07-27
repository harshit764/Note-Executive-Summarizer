import { GoogleGenAI, Type } from "@google/genai";
import { ApiResponse } from "../types";

const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

export async function summarizeMeeting(payload: {
  transcript: string;
}): Promise<ApiResponse> {
  const { transcript } = payload;

  if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
    throw new Error("Transcript or notes text is required.");
  }

  // Try client-side Gemini API call if key is present
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents = `Analyze the following transcript/notes and return a structured summary. Provide: 1. A 3-5 sentence executive summary. 2. A list of 5-7 key takeaways or highlights. Return the response in valid JSON format.

Notes/Transcript:
"""
${transcript}
"""`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "A 3-5 sentence executive summary of the meeting."
              },
              takeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 5-7 key takeaways or highlights."
              }
            },
            required: ["summary", "takeaways"]
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.summary && Array.isArray(parsed.takeaways)) {
          return {
            summary: parsed.summary,
            takeaways: parsed.takeaways
          };
        }
      }
    } catch (err) {
      console.warn("Client Gemini API call failed, falling back to local NLP summarizer:", err);
    }
  }

  // Local Client-side Natural Language Extractive Summarizer (100% Frontend)
  return localClientSummarize(transcript);
}

/**
 * Intelligent Client-side Extractive Text Summarizer
 * Runs 100% in the browser without any backend or external API dependencies.
 */
function localClientSummarize(text: string): ApiResponse {
  const cleanedText = text.replace(/\r\n/g, "\n");
  const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);
  
  const sentences: string[] = [];
  paragraphs.forEach(p => {
    const rawSentences = p.split(/(?<=[.!?])\s+/);
    rawSentences.forEach(s => {
      const trimmed = s.trim();
      if (trimmed.length > 10) {
        sentences.push(trimmed);
      }
    });
  });

  if (sentences.length === 0) {
    return {
      summary: cleanedText.slice(0, 300) + "...",
      takeaways: [
        "Notes were provided for analysis.",
        "Key discussions were captured in the transcript."
      ]
    };
  }

  const stopWords = new Set([
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
    "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
    "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
    "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
    "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could",
    "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
    "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
    "new", "want", "because", "any", "these", "give", "day", "most", "us", "is", "are", "was", "were"
  ]);

  const wordFreq: Record<string, number> = {};
  sentences.forEach(s => {
    const words = s.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    words.forEach(w => {
      if (!stopWords.has(w)) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    });
  });

  const scoredSentences = sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    let score = 0;
    words.forEach(w => {
      if (wordFreq[w]) {
        score += wordFreq[w];
      }
    });

    score = words.length > 0 ? score / Math.sqrt(words.length) : 0;

    if (index === 0) score *= 1.5;
    if (index === sentences.length - 1) score *= 1.2;

    const indicatorRegex = /\b(agreed|decision|goal|key|important|discussed|summary|result|plan|strategy|review|target|launched|completed|focus|issue|solution)\b/i;
    if (indicatorRegex.test(sentence)) {
      score *= 1.4;
    }

    return { sentence, score, index };
  });

  const sorted = [...scoredSentences].sort((a, b) => b.score - a.score);

  const topCount = Math.min(Math.max(2, Math.floor(sentences.length * 0.3)), 5);
  const summarySentences = sorted
    .slice(0, topCount)
    .sort((a, b) => a.index - b.index)
    .map(item => item.sentence);

  const summary = summarySentences.join(" ");

  const takeawayCandidates = sorted
    .slice(0, Math.min(sentences.length, 7))
    .map(item => item.sentence.replace(/^[-•*]\s*/, ""));

  const takeaways = Array.from(new Set(takeawayCandidates)).slice(0, 6);

  return {
    summary: summary || cleanedText.slice(0, 250),
    takeaways: takeaways.length > 0 ? takeaways : [
      "Reviewed core objectives and discussion points.",
      "Identified key operational milestones.",
      "Outlined next implementation priorities."
    ]
  };
}
