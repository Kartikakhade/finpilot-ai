import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  PieChart,
  FolderKanban,
  TableProperties,
  ChevronLeft,
  ChevronRight,
  Database,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  geminiModel?: string;
  geminiConfigured?: boolean;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  geminiModel = 'gemini-1.5-flash',
  geminiConfigured = false,
}: SidebarProps) {
  const navItems = [
    {
      to: '/research',
      label: 'Financial Research',
      icon: Sparkles,
      tag: 'Agent',
    },
    {
      to: '/budget',
      label: 'Personal Budget',
      icon: PieChart,
      tag: 'Analytics',
    },
    {
      to: '/knowledge-base',
      label: 'Knowledge Base',
      icon: FolderKanban,
      tag: 'RAG',
    },
    {
      to: '/analytics',
      label: 'Filing Analytics',
      icon: TableProperties,
      tag: '10-K',
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#080d1d] border-r border-[#273247]/60 z-50 flex flex-col justify-between transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="flex flex-col">
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#273247]/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-[#25293a] border border-[#273247] flex items-center justify-center text-[#57f1db] font-semibold text-xs shrink-0 shadow-sm">
              FP
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm tracking-tight text-[#dee1f9]">
                    FinPilot
                  </span>
                  <span className="text-[10px] font-bold text-[#57f1db] tracking-wider uppercase bg-[#2dd4bf]/10 px-1 rounded border border-[#2dd4bf]/20">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-[#bacac5]/70 truncate">Financial Intelligence Suite</span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="text-[#bacac5] hover:text-[#dee1f9] p-1 rounded hover:bg-[#1a1f30] transition cursor-pointer"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Navigation items */}
        <div className="px-3 pt-4">
          {!collapsed && (
            <div className="text-[10px] font-semibold uppercase text-[#bacac5]/60 tracking-wider mb-2 px-2">
              Intelligence Workspaces
            </div>
          )}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors ${
                      isActive
                        ? 'bg-[#25293a] text-[#57f1db] font-semibold border-l-2 border-[#57f1db]'
                        : 'text-[#bacac5] hover:bg-[#1a1f30] hover:text-[#dee1f9]'
                    }`
                  }
                  title={item.label}
                >
                  <Icon size={17} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Telemetry */}
      <div className="border-t border-[#273247]/40 p-3 flex flex-col gap-2 bg-[#080d1d]">
        {!collapsed ? (
          <>
            <div className="rounded bg-[#161b2b] p-2.5 border border-[#273247]/50 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#bacac5] font-medium">{geminiModel}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2dd4bf] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#57f1db]"></span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#bacac5]/70 font-mono">
                <span className="flex items-center gap-1">
                  <Database size={11} className="text-[#57f1db]" /> Backend API
                </span>
                <span className={geminiConfigured ? 'text-[#57f1db]' : 'text-[#f59e0b]'}>
                  {geminiConfigured ? 'Connected' : 'Key Ready'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-[#25293a] border border-[#273247] flex items-center justify-center text-[10px] text-[#bacac5] font-bold">
                  SA
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[11px] text-[#dee1f9] font-medium truncate">Senior Analyst</span>
                  <span className="text-[9px] text-[#bacac5] uppercase tracking-wider">Institutional</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center py-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${geminiConfigured ? 'bg-[#57f1db]' : 'bg-[#f59e0b]'}`}
              title={`Status: ${geminiConfigured ? 'Connected' : 'Ready'}`}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
