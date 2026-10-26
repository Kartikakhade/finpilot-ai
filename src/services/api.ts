import axios from 'axios';
import type {
  HealthResponse,
  DocumentMetadata,
  IngestResponse,
  LoadDemoResponse,
  ChatResponse,
  BudgetAnalysisResponse,
  BudgetSummaryRequest,
  BudgetAdviceResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

export const api = {
  // Health
  getHealth: async (): Promise<HealthResponse> => {
    const res = await apiClient.get<HealthResponse>('/health');
    return res.data;
  },

  // Document management
  getDocuments: async (): Promise<DocumentMetadata[]> => {
    const res = await apiClient.get<DocumentMetadata[]>('/documents');
    return res.data;
  },

  loadDemoData: async (): Promise<LoadDemoResponse> => {
    const res = await apiClient.post<LoadDemoResponse>('/documents/load-demo');
    return res.data;
  },

  ingestDocument: async (
    file: File,
    company: string,
    year: string
  ): Promise<IngestResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('company', company);
    formData.append('year', year);

    const res = await apiClient.post<IngestResponse>('/documents/ingest', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Chat agent
  sendChatMessage: async (
    message: string,
    threadId?: string,
    apiKey?: string
  ): Promise<ChatResponse> => {
    const res = await apiClient.post<ChatResponse>('/chat', {
      message,
      thread_id: threadId,
      api_key: apiKey || undefined,
    });
    return res.data;
  },

  // Budget
  analyzeBudgetCSV: async (
    file: File,
    monthlyIncome: number = 4000,
    goalName: string = 'Emergency Fund',
    goalAmount: number = 3000
  ): Promise<BudgetAnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('monthly_income', monthlyIncome.toString());
    formData.append('goal_name', goalName);
    formData.append('goal_amount', goalAmount.toString());

    const res = await apiClient.post<BudgetAnalysisResponse>('/budget/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getBudgetAdvice: async (
    payload: BudgetSummaryRequest
  ): Promise<BudgetAdviceResponse> => {
    const res = await apiClient.post<BudgetAdviceResponse>('/budget/advice', payload);
    return res.data;
  },
};
