export interface HealthResponse {
  status: string;
  version: string;
  gemini_configured: boolean;
  gemini_model: string;
}

export interface DocumentMetadata {
  company: string;
  year: string;
  source: string;
}

export interface IngestResponse {
  message: string;
  company: string;
  year: string;
  chunks_created: number;
}

export interface LoadDemoResponse {
  message: string;
  count: number;
}

export interface ToolTraceItem {
  tool: string;
  output: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tool_trace?: ToolTraceItem[];
  error?: boolean;
}

export interface ChatResponse {
  reply: string;
  thread_id: string;
  tool_trace: ToolTraceItem[];
}

export interface SpendingCategory {
  category: string;
  amount: number;
}

export interface BudgetAnalysisResponse {
  dataset_type: 'transaction' | 'profile' | 'unknown';
  row_count: number;
  total_spend?: number;
  monthly_income?: number;
  surplus?: number;
  savings_rate?: number;
  debt_to_income?: number;
  goal_name?: string;
  goal_amount?: number;
  months_to_goal?: number;
  categories?: SpendingCategory[];
  raw_preview?: Record<string, any>[];
  avg_income?: number;
  avg_expenses?: number;
  requires_column_mapping?: boolean;
  columns?: string[];
}

export interface BudgetSummaryRequest {
  monthly_income: number;
  total_spend: number;
  surplus: number;
  savings_rate: number;
  debt_to_income: number;
  goal_name: string;
  goal_amount: number;
  months_to_goal: number;
  top_categories: SpendingCategory[];
  api_key?: string;
}

export interface BudgetAdviceResponse {
  advice: string;
}
