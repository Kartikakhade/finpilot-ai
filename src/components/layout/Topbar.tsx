import { useState } from 'react';
import {
  Key,
  ShieldCheck,
} from 'lucide-react';

interface TopbarProps {
  sidebarCollapsed: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  geminiConfigured: boolean;
  geminiModel: string;
}

export function Topbar({
  sidebarCollapsed,
  apiKey,
  onApiKeyChange,
  geminiConfigured,
  geminiModel,
}: TopbarProps) {
  const [showKeyInput, setShowKeyInput] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 h-14 bg-[#0e1323]/95 backdrop-blur-md z-40 border-b border-[#273247]/40 flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarCollapsed ? 'left-20' : 'left-60'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161b2b] border border-[#273247]/50 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#57f1db]"></span>
          <span className="font-semibold text-[#dee1f9]">{geminiModel}</span>
          <span className="text-[#bacac5]/40">|</span>
          <span className="text-[10px] text-[#bacac5] uppercase tracking-wider font-mono">
            Low Latency
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#25293a]/70 border border-[#273247]/40 text-[#bacac5] text-[11px] font-mono">
          <ShieldCheck size={13} className="text-[#57f1db]" />
          <span>Local ChromaDB Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* API Key Config trigger */}
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition cursor-pointer ${
            geminiConfigured || apiKey
              ? 'border-[#273247] text-[#bacac5] hover:text-[#dee1f9] bg-[#161b2b]'
              : 'border-[#f59e0b]/40 text-[#f59e0b] bg-[#f59e0b]/10'
          }`}
          title="Configure Google AI Studio API key"
        >
          <Key size={13} />
          <span>{geminiConfigured || apiKey ? 'API Key Configured' : 'Set Google Key'}</span>
        </button>

        {showKeyInput && (
          <div className="absolute top-14 right-6 bg-[#182337] border border-[#273247] rounded-lg p-3 shadow-2xl z-50 flex items-center gap-2 w-80 animate-in fade-in slide-in-from-top-1">
            <input
              type="password"
              placeholder="Google AI Studio key (AIzaSy...)"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="flex-1 px-2.5 py-1 bg-[#080d18] border border-[#273247] rounded text-xs text-white placeholder-[#bacac5]/40 focus:outline-none focus:border-[#2dd4bf]"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-2 py-1 bg-[#2dd4bf] text-[#00201c] rounded text-xs font-semibold hover:bg-[#57f1db] cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
