import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RatioRow {
  name: string;
  formula: string;
  fy22: string;
  fy23: string;
  peer: string;
  delta: string;
  health: 'Superior' | 'Neutral' | 'Monitored Leverage';
}

const PROFITABILITY_RATIOS: RatioRow[] = [
  { name: 'Gross Profit Margin', formula: 'Gross Profit / Net Sales', fy22: '43.3%', fy23: '44.1%', peer: '38.4%', delta: '+570 bps', health: 'Superior' },
  { name: 'Operating Margin (EBIT)', formula: 'Operating Income / Net Sales', fy22: '30.3%', fy23: '29.8%', peer: '24.2%', delta: '+560 bps', health: 'Superior' },
  { name: 'Net Profit Margin', formula: 'Net Income / Net Sales', fy22: '25.3%', fy23: '25.3%', peer: '20.8%', delta: '+450 bps', health: 'Neutral' },
  { name: 'Return on Equity (ROE)', formula: 'Net Income / Average Shareholders Equity', fy22: '175.4%', fy23: '156.1%', peer: '32.5%', delta: '+1,236 bps', health: 'Superior' },
];

const LIQUIDITY_RATIOS: RatioRow[] = [
  { name: 'Current Ratio', formula: 'Total Current Assets / Total Current Liabilities', fy22: '0.88x', fy23: '0.99x', peer: '1.45x', delta: '-0.46x', health: 'Neutral' },
  { name: 'Quick Ratio (Acid-Test)', formula: 'Liquid Assets / Current Liabilities', fy22: '0.70x', fy23: '0.85x', peer: '1.18x', delta: '-0.33x', health: 'Neutral' },
  { name: 'Debt-to-Equity Ratio', formula: 'Total Debt / Total Shareholders Equity', fy22: '2.37x', fy23: '1.79x', peer: '0.65x', delta: '+1.14x', health: 'Monitored Leverage' },
];

const EFFICIENCY_RATIOS: RatioRow[] = [
  { name: 'Asset Turnover', formula: 'Net Sales / Average Total Assets', fy22: '1.12x', fy23: '1.07x', peer: '0.82x', delta: '+0.25x', health: 'Superior' },
  { name: 'Inventory Turnover', formula: 'Cost of Goods Sold / Average Inventory', fy22: '44.2x', fy23: '38.1x', peer: '18.4x', delta: '+19.7x', health: 'Superior' },
  { name: 'Cash Conversion Cycle', formula: 'DIO + DSO - DPO', fy22: '-58 days', fy23: '-62 days', peer: '+24 days', delta: '-86 days', health: 'Superior' },
];

