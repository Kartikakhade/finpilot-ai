"""
FinPilot AI — RAG Embeddings Wrapper
Uses sentence-transformers (local, free) for generating embeddings.
"""

from langchain_huggingface import HuggingFaceEmbeddings


def get_embedding_model():
    """
    Returns a LangChain-compatible embedding model.
    Uses all-MiniLM-L6-v2 — lightweight, fast, and runs locally.
    """
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
