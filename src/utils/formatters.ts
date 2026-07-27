import { SummaryResult } from "../types";

export function formatResultToMarkdown(result: SummaryResult): string {
  const dateStr = new Date(result.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let markdown = `# Note Summary: ${result.title}\n`;
  markdown += `*Generated on ${dateStr}*\n\n`;

  markdown += `## Executive Summary\n`;
  markdown += `${result.summary}\n\n`;

  markdown += `## Key Takeaways\n`;
  result.takeaways.forEach((item) => {
    markdown += `- ${item}\n`;
  });
  markdown += `\n`;

  markdown += `## Action Items\n`;
  if (result.actionItems && result.actionItems.length > 0) {
    markdown += `| Task | Assignee | Deadline |\n`;
    markdown += `| :--- | :--- | :--- |\n`;
    result.actionItems.forEach((item) => {
      const owner = item.owner || "Unassigned";
      const deadline = item.deadline || "No deadline";
      markdown += `| ${item.task} | ${owner} | ${deadline} |\n`;
    });
  } else {
    markdown += `No action items identified.\n`;
  }

  return markdown;
}

export function downloadMarkdownFile(result: SummaryResult) {
  const markdownText = formatResultToMarkdown(result);
  const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  const safeTitle = result.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  
  link.href = url;
  link.download = `${safeTitle || "note-summary"}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateEmailSubject(result: SummaryResult): string {
  return `Note Summary & Action Items: ${result.title}`;
}

export function generateEmailBody(result: SummaryResult): string {
  let body = `Hi Team,\n\n`;
  body += `Here is the summary and action items from our notes: "${result.title}".\n\n`;
  
  body += `EXECUTIVE SUMMARY:\n`;
  body += `${result.summary}\n\n`;
  
  body += `KEY TAKEAWAYS:\n`;
  result.takeaways.forEach((item) => {
    body += `• ${item}\n`;
  });
  body += `\n`;
  
  body += `ACTION ITEMS:\n`;
  if (result.actionItems && result.actionItems.length > 0) {
    result.actionItems.forEach((item) => {
      const owner = item.owner && item.owner !== "Unassigned" ? ` (Assignee: ${item.owner})` : "";
      const deadline = item.deadline && item.deadline !== "No deadline" ? ` [Due: ${item.deadline}]` : "";
      body += `☐ ${item.task}${owner}${deadline}\n`;
    });
  } else {
    body += `No action items were identified.\n`;
  }
  
  body += `\nBest regards,\n[Your Name]`;
  return body;
}

export function generateMailtoLink(result: SummaryResult): string {
  const subject = encodeURIComponent(generateEmailSubject(result));
  const body = encodeURIComponent(generateEmailBody(result));
  return `mailto:?subject=${subject}&body=${body}`;
}