export const FilingAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'prof' | 'liq' | 'dup'>('prof');
  const [traceOpen, setTraceOpen] = useState(false);

  const getRatios = () => {
    switch (activeTab) {
      case 'liq': return LIQUIDITY_RATIOS;
      case 'dup': return EFFICIENCY_RATIOS;
      default: return PROFITABILITY_RATIOS;
    }
  };

  const currentRatios = getRatios();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
      {/* Disclaimer Header Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#161b2b] border border-[#273247]/50 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="material-symbols-outlined text-[18px] text-[#57f1db] shrink-0">verified_user</span>
          <span className="text-xs text-[#bacac5] truncate">
            All displayed values are illustrative financial research simulations for demonstration purposes. Grounded with EDGAR CIK: 0000320193.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#57f1db] bg-[#2dd4bf]/10 px-2.5 py-0.5 rounded border border-[#2dd4bf]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#57f1db] animate-pulse"></span>
            CONFIDENCE 99.4%
          </span>
        </div>
      </div>

      {/* Corporate Analysis Title & Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#25293a] border border-[#273247] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#57f1db]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-1 2.96 1.07.08 2.16-.48 2.81-1.3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#dee1f9] tracking-tight">
              Apple Inc. (NASDAQ: AAPL) — FY2023 Form 10-K Comprehensive Deep Dive
            </h1>
          </div>
          <p className="text-xs text-[#bacac5] max-w-4xl">
            Source-grounded AI agent synthesis across 132 filed pages, MD&amp;A, and consolidated financial notes.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-[#bacac5] text-xs">
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              Fiscal Year Ended Sep 30, 2023
            </span>
            <span className="text-[#273247]">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Auditor: Ernst &amp; Young LLP
            </span>
            <span className="text-[#273247]">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">description</span>
              Filing Date: Nov 3, 2023
            </span>
            <span className="text-[#273247]">•</span>
            <span className="inline-flex items-center gap-1 text-[#57f1db]">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              Agent Version 3.4.1
            </span>
          </div>
        </div>

        {/* Action Suite */}
        <div className="flex flex-wrap items-center gap-2 pt-2 xl:pt-0">
          <button
            onClick={() => window.print()}
            className="h-8 px-3 rounded bg-[#25293a] hover:bg-[#34394a] text-[#dee1f9] text-xs transition flex items-center gap-1.5 shadow-sm border border-[#273247] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#b9c8dc]">picture_as_pdf</span>
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Ratio,FY2022,FY2023,PeerBenchmark,Delta\n" +
                currentRatios.map(r => `"${r.name}","${r.fy22}","${r.fy23}","${r.peer}","${r.delta}"`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `AAPL_FY23_${activeTab}_ratios.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="h-8 px-3 rounded bg-[#25293a] hover:bg-[#34394a] text-[#dee1f9] text-xs transition flex items-center gap-1.5 shadow-sm border border-[#273247] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#b9c8dc]">table_view</span>
            <span>Export to Excel / CSV</span>
          </button>
          <button
            onClick={() => navigate('/research')}
            className="h-8 px-3.5 rounded bg-[#2dd4bf] text-[#00201c] text-xs font-semibold hover:bg-[#57f1db] transition flex items-center gap-1.5 shadow-sm shadow-[#2dd4bf]/20 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
            <span>Ask Follow-up in Research Chat</span>
          </button>
        </div>
      </div>

      {/* Key Financial Highlights Bar (4 Bento Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="rounded-xl bg-[#161b2b] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group border border-[#273247]/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#bacac5]">Total Net Sales</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-[#ffb4ab] bg-[#93000a]/20">
              -2.8% YoY
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#dee1f9] tracking-tight font-mono">
              $383.29B
            </div>
            <div className="flex items-center justify-between mt-1 text-[#bacac5] text-xs">
              <span>FY2022: $394.33B</span>
              <span className="font-mono text-[11px] text-[#b9c8dc]">82% Hardware / 18% Svc</span>
            </div>
          </div>
          <div className="mt-3 pt-2 bg-[#1a1f30]/60 rounded px-2.5 py-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5]">Services Momentum</span>
            <span className="font-mono text-[#57f1db] font-medium">$85.20B (+9.1%)</span>
          </div>
        </div>

        {/* Net Income */}
        <div className="rounded-xl bg-[#161b2b] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group border border-[#273247]/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#bacac5]">Net Income</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-[#ffb4ab] bg-[#93000a]/20">
              -2.8% YoY
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#dee1f9] tracking-tight font-mono">
              $97.00B
            </div>
            <div className="flex items-center justify-between mt-1 text-[#bacac5] text-xs">
              <span>FY2022: $99.80B</span>
              <span className="font-mono text-[11px] text-[#57f1db]">25.3% Net Margin</span>
            </div>
          </div>
          <div className="mt-3 pt-2 bg-[#1a1f30]/60 rounded px-2.5 py-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5]">Pre-Tax Return</span>
            <span className="font-mono text-[#dee1f9] font-medium">$113.75B (29.7%)</span>
          </div>
        </div>

        {/* Operating Cash Flow */}
        <div className="rounded-xl bg-[#161b2b] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group border border-[#273247]/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#bacac5]">Operating Cash Flow</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-[#57f1db] bg-[#2dd4bf]/10">
              114% Conversion
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#dee1f9] tracking-tight font-mono">
              $110.54B
            </div>
            <div className="flex items-center justify-between mt-1 text-[#bacac5] text-xs">
              <span>Free Cash Flow: $99.58B</span>
              <span className="font-mono text-[11px] text-[#57f1db] font-medium">High Quality</span>
            </div>
          </div>
          <div className="mt-3 pt-2 bg-[#1a1f30]/60 rounded px-2.5 py-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5]">CapEx Allocation</span>
            <span className="font-mono text-[#dee1f9] font-medium">$10.96B (Strict Discipline)</span>
          </div>
        </div>

        {/* Diluted EPS */}
        <div className="rounded-xl bg-[#161b2b] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group border border-[#273247]/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#bacac5]">Diluted EPS</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-[#57f1db] bg-[#2dd4bf]/10">
              +0.3% YoY
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-[#dee1f9] tracking-tight font-mono">
              $6.13
            </div>
            <div className="flex items-center justify-between mt-1 text-[#bacac5] text-xs">
              <span>FY2022: $6.11</span>
              <span className="font-mono text-[11px] text-[#b9c8dc]">Buyback Accretion</span>
            </div>
          </div>
          <div className="mt-3 pt-2 bg-[#1a1f30]/60 rounded px-2.5 py-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[#bacac5]">Shares Retired</span>
            <span className="font-mono text-[#57f1db] font-medium">-2.8% Float Reduction</span>
          </div>
        </div>
      </div>

      {/* Executive Summary & Strategic Findings */}
      <div className="rounded-xl bg-[#161b2b] p-6 shadow-sm flex flex-col gap-4 border border-[#273247]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded bg-[#57f1db]"></div>
            <h2 className="font-semibold text-base text-[#dee1f9]">Executive Summary &amp; Core Findings</h2>
          </div>
          <span className="text-xs text-[#bacac5] font-mono">SYNTHESIS CONFIDENCE: 98.7%</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3 text-xs text-[#dee1f9] leading-relaxed">
            <p>
              Apple Inc.’s FY2023 Form 10-K illustrates operational resilience against macro hardware deceleration. Despite consolidated net sales contracting by <span className="font-mono text-white font-medium">2.8%</span> to <span className="font-mono text-white font-medium">$383.29B</span> (driven by headwinds across Mac and iPad demand cycles following the pandemic refresh peak), profitability metrics expanded. Gross margins widened <span className="text-[#57f1db] font-medium">+80 bps to 44.1%</span>, propelled by an increasingly lucrative mix shift toward digital Services alongside internal silicon cost advantages.
            </p>
            <p>
              The Services segment achieved an all-time revenue record of <span className="font-mono text-white font-medium">$85.20B</span> (+9.1% YoY), boasting gross margins of <span className="font-mono text-[#57f1db] font-medium">70.8%</span> compared to Products gross margin of <span className="font-mono text-white font-medium">36.5%</span>. This software-driven margin dampening cushioned a 2.4% contraction in iPhone sales ($200.58B vs. $205.49B).
            </p>
            <p>
              Capital allocation maintained disciplined continuity: Apple returned over <span className="font-mono text-white font-medium">$77.55B</span> through share repurchases and <span className="font-mono text-white font-medium">$15.03B</span> in dividends, successfully maintaining modest EPS expansion despite top-line contraction. Net debt leverage posture remains moderate, with cash and marketable securities totaling <span className="font-mono text-white font-medium">$162.10B</span> against <span className="font-mono text-white font-medium">$111.09B</span> in term debt.
            </p>
          </div>

          {/* Revenue Segment Breakdown Graphic */}
          <div className="rounded-lg bg-[#1a1f30] p-4 flex flex-col justify-between border border-[#273247]/50">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#dee1f9]">Revenue Mix Velocity</span>
                <span className="font-mono text-[11px] text-[#bacac5]">FY23 Breakdown</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#dee1f9]">iPhone</span>
                    <span className="font-mono text-[#dee1f9]">$200.58B (52.3%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#25293a] overflow-hidden">
                    <div className="h-full bg-[#57f1db]" style={{ width: '52.3%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#dee1f9]">Services</span>
                    <span className="font-mono text-[#57f1db]">$85.20B (22.2%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#25293a] overflow-hidden">
                    <div className="h-full bg-[#2dd4bf]" style={{ width: '22.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#dee1f9]">Wearables, Home &amp; Acc.</span>
                    <span className="font-mono text-[#dee1f9]">$39.85B (10.4%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#25293a] overflow-hidden">
                    <div className="h-full bg-[#b9c8dc]" style={{ width: '10.4%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#dee1f9]">Mac Hardware</span>
                    <span className="font-mono text-[#dee1f9]">$29.36B (7.7%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#25293a] overflow-hidden">
                    <div className="h-full bg-[#3a4859]" style={{ width: '7.7%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#dee1f9]">iPad</span>
                    <span className="font-mono text-[#dee1f9]">$28.30B (7.4%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#25293a] overflow-hidden">
                    <div className="h-full bg-[#424d63]" style={{ width: '7.4%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#273247]/30 flex items-center justify-between text-xs text-[#bacac5]">
              <span>Services Margin Expansion:</span>
              <span className="font-mono text-[#57f1db] font-medium">+200 bps YoY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Ratios & Benchmark Table */}
      <div className="rounded-xl bg-[#161b2b] shadow-sm flex flex-col overflow-hidden border border-[#273247]/50">
        {/* Table Header & Controls */}
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#161b2b]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded bg-[#57f1db]"></div>
            <div>
              <h2 className="font-semibold text-base text-[#dee1f9]">Financial Ratios &amp; Benchmark Assessment</h2>
              <p className="text-xs text-[#bacac5]">Cross-sectional analysis compared to S&amp;P 500 Mega-Cap Technology peers</p>
            </div>
          </div>
          {/* Segmented Tab Switcher */}
          <div className="inline-flex p-1 rounded-lg bg-[#080d1d] gap-1 border border-[#273247]/40 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('prof')}
              className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                activeTab === 'prof'
                  ? 'bg-[#1a1f30] text-[#57f1db] font-medium shadow-sm'
                  : 'text-[#bacac5] hover:text-white'
              }`}
              type="button"
            >
              Profitability Ratios
            </button>
            <button
              onClick={() => setActiveTab('liq')}
              className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                activeTab === 'liq'
                  ? 'bg-[#1a1f30] text-[#57f1db] font-medium shadow-sm'
                  : 'text-[#bacac5] hover:text-white'
              }`}
              type="button"
            >
              Liquidity &amp; Solvency
            </button>
            <button
              onClick={() => setActiveTab('dup')}
              className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                activeTab === 'dup'
                  ? 'bg-[#1a1f30] text-[#57f1db] font-medium shadow-sm'
                  : 'text-[#bacac5] hover:text-white'
              }`}
              type="button"
            >
              Efficiency &amp; DuPont
            </button>
          </div>
        </div>

        {/* Ratio Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#080d1d] text-[#bacac5] text-xs uppercase tracking-wider h-9">
                <th className="px-4 py-2 font-medium">Ratio Metric</th>
                <th className="px-4 py-2 font-medium text-right">FY2022</th>
                <th className="px-4 py-2 font-medium text-right">FY2023</th>
                <th className="px-4 py-2 font-medium text-right">Peer Benchmark</th>
                <th className="px-4 py-2 font-medium text-right">Variance / Delta</th>
                <th className="px-4 py-2 font-medium text-center">Health Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#273247]/20 text-xs text-[#dee1f9]">
              {currentRatios.map((r, idx) => (
                <tr key={idx} className="hover:bg-[#1a1f30]/60 transition h-11">
                  <td className="px-4 py-2 font-medium flex items-center gap-2">
                    <span>{r.name}</span>
                    <span className="material-symbols-outlined text-[14px] text-[#bacac5]/60 cursor-help" title={r.formula}>info</span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-[#bacac5]">{r.fy22}</td>
                  <td className="px-4 py-2 text-right font-mono text-white font-semibold">{r.fy23}</td>
                  <td className="px-4 py-2 text-right font-mono text-[#bacac5]">{r.peer}</td>
                  <td className={`px-4 py-2 text-right font-mono font-medium ${
                    r.health === 'Superior' ? 'text-[#57f1db]' : r.health === 'Monitored Leverage' ? 'text-[#ffb4ab]' : 'text-[#b9c8dc]'
                  }`}>
                    {r.delta}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      r.health === 'Superior'
                        ? 'text-[#57f1db] bg-[#2dd4bf]/10'
                        : r.health === 'Monitored Leverage'
                        ? 'text-[#ffb4ab] bg-[#93000a]/20'
                        : 'text-[#b9c8dc] bg-[#3a4859]/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        r.health === 'Superior' ? 'bg-[#57f1db]' : r.health === 'Monitored Leverage' ? 'bg-[#ffb4ab]' : 'bg-[#b9c8dc]'
                      }`}></span>
                      {r.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-[#080d1d] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#bacac5] gap-2 border-t border-[#273247]/30">
          <span>*Industry benchmark aggregate derived from top 15 constituents of S&amp;P Information Technology Index.</span>
          <span className="font-mono">DATASET RECONCILED: 2023-11-04</span>
        </div>
      </div>

      {/* Risk Assessment & Factor Analysis (Item 1A 10-K breakdown) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded bg-[#57f1db]"></div>
            <div>
              <h2 className="font-semibold text-base text-[#dee1f9]">Item 1A Risk Factor Breakdown</h2>
              <p className="text-xs text-[#bacac5]">Natural language classification and materiality severity indexing</p>
            </div>
          </div>
          <span className="text-xs text-[#bacac5]">3 Core Exposure Clusters Identified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Risk 1 */}
          <div className="rounded-xl bg-[#161b2b] p-4 shadow-sm flex flex-col justify-between relative group hover:bg-[#1a1f30] transition border border-[#273247]/50">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#bacac5] uppercase tracking-wider font-mono">CLUSTER #01</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-[#dee1f9] bg-[#3a4859]">
                  Moderate-High
                </span>
              </div>
              <h3 className="text-sm text-[#dee1f9] font-semibold mb-2">
                Supply Chain &amp; Manufacturing Concentration
              </h3>
              <p className="text-xs text-[#bacac5] leading-relaxed">
                Substantially all manufacturing partner facilities and specialized component providers remain clustered in East Asia (principally Mainland China, Taiwan, and Vietnam). Geopolitical friction, maritime shipping disruptions, or regional trade sanctions could trigger irreversible single-quarter assembly bottlenecks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#273247]/30 flex items-center justify-between text-xs">
              <span className="text-[#bacac5] font-mono">10-K Reference: p. 12-14</span>
              <span className="text-[#57f1db] font-medium flex items-center gap-1 cursor-pointer hover:underline">
                Inspect Citation <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>

          {/* Risk 2 */}
          <div className="rounded-xl bg-[#161b2b] p-4 shadow-sm flex flex-col justify-between relative group hover:bg-[#1a1f30] transition border border-[#273247]/50">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#bacac5] uppercase tracking-wider font-mono">CLUSTER #02</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-[#ffb4ab] bg-[#93000a]/20">
                  High Materiality
                </span>
              </div>
              <h3 className="text-sm text-[#dee1f9] font-semibold mb-2">
                Digital Services Regulatory Scrutiny
              </h3>
              <p className="text-xs text-[#bacac5] leading-relaxed">
                Heightened anti-steering enforcement under the European Union Digital Markets Act (DMA) mandates alternative app marketplace sideloading and external payment rails. Management acknowledges these mandates may compress high-margin App Store take rates (historically 15%-30%) and elevate cybersecurity liability.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#273247]/30 flex items-center justify-between text-xs">
              <span className="text-[#bacac5] font-mono">10-K Reference: p. 17-19</span>
              <span className="text-[#57f1db] font-medium flex items-center gap-1 cursor-pointer hover:underline">
                Inspect Citation <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>

          {/* Risk 3 */}
          <div className="rounded-xl bg-[#161b2b] p-4 shadow-sm flex flex-col justify-between relative group hover:bg-[#1a1f30] transition border border-[#273247]/50">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#bacac5] uppercase tracking-wider font-mono">CLUSTER #03</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-[#57f1db] bg-[#2dd4bf]/10">
                  Low-Moderate
                </span>
              </div>
              <h3 className="text-sm text-[#dee1f9] font-semibold mb-2">
                Foreign Exchange Volatility
              </h3>
              <p className="text-xs text-[#bacac5] leading-relaxed">
                Approximately 58% of FY2023 net sales were generated outside the United States. Sustained USD strength exerts downward pressure on translated top-line results and crimps foreign consumer purchasing power in Europe and emerging markets, partially offset by rolling cash-flow hedging derivatives.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#273247]/30 flex items-center justify-between text-xs">
              <span className="text-[#bacac5] font-mono">10-K Reference: p. 23-25</span>
              <span className="text-[#57f1db] font-medium flex items-center gap-1 cursor-pointer hover:underline">
                Inspect Citation <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Source Citations & Audit Verification Panel */}
      <div className="rounded-xl bg-[#161b2b] p-6 shadow-sm flex flex-col gap-4 border border-[#273247]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded bg-[#57f1db]"></div>
            <div>
              <h2 className="font-semibold text-base text-[#dee1f9]">Source Citations &amp; Audit Verification</h2>
              <p className="text-xs text-[#bacac5]">Immutable links to filed SEC EDGAR Form 10-K records and footnotes</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-[#57f1db]">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Cryptographically Verified
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Citation Card 1 */}
          <div className="rounded-lg bg-[#1a1f30] p-4 flex flex-col justify-between shadow-sm border border-[#273247]/40">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#57f1db] bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/20">
                  CITATION #01
                </span>
                <span className="text-xs text-[#bacac5]">Page 31-35</span>
              </div>
              <h4 className="text-xs text-[#dee1f9] font-semibold mb-2">
                Item 7. Management's Discussion and Analysis — Results of Operations
              </h4>
              <div className="rounded bg-[#080d1d] p-3 text-xs text-[#bacac5] border-l-2 border-[#57f1db] italic">
                &ldquo;Total net sales decreased 3% or $11.0 billion during 2023 compared to 2022, primarily driven by lower net sales of Mac and iPad, partially offset by higher net sales of Services. Products gross margin expanded primarily due to cost efficiencies...&rdquo;
              </div>
            </div>
            <div className="mt-3 pt-2 flex items-center justify-between text-xs border-t border-[#273247]/30">
              <span className="text-[#bacac5]">Target Anchor: <span className="font-mono text-white">#item-7-results-ops</span></span>
              <a 
                className="text-[#57f1db] hover:underline flex items-center gap-1"
                href="https://www.sec.gov/edgar/searchedgar/companysearch"
                target="_blank"
                rel="noreferrer"
              >
                Open EDGAR Source <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Citation Card 2 */}
          <div className="rounded-lg bg-[#1a1f30] p-4 flex flex-col justify-between shadow-sm border border-[#273247]/40">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#57f1db] bg-[#2dd4bf]/10 px-2 py-0.5 rounded border border-[#2dd4bf]/20">
                  CITATION #02
                </span>
                <span className="text-xs text-[#bacac5]">Page 52</span>
              </div>
              <h4 className="text-xs text-[#dee1f9] font-semibold mb-2">
                Note 10 — Debt and Financing Commitments
              </h4>
              <div className="rounded bg-[#080d1d] p-3 text-xs text-[#bacac5] border-l-2 border-[#b9c8dc] italic">
                &ldquo;As of September 30, 2023, the Company had outstanding term debt of $111.1 billion across fixed-rate notes with maturities ranging from 2024 to 2062. The effective interest rates ranged from 0.00% to 4.85%.&rdquo;
              </div>
            </div>
            <div className="mt-3 pt-2 flex items-center justify-between text-xs border-t border-[#273247]/30">
              <span className="text-[#bacac5]">Target Anchor: <span className="font-mono text-white">#note-10-term-debt</span></span>
              <a 
                className="text-[#57f1db] hover:underline flex items-center gap-1"
                href="https://www.sec.gov/edgar/searchedgar/companysearch"
                target="_blank"
                rel="noreferrer"
              >
                Open EDGAR Source <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Tool Activity Execution Trace (Expandable) */}
      <div className="rounded-xl bg-[#161b2b] shadow-sm overflow-hidden border border-[#273247]/50">
        <button
          className="w-full p-4 flex items-center justify-between bg-[#161b2b] hover:bg-[#1a1f30] transition text-left cursor-pointer"
          onClick={() => setTraceOpen(!traceOpen)}
          type="button"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#57f1db] text-[20px]">terminal</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#dee1f9] font-semibold">Agent Tool Activity Execution Trace</span>
                <span className="px-1.5 py-0.5 rounded bg-[#2dd4bf]/10 text-[#57f1db] font-mono text-[10px] font-medium border border-[#2dd4bf]/20">3 Tools Invoked</span>
              </div>
              <p className="text-xs text-[#bacac5]">Deterministic tool execution log &amp; parameter resolution history</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#bacac5]">
              {traceOpen ? 'Hide Trace' : 'Show Trace (124ms)'}
            </span>
            <span className={`material-symbols-outlined text-[18px] text-[#bacac5] transition-transform duration-200 ${traceOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>
        </button>

        {traceOpen && (
          <div className="p-4 pt-0 bg-[#161b2b] border-t border-[#273247]/20">
            <div className="space-y-2 mt-3 font-mono text-xs">
              {/* Step 1 */}
              <div className="p-2.5 rounded bg-[#080d1d] flex flex-col md:flex-row md:items-center justify-between gap-2 border border-[#273247]/40">
                <div className="flex items-center gap-2">
                  <span className="text-[#57f1db] font-bold">01</span>
                  <span className="text-[#b9c8dc] font-medium">vector_search_filings</span>
                  <span className="text-[#bacac5] truncate">(&quot;AAPL&quot;, query: &quot;Item 1A risk factors and cyber regulatory&quot;, top_k: 8)</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[#bacac5] text-[11px]">
                  <span className="text-[#57f1db] flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#57f1db]"></span> 200 OK</span>
                  <span>latency: 42ms</span>
                </div>
              </div>
              {/* Step 2 */}
              <div className="p-2.5 rounded bg-[#080d1d] flex flex-col md:flex-row md:items-center justify-between gap-2 border border-[#273247]/40">
                <div className="flex items-center gap-2">
                  <span className="text-[#57f1db] font-bold">02</span>
                  <span className="text-[#b9c8dc] font-medium">compute_financial_ratios</span>
                  <span className="text-[#bacac5] truncate">(balance_sheet_2023, income_stmt_2023, cf_stmt_2023, peer_group: &quot;SP500_TECH&quot;)</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[#bacac5] text-[11px]">
                  <span className="text-[#57f1db] flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#57f1db]"></span> 200 OK</span>
                  <span>latency: 18ms</span>
                </div>
              </div>
              {/* Step 3 */}
              <div className="p-2.5 rounded bg-[#080d1d] flex flex-col md:flex-row md:items-center justify-between gap-2 border border-[#273247]/40">
                <div className="flex items-center gap-2">
                  <span className="text-[#57f1db] font-bold">03</span>
                  <span className="text-[#b9c8dc] font-medium">verify_audit_opinions</span>
                  <span className="text-[#bacac5] truncate">(auditor: &quot;Ernst &amp; Young LLP&quot;, target_opinion: &quot;Unqualified / Clean&quot;)</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[#bacac5] text-[11px]">
                  <span className="text-[#57f1db] flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#57f1db]"></span> 200 OK</span>
                  <span>latency: 64ms</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Analyst Grounding Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#080d1d] text-xs text-[#bacac5] border border-[#273247]/40">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#57f1db]">terminal</span>
          <span>FinPilot Quantitative Grounding Engine v4.2 • Deterministic Parse Hash: <code className="text-white font-mono">0x9f4a...29b1</code></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-white cursor-pointer">SEC EDGAR Direct Feed</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Methodology Documentation</span>
        </div>
      </div>
    </div>
  );
};
