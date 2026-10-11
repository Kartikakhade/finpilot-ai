"""
FinPilot AI — Vector Store Retriever
Retrieves relevant chunks from ChromaDB based on a query.
"""

from typing import List, Optional
from langchain_chroma import Chroma
from langchain_core.documents import Document

from app.rag.ingestor import get_vector_store


def retrieve(
    query: str,
    company: Optional[str] = None,
    top_k: int = 5,
) -> List[Document]:
    """
    Retrieve the top-k most relevant document chunks for a query.

    Args:
        query:   The natural language query.
        company: Optional company name to filter results.
        top_k:   Number of chunks to return.

    Returns:
        List of LangChain Document objects with content + metadata.
    """
    vector_store: Chroma = get_vector_store()

    search_kwargs = {"k": top_k}
    if company:
        search_kwargs["filter"] = {"company": company}

    retriever = vector_store.as_retriever(search_kwargs=search_kwargs)
    docs = retriever.invoke(query)
    return docs


def format_retrieved_docs(docs: List[Document]) -> str:
    """
    Format retrieved documents into a readable string for the LLM prompt.
    Includes source citations.
    """
    if not docs:
        return "No relevant information found in the uploaded financial reports."

    formatted = []
    for i, doc in enumerate(docs, 1):
        company = doc.metadata.get("company", "Unknown")
        year = doc.metadata.get("year", "Unknown")
        page = doc.metadata.get("page", "?")
        source = doc.metadata.get("source", "")
        formatted.append(
            f"[Source {i}: {company} {year} Report, Page {page} ({source})]\n"
            f"{doc.page_content.strip()}"
        )

    return "\n\n---\n\n".join(formatted)
