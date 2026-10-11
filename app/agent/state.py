"""
FinPilot AI — Agent State Definition
Defines the shared state that flows through all LangGraph nodes.
"""

from typing import Annotated, List, TypedDict
import operator
from langchain_core.messages import BaseMessage


class AgentState(TypedDict):
    """
    The state object passed between every node in the LangGraph graph.

    Fields:
        messages:          Full conversation history (auto-appended via operator.add).
        query:             The current user query.
        retrieved_context: Raw text retrieved from ChromaDB via RAG.
        tool_outputs:      Dict of tool name → output string for this turn.
        final_answer:      The synthesized answer to return to the user.
        companies_mentioned: List of company names detected in the query.
    """

    messages: Annotated[List[BaseMessage], operator.add]
    query: str
    retrieved_context: str
    tool_outputs: dict
    final_answer: str
    companies_mentioned: List[str]
