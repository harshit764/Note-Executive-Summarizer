export interface SummaryResult {
  id: string;
  title: string;
  summary: string;
  takeaways: string[];
  actionItems?: ActionItem[];
  createdAt: string;
}

export interface ActionItem {
  task: string;
  owner?: string;
  deadline?: string;
}

export interface ApiResponse {
  summary: string;
  takeaways: string[];
  actionItems?: ActionItem[];
}
