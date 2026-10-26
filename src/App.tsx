import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ResearchWorkspace } from './components/research/ResearchWorkspace';
import { BudgetDashboard } from './components/budget/BudgetDashboard';
import { KnowledgeBase } from './components/knowledge/KnowledgeBase';
import { FilingAnalytics } from './components/analytics/FilingAnalytics';
import { api } from './services/api';

export function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);
  const [geminiModel, setGeminiModel] = useState<string>('gemini-1.5-flash');
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await api.getHealth();
      setGeminiConfigured(health.gemini_configured);
      setGeminiModel(health.gemini_model);
    } catch {
      // Backend starting or not yet connected
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0e1323] text-[#dee1f9] font-sans flex antialiased select-text">
        {/* Persistent Stitch Left Navigation Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          geminiModel={geminiModel}
          geminiConfigured={geminiConfigured}
        />

        {/* Dynamic Content Frame with Fixed Header */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
            sidebarCollapsed ? 'pl-20' : 'pl-60'
          }`}
        >
          {/* Persistent Stitch Top Application Header */}
          <Topbar
            sidebarCollapsed={sidebarCollapsed}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            geminiConfigured={geminiConfigured}
            geminiModel={geminiModel}
          />

          {/* Routed Main Workspaces */}
          <main className="flex-1 pt-14 flex flex-col min-h-0 bg-[#0e1323] overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/research" replace />} />
              <Route
                path="/research"
                element={<ResearchWorkspace apiKey={apiKey} geminiModel={geminiModel} />}
              />
              <Route path="/budget" element={<BudgetDashboard apiKey={apiKey} />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/analytics" element={<FilingAnalytics />} />
              <Route path="*" element={<Navigate to="/research" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
