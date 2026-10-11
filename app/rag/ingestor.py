"""
FinPilot AI — Document Ingestor
Handles PDF ingestion, chunking, and storing in ChromaDB.
"""

import os
from pathlib import Path
from typing import List

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.documents import Document

from app.rag.embeddings import get_embedding_model

# Path to the persistent ChromaDB directory
CHROMA_PATH = Path(__file__).resolve().parents[2] / "data" / "chroma_db"
REPORTS_PATH = Path(__file__).resolve().parents[2] / "data" / "reports"

COLLECTION_NAME = "finpilot_reports"


def get_vector_store() -> Chroma:
    """Load (or create) the ChromaDB vector store."""
    embedding_model = get_embedding_model()
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embedding_model,
        persist_directory=str(CHROMA_PATH),
    )


def ingest_pdf(file_path: str, company: str, year: str) -> int:
    """
    Ingest a single PDF financial report into ChromaDB.

    Args:
        file_path: Absolute path to the PDF file.
        company:   Company name (e.g. "Apple").
        year:      Report year (e.g. "2023").

    Returns:
        Number of chunks ingested.
    """
    loader = PyPDFLoader(file_path)
    raw_docs = loader.load()

    # Tag each page with metadata before chunking
    for doc in raw_docs:
        doc.metadata["company"] = company
        doc.metadata["year"] = year
        doc.metadata["source"] = os.path.basename(file_path)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks: List[Document] = splitter.split_documents(raw_docs)

    vector_store = get_vector_store()
    vector_store.add_documents(chunks)

    return len(chunks)


def ingest_text(text: str, company: str, year: str, source: str = "synthetic") -> int:
    """
    Ingest raw text (e.g., synthetically generated report) into ChromaDB.
    Useful for demos without real PDFs.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    chunks = splitter.create_documents(
        texts=[text],
        metadatas=[{"company": company, "year": year, "source": source}],
    )

    vector_store = get_vector_store()
    vector_store.add_documents(chunks)

    return len(chunks)


def list_ingested_documents() -> List[dict]:
    """Return a list of unique documents already in the vector store."""
    try:
        vector_store = get_vector_store()
        collection = vector_store._collection
        results = collection.get(include=["metadatas"])
        seen = set()
        docs = []
        for meta in results["metadatas"]:
            key = (meta.get("company", "Unknown"), meta.get("year", "Unknown"), meta.get("source", ""))
            if key not in seen:
                seen.add(key)
                docs.append({"company": meta.get("company"), "year": meta.get("year"), "source": meta.get("source")})
        return docs
    except Exception:
        return []
