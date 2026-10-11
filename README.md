# 💰 FinPilot AI — Financial Research & Analysis Agent

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![LangGraph](https://img.shields.io/badge/LangGraph-Agent%20Workflows-orange?style=flat-square)
![RAG](https://img.shields.io/badge/RAG-ChromaDB-green?style=flat-square)
![Gemini](https://img.shields.io/badge/Gemini-1.5%20Flash-purple?style=flat-square)
![Streamlit](https://img.shields.io/badge/Streamlit-Dashboard-red?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)

---

## 📌 Project Overview

**FinPilot AI** is an LLM-powered financial research and analysis agent that uses **Retrieval-Augmented Generation (RAG)** to retrieve insights from financial reports and answer complex business queries.

The system combines a **LangGraph ReAct agent** with four callable tools — financial ratio calculations, company performance comparison, risk analysis, and RAG-based document retrieval — to deliver analyst-grade financial intelligence through a conversational interface.

---

## 🏗️ Architecture

```
User Query → Streamlit UI → LangGraph Agent (StateGraph)
                                    ↓
                             Router (ReAct Loop)
                    ┌────────────┬────────────┬────────────┐
                    ↓            ↓            ↓            ↓
              RAG Tool     Ratio Tool  Compare Tool  Risk Tool
                    ↓
              ChromaDB ← PDF Reports (Apple, Microsoft, Tesla, ...)
                    ↓
              Gemini 1.5 Flash → Synthesized Answer + Citations
```

---

## 🚀 Features

- **RAG Pipeline** — Ingest PDF financial reports (10-K, annual reports) into ChromaDB; retrieve relevant excerpts with page-level citations
- **AI Agent Workflows** — LangGraph `StateGraph` with a ReAct reasoning loop and multi-turn memory
- **Tool Calling** — LLM selects and calls tools dynamically:
  - `retrieve_financial_insights` — RAG search with company filtering
  - `calculate_financial_ratios` — Net margin, ROE, ROA, Current Ratio, D/E, Asset Turnover, Gross Margin
  - `compare_companies` — Side-by-side comparison of any two companies
  - `analyze_risk` — Credit, market, operational, and liquidity risk analysis
- **Personal Budget Dashboard** — CSV-based spending analysis with AI-powered advice
- **Built-in Demo Data** — Synthetic Apple, Microsoft, and Tesla reports pre-loaded for instant demo

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.8+ |
| Agent Framework | LangGraph (StateGraph + ReAct) |
| LLM | Google Gemini 1.5 Flash |
| RAG | ChromaDB + sentence-transformers |
| Document Parsing | pypdf + LangChain splitters |
| ML (Budget Tab) | scikit-learn (Naive Bayes categorization) |
| Dashboard | Streamlit + Plotly |

---

## 📁 Repository Structure

```
finpilot-ai/
├── app/
│   ├── agent/
│   │   ├── graph.py          # LangGraph StateGraph definition
│   │   ├── state.py          # AgentState TypedDict
│   │   └── tools.py          # 4 LangChain @tool definitions
│   └── rag/
│       ├── embeddings.py     # sentence-transformers wrapper
│       ├── ingestor.py       # PDF ingestion + ChromaDB storage
│       └── retriever.py      # Vector search + citation formatting
├── data/
│   ├── reports/              # Place PDF reports here
│   └── chroma_db/            # Persisted vector store (auto-created)
├── streamlit_app.py          # Main UI (2-tab Streamlit app)
├── generate_reports.py       # Synthetic report generator (demo data)
├── generate_data.py          # Transaction data generator
├── requirements.txt
└── .env.example
```

---

## ⚡ Quick Start

```bash
# 1. Clone and install
git clone https://github.com/yourusername/finpilot-ai
cd finpilot-ai
pip install -r requirements.txt

# 2. Set up your API key
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
# Get a free key at: https://aistudio.google.com/

# 3. (Optional) Pre-seed demo data
python generate_reports.py

# 4. Run the app
streamlit run streamlit_app.py
```

---

## 💬 Example Queries

- *"What are Apple's main risk factors in their 2023 annual report?"*
- *"Compare Apple and Microsoft's profit margins"*
- *"Calculate ratios: revenue $384B, net income $97B, assets $353B, equity $62B, current assets $143B, current liabilities $145B, debt $111B"*
- *"Analyze Tesla's liquidity risk"*
- *"What is Microsoft's Azure revenue growth rate?"*

---

## 👤 Author

**Kartik Akhade**

---

## 📄 License

MIT License
