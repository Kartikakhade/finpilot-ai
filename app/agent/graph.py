"""
FinPilot AI — LangGraph Agent Graph
Wires together the StateGraph with nodes, conditional edges,
tool calling, and in-memory conversation checkpointing.
"""

import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver

from app.agent.state import AgentState
from app.agent.tools import TOOLS

load_dotenv()


def _get_llm():
    """Initialize and return the LLM with all tools bound."""
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.8-flash",
        temperature=0.2,
        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )
    return llm.bind_tools(TOOLS)


# ── System prompt ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are FinPilot AI, an expert financial research and analysis agent.

You have access to four powerful tools:
1. **retrieve_financial_insights** — Search uploaded annual reports/10-Ks via RAG
2. **calculate_financial_ratios** — Compute financial ratios from raw numbers
3. **compare_companies** — Side-by-side comparison of two companies
4. **analyze_risk** — Structured risk analysis (credit, market, operational, liquidity)

Guidelines:
- Always use retrieve_financial_insights first when asked about a specific company
- Use calculate_financial_ratios whenever the user provides or you find financial figures
- Cite your sources (company name, year, page) when using retrieved information
- Be quantitative: include numbers, percentages, and ratios in your answers
- Structure answers clearly with headers, bullet points, and tables where appropriate
- If information is not in the uploaded reports, say so clearly — do not hallucinate

You are precise, data-driven, and professional. Think like a financial analyst."""


# ── Node: LLM Reasoner ────────────────────────────────────────────────────────

def llm_node(state: AgentState) -> dict:
    """
    Core reasoning node. The LLM decides whether to call tools or produce
    a final answer based on the conversation messages.
    """
    from langchain_core.messages import SystemMessage

    llm_with_tools = _get_llm()
    messages = state["messages"]

    # Prepend system prompt on first turn
    if not any(isinstance(m, SystemMessage) for m in messages):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(messages)

    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


# ── Build the graph ───────────────────────────────────────────────────────────

def build_graph():
    """
    Construct and compile the LangGraph StateGraph.

    Graph topology:
        START → llm_node → [tools_condition] → tools_node → llm_node (loop)
                                             ↘ END (when no tool call needed)
    """
    graph_builder = StateGraph(AgentState)

    # Nodes
    graph_builder.add_node("llm", llm_node)
    graph_builder.add_node("tools", ToolNode(tools=TOOLS))

    # Edges
    graph_builder.add_edge(START, "llm")
    graph_builder.add_conditional_edges(
        "llm",
        tools_condition,  # built-in: routes to "tools" if tool calls exist, else END
    )
    graph_builder.add_edge("tools", "llm")  # after tools run, LLM synthesizes answer

    # Compile with in-memory checkpointer (enables multi-turn memory)
    memory = MemorySaver()
    graph = graph_builder.compile(checkpointer=memory)

    return graph


# Singleton — built once and reused across Streamlit reruns
_graph = None


def get_graph():
    """Return the compiled graph (singleton)."""
    global _graph
    if _graph is None:
        _graph = build_graph()
    return _graph
