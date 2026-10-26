import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Clock,
  Sparkles,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../../services/api';
import type { BudgetAnalysisResponse, SpendingCategory } from '../../types';

interface BudgetDashboardProps {
  apiKey: string;
}

const CATEGORY_COLORS = [
  '#2dd4bf',
  '#57f1db',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#6366f1',
];

export function BudgetDashboard({ apiKey }: BudgetDashboardProps) {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(4500);
  const [goalAmount, setGoalAmount] = useState<number>(5000);
  const [goalName, setGoalName] = useState<string>('Emergency Reserve');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BudgetAnalysisResponse | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      await analyzeFile(file);
    }
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await api.analyzeBudgetCSV(file, monthlyIncome, goalName, goalAmount);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to analyze budget file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateAdvice = async () => {
    if (!analysisResult || !analysisResult.categories) return;
    setIsGeneratingAdvice(true);
    try {
      const res = await api.getBudgetAdvice({
        monthly_income: analysisResult.monthly_income || monthlyIncome,
        total_spend: analysisResult.total_spend || 0,
        surplus: analysisResult.surplus || 0,
        savings_rate: analysisResult.savings_rate || 0,
        debt_to_income: analysisResult.debt_to_income || 0,
        goal_name: goalName,
        goal_amount: goalAmount,
        months_to_goal: analysisResult.months_to_goal || 0,
        top_categories: analysisResult.categories,
        api_key: apiKey || undefined,
      });
      setAdvice(res.advice);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to generate financial advice.');
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  // Safe metrics fallbacks for initial display
  const totalSpend = analysisResult?.total_spend ?? 3240;
  const netSurplus = analysisResult?.surplus ?? monthlyIncome - totalSpend;
  const savingsRate = analysisResult?.savings_rate ?? 28.0;
  const monthsToGoal = analysisResult?.months_to_goal ?? (netSurplus > 0 ? (goalAmount / netSurplus).toFixed(1) : '—');
  const dti = analysisResult?.debt_to_income ?? 14.2;

  const categories: SpendingCategory[] = analysisResult?.categories || [
    { category: 'Housing & Utilities', amount: 1450 },
    { category: 'Groceries & Dining', amount: 620 },
    { category: 'Transportation', amount: 380 },
    { category: 'Healthcare & Insurance', amount: 290 },
    { category: 'Subscriptions & Leisure', amount: 260 },
    { category: 'Education & Books', amount: 240 },
  ];

  const runwayData = [
    { month: 'Current', cash: netSurplus },
    { month: 'Month 3', cash: netSurplus * 3 },
    { month: 'Month 6', cash: netSurplus * 6 },
    { month: 'Month 12', cash: netSurplus * 12 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Profile Config */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#161b2b] border border-[#273247] text-[11px] text-[#57f1db] font-mono mb-1.5">
            <Sparkles size={11} />
            <span>Deterministic Cash-Flow Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#dee1f9]">
            Personal Budget & Financial Runway
          </h1>
          <p className="text-xs text-[#bacac5] mt-0.5">
            Reconcile banking transactions, monitor debt-to-income, and project emergency fund runway.
          </p>
        </div>

        {/* Profile Inputs */}
        <div className="flex flex-wrap items-center gap-3 bg-[#121a2b] p-2.5 rounded-xl border border-[#273247]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-mono text-[#bacac5]/70">Monthly Income</span>
            <div className="flex items-center gap-1 bg-[#080d1d] px-2 py-1 rounded border border-[#273247] text-xs">
              <span className="text-[#57f1db]">$</span>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-18 bg-transparent text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-mono text-[#bacac5]/70">Goal Name</span>
            <div className="flex items-center gap-1 bg-[#080d1d] px-2 py-1 rounded border border-[#273247] text-xs">
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-28 bg-transparent text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-mono text-[#bacac5]/70">Target Goal</span>
            <div className="flex items-center gap-1 bg-[#080d1d] px-2 py-1 rounded border border-[#273247] text-xs">
              <span className="text-[#57f1db]">$</span>
              <input
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                className="w-18 bg-transparent text-white font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSV Ingestion Banner */}
      <div className="rounded-xl bg-[#121a2b] border border-[#273247] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#1a2336] flex items-center justify-center text-[#57f1db] shrink-0 border border-[#273247]">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#dee1f9]">
              Reconcile Transactions CSV
            </h3>
            <p className="text-[11px] text-[#bacac5]/70">
              Upload your bank export (e.g., transactions (1).csv) to recalculate automated spending breakdowns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedFile && (
            <span className="text-xs text-[#57f1db] font-mono flex items-center gap-1">
              <CheckCircle size={13} /> {selectedFile.name}
            </span>
          )}
          <label className="px-3.5 py-1.5 rounded-lg bg-[#2dd4bf] hover:bg-[#57f1db] text-[#00201c] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-sm">
            {isAnalyzing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <FileSpreadsheet size={13} />
            )}
            <span>{isAnalyzing ? 'Analyzing CSV...' : 'Upload Bank CSV'}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Bento KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spend */}
        <div className="rounded-xl bg-[#121a2b] border border-[#273247] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#bacac5]">
            <span className="uppercase text-[10px] font-mono tracking-wider">Total Monthly Spend</span>
            <DollarSign size={14} className="text-[#57f1db]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-[#dee1f9]">
              ${totalSpend.toLocaleString()}
            </span>
            <span className="block text-[11px] text-[#bacac5]/70 mt-0.5">
              Budget Allocated: ${(monthlyIncome * 0.8).toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#273247]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5]">Burn Rate</span>
            <span className="text-[#57f1db] font-mono font-medium">
              {((totalSpend / monthlyIncome) * 100).toFixed(0)}% of income
            </span>
          </div>
        </div>

        {/* Net Monthly Surplus */}
        <div className="rounded-xl bg-[#121a2b] border border-[#273247] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#bacac5]">
            <span className="uppercase text-[10px] font-mono tracking-wider">Net Monthly Surplus</span>
            <TrendingUp size={14} className="text-[#57f1db]" />
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-bold font-mono ${netSurplus >= 0 ? 'text-[#57f1db]' : 'text-[#ffb4ab]'}`}>
              {netSurplus >= 0 ? '+' : '-'}${Math.abs(netSurplus).toLocaleString()}
            </span>
            <span className="block text-[11px] text-[#bacac5]/70 mt-0.5">
              Available for Goal Allocation
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#273247]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5]">Savings Velocity</span>
            <span className="text-[#57f1db] font-mono font-medium">
              {savingsRate}%
            </span>
          </div>
        </div>

        {/* Debt-to-Income */}
        <div className="rounded-xl bg-[#121a2b] border border-[#273247] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#bacac5]">
            <span className="uppercase text-[10px] font-mono tracking-wider">Debt-to-Income (DTI)</span>
            <Percent size={14} className="text-[#57f1db]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-[#dee1f9]">
              {dti}%
            </span>
            <span className="block text-[11px] text-[#bacac5]/70 mt-0.5">
              Threshold: &lt; 36%
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#273247]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5]">Credit Leverage</span>
            <span className="text-[#57f1db] font-mono font-medium">Healthy</span>
          </div>
        </div>

        {/* Runway to Goal */}
        <div className="rounded-xl bg-[#121a2b] border border-[#273247] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#bacac5]">
            <span className="uppercase text-[10px] font-mono tracking-wider">Estimated Goal Runway</span>
            <Clock size={14} className="text-[#57f1db]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-[#dee1f9]">
              {monthsToGoal} <span className="text-xs text-[#bacac5] font-normal">Months</span>
            </span>
            <span className="block text-[11px] text-[#bacac5]/70 mt-0.5">
              Target: ${goalAmount.toLocaleString()} ({goalName})
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#273247]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5]">Feasibility</span>
            <span className="text-[#57f1db] font-mono font-medium">On Track</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Spending by Category */}
        <div className="lg:col-span-5 rounded-xl bg-[#121a2b] border border-[#273247] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-manrope text-sm font-semibold text-[#dee1f9]">
              Spending Category Distribution
            </h2>
            <span className="text-[10px] font-mono text-[#bacac5]/70 uppercase">Reconciled</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {categories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#080d1d',
                    border: '1px solid #273247',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#dee1f9',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {categories.slice(0, 6).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                />
                <span className="truncate text-[#bacac5]">{c.category}</span>
                <span className="font-mono text-[#dee1f9] ml-auto">
                  ${c.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Projected Runway Accumulation */}
        <div className="lg:col-span-7 rounded-xl bg-[#121a2b] border border-[#273247] p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-manrope text-sm font-semibold text-[#dee1f9]">
                Cumulative Cash Surplus Projections
              </h2>
              <span className="text-[10px] font-mono text-[#57f1db]">Compound Trajectory</span>
            </div>
            <p className="text-xs text-[#bacac5] mt-1">
              Projected cumulative balance based on maintaining current surplus of ${netSurplus.toLocaleString()}/mo.
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runwayData}>
                <XAxis
                  dataKey="month"
                  stroke="#859490"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#273247' }}
                />
                <YAxis
                  stroke="#859490"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#273247' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#080d1d',
                    border: '1px solid #273247',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#dee1f9',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Projected Reserve']}
                />
                <Bar dataKey="cash" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Advice Action Card */}
          <div className="p-4 rounded-xl bg-[#080d1d] border border-[#273247] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#dee1f9]">
                <Sparkles size={13} className="text-[#57f1db]" />
                <span>AI Financial Planning Synthesis</span>
              </div>
              <p className="text-[11px] text-[#bacac5]/70 mt-0.5">
                Generate 5 tailored optimization strategies based on this cash-flow breakdown.
              </p>
            </div>
            <button
              onClick={handleGenerateAdvice}
              disabled={isGeneratingAdvice}
              className="px-3.5 py-1.5 rounded-lg bg-[#2dd4bf] hover:bg-[#57f1db] text-[#00201c] text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 shrink-0 cursor-pointer"
            >
              {isGeneratingAdvice ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              <span>{isGeneratingAdvice ? 'Synthesizing...' : 'Generate AI Advice'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Advice Output Display */}
      {advice && (
        <div className="rounded-xl bg-[#121a2b] border border-[#273247] p-6 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded bg-[#57f1db]"></div>
            <h3 className="font-semibold text-sm text-[#dee1f9]">
              Gemini Financial Advisory Synthesis
            </h3>
          </div>
          <div className="p-4 rounded-lg bg-[#080d1d] border border-[#273247]/50 text-xs text-[#bacac5] leading-relaxed whitespace-pre-wrap font-sans">
            {advice}
          </div>
        </div>
      )}
    </div>
  );
}
