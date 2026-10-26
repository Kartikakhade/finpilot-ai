import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Loader2,
  ShieldAlert,
  Scale,
  Calculator,
  TrendingUp,
  RotateCcw,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../../services/api';
import type { ChatMessage, ToolTraceItem } from '../../types';

interface ResearchWorkspaceProps {
  apiKey: string;
  geminiModel: string;
}

export function ResearchWorkspace({ apiKey, geminiModel: _geminiModel }: ResearchWorkspaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTrace, setExpandedTrace] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const res = await api.sendChatMessage(textToSend, threadId || undefined, apiKey);
      if (res.thread_id) setThreadId(res.thread_id);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tool_trace: res.tool_trace,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ ${err.response?.data?.detail || err.message || 'Error executing agent.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterCards = [
    {
      title: 'Compare AAPL vs MSFT',
      desc: 'Evaluate 2023 operating margins, free cash flow conversion, and balance sheet leverage.',
      icon: Scale,
      query: 'Compare Apple and Microsoft in 2023 on operating margins, FCF conversion, and net debt leverage.',
    },
    {
      title: 'DuPont Analysis on AAPL',
      desc: 'Decompose Return on Equity into net margin, asset turnover, and equity multiplier.',
      icon: Calculator,
      query: 'Perform a full DuPont Analysis for Apple FY2023. Show net profit margin, asset turnover, and leverage multiplier.',
    },
    {
      title: 'Tesla 10-K Risk Factors',
      desc: 'Inspect Item 1A risks regarding battery supply chain concentration and autonomous driving.',
      icon: ShieldAlert,
      query: 'Summarize the top risks in Tesla 2023 10-K regarding supply chains, raw materials, and autonomous driving regulatory scrutiny.',
    },
    {
      title: 'Solvency & Debt Ratios',
      desc: 'Calculate current ratio, quick ratio, and debt-to-equity for all ingested filings.',
      icon: TrendingUp,
      query: 'Compute solvency and liquidity ratios for Apple and Microsoft using their 2023 filings.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Screen when no messages */}
          {messages.length === 0 ? (
            <div className="pt-6 space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161b2b] border border-[#273247] text-xs text-[#57f1db] font-mono">
                  <Sparkles size={12} />
                  <span>LangGraph Autonomous ReAct Agent</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#dee1f9]">
                  Institutional Financial Research
                </h1>
                <p className="text-sm text-[#bacac5] max-w-xl mx-auto">
                  Execute quantitative SEC 10-K audits, calculate balance sheet ratios, and synthesize 
                  cross-company disclosures with audited citations.
                </p>
              </div>

              {/* Bento Grid Starter Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {starterCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(card.query)}
                      className="text-left p-4 rounded-xl bg-[#121a2b] border border-[#273247]/70 hover:border-[#2dd4bf]/60 hover:bg-[#162035] transition-all group flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#1a2336] flex items-center justify-center text-[#57f1db] group-hover:scale-105 transition-transform">
                          <Icon size={16} />
                        </div>
                        <span className="text-[10px] uppercase font-mono text-[#bacac5]/50 group-hover:text-[#57f1db]">
                          Execute ↗
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-[#dee1f9] group-hover:text-[#57f1db] transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-[11px] text-[#bacac5]/70 mt-1 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-[#162035] border border-[#273247] flex items-center justify-center text-[#57f1db] shrink-0 mt-0.5">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#2dd4bf] text-[#00201c] font-medium ml-auto'
                          : msg.error
                          ? 'bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab]'
                          : 'bg-[#121a2b] border border-[#273247]/70 text-[#dee1f9]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>

                    {/* Tool Traces if Assistant message */}
                    {!isUser && msg.tool_trace && msg.tool_trace.length > 0 && (
                      <div className="rounded-lg bg-[#080d1d] border border-[#273247]/60 overflow-hidden">
                        <button
                          onClick={() =>
                            setExpandedTrace(expandedTrace === msg.id ? null : msg.id)
                          }
                          className="w-full px-3 py-2 text-left flex items-center justify-between text-[11px] text-[#bacac5] hover:bg-[#121a2b] transition cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 font-mono">
                            <CheckCircle2 size={13} className="text-[#57f1db]" />
                            <span>Executed {msg.tool_trace.length} agent reasoning steps</span>
                          </div>
                          {expandedTrace === msg.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>

                        {expandedTrace === msg.id && (
                          <div className="px-3 pb-3 space-y-2 border-t border-[#273247]/30 pt-2 font-mono text-[10px]">
                            {msg.tool_trace.map((step: ToolTraceItem, sIdx: number) => (
                              <div
                                key={sIdx}
                                className="p-2 rounded bg-[#161b2b] border border-[#273247]/40"
                              >
                                <div className="text-[#57f1db] font-semibold mb-1">
                                  ⚡ Tool: {step.tool}
                                </div>
                                <div className="text-[#bacac5]/80 max-h-32 overflow-y-auto whitespace-pre-wrap">
                                  {step.output}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <span className="text-[10px] text-[#bacac5]/50 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex gap-3.5 items-center text-xs text-[#bacac5]">
              <div className="w-8 h-8 rounded-lg bg-[#162035] border border-[#273247] flex items-center justify-center text-[#57f1db] shrink-0">
                <Loader2 size={15} className="animate-spin" />
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#121a2b] border border-[#273247]/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#57f1db] animate-pulse"></span>
                <span className="font-mono text-[11px]">Synthesizing SEC 10-K filings & calculating ratios...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Persistent Bottom Chat Input */}
      <div className="p-4 border-t border-[#273247]/40 bg-[#0e1323]/90 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-4xl mx-auto flex gap-2 items-center"
        >
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setThreadId('');
              }}
              className="p-2.5 rounded-xl border border-[#273247] text-[#bacac5] hover:text-[#dee1f9] hover:bg-[#1a1f30] transition cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw size={16} />
            </button>
          )}

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Ask financial research agent (e.g. Compare 2023 gross margins and free cash flow for Apple and Microsoft)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-xl bg-[#080d1d] border border-[#273247] text-xs text-white placeholder-[#bacac5]/50 focus:outline-none focus:border-[#57f1db] disabled:opacity-50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#2dd4bf] hover:bg-[#57f1db] text-[#00201c] text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer shadow-sm shadow-[#2dd4bf]/20"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            <span className="hidden sm:inline">Ask Agent</span>
          </button>
        </form>
      </div>
    </div>
  );
}
