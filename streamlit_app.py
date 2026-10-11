"""
FinPilot AI — Main Streamlit Application
Two tabs:
  Tab 1: 💬 Financial Research Chat  (LangGraph + RAG + Tool Calling)
  Tab 2: 📊 Personal Budget Dashboard (existing CSV-based analysis)
"""

import os
import uuid
import tempfile

from dotenv import load_dotenv
load_dotenv()

import streamlit as st
import pandas as pd
import plotly.express as px
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

# ── Page config ───────────────────────────────────────────────────────────────

st.set_page_config(
    page_title="FinPilot AI",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ────────────────────────────────────────────────────────────────

st.markdown("""
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

  /* Dark gradient background */
  .stApp { background: linear-gradient(135deg, #0a0e1a 0%, #0f172a 50%, #0a1628 100%); }

  /* Sidebar */
  section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
    border-right: 1px solid rgba(99,179,237,0.15);
  }

  /* Chat messages */
  .stChatMessage { border-radius: 12px; margin-bottom: 8px; }

  /* Metric cards */
  [data-testid="metric-container"] {
    background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9));
    border: 1px solid rgba(99,179,237,0.2);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);
  }

  /* Tool call expander */
  .tool-trace {
    background: rgba(30,41,59,0.6);
    border: 1px solid rgba(99,179,237,0.15);
    border-radius: 8px;
    padding: 12px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #94a3b8;
  }

  /* Primary button */
  .stButton>button {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  .stButton>button:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(99,102,241,0.4);
  }

  /* Tab styling */
  .stTabs [data-baseweb="tab"] {
    font-weight: 600;
    font-size: 15px;
    color: #94a3b8;
  }
  .stTabs [aria-selected="true"] { color: #60a5fa !important; }

  /* Divider */
  hr { border-color: rgba(99,179,237,0.15) !important; }
</style>
""", unsafe_allow_html=True)

# ── Header ─────────────────────────────────────────────────────────────────────

st.markdown("""
<div style='text-align:center; padding: 24px 0 8px 0;'>
  <h1 style='font-size:2.8rem; font-weight:700;
             background: linear-gradient(135deg, #60a5fa, #a78bfa, #34d399);
             -webkit-background-clip: text; -webkit-text-fill-color: transparent;
             margin-bottom: 4px;'>
    💰 FinPilot AI
  </h1>
  <p style='color:#94a3b8; font-size:1.05rem; margin:0;'>
    Financial Research &amp; Analysis Agent — Powered by LangGraph · RAG · Gemini
  </p>
</div>
""", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# ── Sidebar ────────────────────────────────────────────────────────────────────

with st.sidebar:
    st.markdown("### ⚙️ Configuration")

    env_key = os.getenv("GOOGLE_API_KEY", "")
    api_key = st.text_input(
        "Google AI API Key",
        value=env_key,
        type="password",
        placeholder="AIza...",
        help="Get your free key at https://aistudio.google.com/",
    )
    if api_key:
        os.environ["GOOGLE_API_KEY"] = api_key

    st.divider()

    # Budget profile (for Tab 2)
    st.markdown("### 📋 Budget Profile")
    monthly_income = st.number_input("Monthly income ($)", min_value=0, value=4000)
    goal_name = st.text_input("Savings goal name", "Emergency Fund")
    goal_amount = st.number_input("Target amount ($)", value=3000)

    st.divider()
    st.markdown("""
    <div style='color:#64748b; font-size:12px; line-height:1.6;'>
      <b style='color:#94a3b8;'>Tech Stack</b><br>
      🔷 LangGraph · ReAct Agent<br>
      🟣 RAG · ChromaDB<br>
      🟢 Gemini 1.5 Flash<br>
      🔵 Streamlit · Plotly
    </div>
    """, unsafe_allow_html=True)


# ── Tabs ───────────────────────────────────────────────────────────────────────

tab_chat, tab_budget = st.tabs(["💬 Financial Research Chat", "📊 Personal Budget Dashboard"])


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 1 — FINANCIAL RESEARCH CHAT
# ═══════════════════════════════════════════════════════════════════════════════

with tab_chat:

    # ── Session state init ────────────────────────────────────────────────────
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
    if "thread_id" not in st.session_state:
        st.session_state.thread_id = str(uuid.uuid4())
    if "docs_loaded" not in st.session_state:
        st.session_state.docs_loaded = False

    # ── Layout: left = docs panel, right = chat ───────────────────────────────
    col_docs, col_chat = st.columns([1, 2], gap="large")

    # ── Left panel: Document management ──────────────────────────────────────
    with col_docs:
        st.markdown("#### 📁 Knowledge Base")
        st.caption("Upload financial PDFs or use built-in demo data")

        # Demo data button
        if st.button("⚡ Load Demo Data (Apple, Microsoft, Tesla)", use_container_width=True):
            with st.spinner("Ingesting synthetic financial reports into ChromaDB..."):
                try:
                    from generate_reports import generate_all_reports
                    generate_all_reports()
                    st.session_state.docs_loaded = True
                    st.success("✅ Demo reports loaded!")
                except Exception as e:
                    st.error(f"Error: {e}")

        st.divider()

        # PDF upload
        st.markdown("**Or upload your own PDFs:**")
        uploaded_pdfs = st.file_uploader(
            "Upload financial reports (PDF)",
            type=["pdf"],
            accept_multiple_files=True,
            label_visibility="collapsed",
        )

        if uploaded_pdfs:
            company_name = st.text_input("Company name", placeholder="e.g. Amazon")
            report_year = st.text_input("Report year", placeholder="e.g. 2023")

            if st.button("📥 Ingest PDFs", use_container_width=True):
                if not company_name or not report_year:
                    st.warning("Enter company name and year first.")
                else:
                    from app.rag.ingestor import ingest_pdf
                    total_chunks = 0
                    with st.spinner(f"Ingesting {len(uploaded_pdfs)} PDF(s)..."):
                        for pdf in uploaded_pdfs:
                            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                                tmp.write(pdf.read())
                                tmp_path = tmp.name
                            n = ingest_pdf(tmp_path, company_name, report_year)
                            os.unlink(tmp_path)
                            total_chunks += n
                    st.success(f"✅ Ingested {total_chunks} chunks from {len(uploaded_pdfs)} PDF(s)")
                    st.session_state.docs_loaded = True

        st.divider()

        # Show loaded documents
        st.markdown("**Loaded documents:**")
        try:
            from app.rag.ingestor import list_ingested_documents
            docs = list_ingested_documents()
            if docs:
                for doc in docs:
                    st.markdown(
                        f"<div style='background:rgba(30,41,59,0.5);border:1px solid rgba(99,179,237,0.15);"
                        f"border-radius:8px;padding:8px 12px;margin-bottom:6px;font-size:13px;'>"
                        f"🏢 <b>{doc['company']}</b> · {doc['year']}<br>"
                        f"<span style='color:#64748b;font-size:11px;'>{doc['source']}</span>"
                        f"</div>",
                        unsafe_allow_html=True,
                    )
            else:
                st.info("No documents loaded yet. Click 'Load Demo Data' to get started.")
        except Exception:
            st.info("Load demo data or upload PDFs to begin.")

        st.divider()

        # Example queries
        st.markdown("**💡 Try asking:**")
        examples = [
            "What are Apple's main risk factors?",
            "Compare Apple and Microsoft's profit margins",
            "Calculate ratios: revenue $384B, net income $97B, assets $353B, equity $62B, current assets $143B, current liabilities $145B, debt $111B",
            "Analyze Tesla's liquidity risk",
            "What is Microsoft's Azure growth rate?",
        ]
        for ex in examples:
            if st.button(ex, use_container_width=True, key=f"ex_{ex[:20]}"):
                st.session_state.pending_query = ex

    # ── Right panel: Chat interface ───────────────────────────────────────────
    with col_chat:
        st.markdown("#### 🤖 Chat with FinPilot")

        # Display chat history
        chat_container = st.container(height=520)
        with chat_container:
            if not st.session_state.chat_history:
                st.markdown("""
                <div style='text-align:center; padding:60px 20px; color:#475569;'>
                  <div style='font-size:3rem; margin-bottom:16px;'>🤖</div>
                  <div style='font-size:1.1rem; font-weight:600; color:#64748b;'>
                    Ask me anything about financial reports
                  </div>
                  <div style='font-size:0.9rem; margin-top:8px;'>
                    Load demo data → then ask about Apple, Microsoft, or Tesla
                  </div>
                </div>
                """, unsafe_allow_html=True)

            for msg in st.session_state.chat_history:
                role = msg["role"]
                content = msg["content"]
                tool_trace = msg.get("tool_trace", [])

                with st.chat_message(role, avatar="🤖" if role == "assistant" else "👤"):
                    st.markdown(content)

                    # Show tool calls collapsible
                    if tool_trace:
                        with st.expander(f"🔧 Tool calls ({len(tool_trace)})", expanded=False):
                            for trace in tool_trace:
                                st.markdown(
                                    f"<div class='tool-trace'>"
                                    f"<b style='color:#60a5fa;'>▶ {trace['tool']}</b><br>"
                                    f"{trace['output'][:600]}{'...' if len(trace['output']) > 600 else ''}"
                                    f"</div>",
                                    unsafe_allow_html=True,
                                )

        # Chat input
        query = st.chat_input("Ask about financial reports, ratios, company comparisons, risk analysis...")

        # Handle example query injection
        if "pending_query" in st.session_state:
            query = st.session_state.pop("pending_query")

        if query:
            if not os.getenv("GOOGLE_API_KEY") and not api_key:
                st.warning("⚠️ Please enter your Google AI API key in the sidebar to use the chat.")
            else:
                # Add user message to history
                st.session_state.chat_history.append({"role": "user", "content": query})

                with st.spinner("🤔 FinPilot is thinking..."):
                    try:
                        from app.agent.graph import get_graph
                        graph = get_graph()

                        config = {"configurable": {"thread_id": st.session_state.thread_id}}
                        input_msg = {"messages": [HumanMessage(content=query)]}

                        # Stream through the graph
                        tool_trace = []
                        final_response = ""

                        for event in graph.stream(input_msg, config=config, stream_mode="values"):
                            messages = event.get("messages", [])
                            for msg in messages:
                                if isinstance(msg, ToolMessage):
                                    # Capture tool call results
                                    t_out = msg.content
                                    if isinstance(t_out, list):
                                        t_out = "".join(p.get("text", "") if isinstance(p, dict) else str(p) for p in t_out)
                                    tool_trace.append({
                                        "tool": msg.name,
                                        "output": str(t_out),
                                    })
                                elif isinstance(msg, AIMessage) and not msg.tool_calls:
                                    resp_content = msg.content
                                    if isinstance(resp_content, list):
                                        resp_content = "".join(p.get("text", "") if isinstance(p, dict) else str(p) for p in resp_content)
                                    final_response = str(resp_content)

                        if not final_response:
                            final_response = "I was unable to generate a response. Please try again."

                        st.session_state.chat_history.append({
                            "role": "assistant",
                            "content": final_response,
                            "tool_trace": tool_trace,
                        })

                    except Exception as e:
                        st.session_state.chat_history.append({
                            "role": "assistant",
                            "content": f"⚠️ Error: {str(e)}\n\nCheck your API key and that demo data is loaded.",
                        })

                st.rerun()

        # Clear chat button
        if st.session_state.chat_history:
            if st.button("🗑️ Clear conversation", key="clear_chat"):
                st.session_state.chat_history = []
                st.session_state.thread_id = str(uuid.uuid4())
                st.rerun()


# ═══════════════════════════════════════════════════════════════════════════════
# TAB 2 — PERSONAL BUDGET DASHBOARD (original functionality, enhanced)
# ═══════════════════════════════════════════════════════════════════════════════

with tab_budget:

    st.markdown("### 📊 Personal Budget Dashboard")
    st.caption("Upload a transaction or profile CSV to see your financial health breakdown.")

    with st.expander("📘 How it works", expanded=False):
        st.markdown("""
        **Step 1** — Set your income & goal in the sidebar\n
        **Step 2** — Upload a CSV (transaction data or profile data)\n
        **Step 3** — See your spending breakdown, health metrics & goal timeline\n
        \n**No data?** Download the sample CSV below.
        """)
        sample_csv = """date,description,amount,category
2024-03-01,WHOLE FOODS MARKET,54.32,Food
2024-03-01,RENT PAYMENT,1450.00,Housing
2024-03-02,SHELL FUEL,58.21,Transport
2024-03-03,NETFLIX,15.99,Entertainment
2024-03-04,CHASE VISA PAYMENT,200.00,Debt repayment
2024-03-05,SAVINGS TRANSFER,100.00,Savings
2024-03-06,CHIPOTLE,13.45,Food
2024-03-07,CVS PHARMACY,22.10,Healthcare
2024-03-08,UBER,17.25,Transport
2024-03-09,AMAZON,35.99,Other
"""
        st.download_button("⬇️ Download sample_transactions.csv", sample_csv,
                           "sample_transactions.csv", "text/csv")

    st.divider()

    uploaded_file = st.file_uploader("Upload your CSV", type=["csv"], key="budget_csv")
    if not uploaded_file:
        st.info("👆 Upload a CSV above to see your dashboard.")
        st.stop()

    df = pd.read_csv(uploaded_file)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    st.success(f"✅ Loaded {len(df):,} rows · {len(df.columns)} columns")

    # Detect dataset type
    transaction_signals = {"amount", "description", "category", "merchant"}
    profile_signals = {"monthly_income_usd", "monthly_expenses_usd", "credit_score"}

    if len(profile_signals.intersection(df.columns)) >= 2:
        dataset_type = "profile"
    elif len(transaction_signals.intersection(df.columns)) >= 1:
        dataset_type = "transaction"
    else:
        dataset_type = "unknown"

    # ── Profile dataset ───────────────────────────────────────────────────────
    if dataset_type == "profile":
        st.markdown("#### 🔍 Detected: Profile Dataset")
        n_show = st.slider("Users to analyze", 100, min(len(df), 10000), 1000)
        df_sample = df.head(n_show)

        if "monthly_income_usd" in df.columns and "monthly_expenses_usd" in df.columns:
            df_sample = df_sample.copy()
            df_sample["surplus"] = df_sample["monthly_income_usd"] - df_sample["monthly_expenses_usd"]
            c1, c2, c3 = st.columns(3)
            c1.metric("Avg Income", f"${df_sample['monthly_income_usd'].mean():,.0f}")
            c2.metric("Avg Expenses", f"${df_sample['monthly_expenses_usd'].mean():,.0f}")
            c3.metric("Avg Surplus", f"${df_sample['surplus'].mean():,.0f}")

        left, right = st.columns(2)
        with left:
            if "credit_score" in df.columns:
                fig = px.histogram(df_sample, x="credit_score", nbins=20,
                                   color_discrete_sequence=["#3b82f6"],
                                   title="Credit Score Distribution")
                fig.add_vline(x=580, line_dash="dash", line_color="#ef4444", annotation_text="Poor")
                fig.add_vline(x=740, line_dash="dash", line_color="#22c55e", annotation_text="Excellent")
                fig.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
                                  font_color="#e2e8f0")
                st.plotly_chart(fig, use_container_width=True)
        with right:
            if "region" in df.columns:
                region_counts = df_sample["region"].value_counts().reset_index()
                region_counts.columns = ["region", "count"]
                fig2 = px.pie(region_counts, values="count", names="region", hole=0.4,
                              color_discrete_sequence=px.colors.sequential.Blues_r,
                              title="Users by Region")
                fig2.update_layout(paper_bgcolor="rgba(0,0,0,0)", font_color="#e2e8f0")
                st.plotly_chart(fig2, use_container_width=True)

        st.dataframe(df_sample.head(20), use_container_width=True)

    # ── Transaction dataset ───────────────────────────────────────────────────
    elif dataset_type == "transaction":
        st.markdown("#### 🔍 Detected: Transaction Dataset")

        all_cols = ["-- select --"] + list(df.columns)
        auto_amt = next((c for c in df.columns if "amount" in c), "-- select --")
        auto_cat = next((c for c in df.columns if "categ" in c), "-- select --")

        ca, cb = st.columns(2)
        with ca:
            col_amount = st.selectbox("Amount column", all_cols,
                                      index=all_cols.index(auto_amt) if auto_amt in all_cols else 0)
        with cb:
            col_category = st.selectbox("Category column", all_cols,
                                        index=all_cols.index(auto_cat) if auto_cat in all_cols else 0)

        if col_amount == "-- select --" or col_category == "-- select --":
            st.info("Select your columns above.")
            st.stop()

        df = df.rename(columns={col_amount: "amount", col_category: "category"})
        df["amount"] = pd.to_numeric(
            df["amount"].astype(str).str.replace(r"[$,]", "", regex=True), errors="coerce"
        ).fillna(0)

        total_spend = df["amount"].sum()
        surplus = monthly_income - total_spend
        savings = df[df["category"].str.lower().str.contains("saving", na=False)]["amount"].sum()
        savings_rate = round(savings / max(monthly_income, 1) * 100, 1)
        debt = df[df["category"].str.lower().str.contains("debt|loan|repay", na=False)]["amount"].sum()
        dti = round(debt / max(monthly_income, 1) * 100, 1)
        months_to_goal = round(goal_amount / max(surplus, 1), 1)

        st.divider()
        st.markdown("#### 📊 Financial Health Dashboard")
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("💵 Total Spend", f"${total_spend:,.0f}")
        m2.metric("💰 Surplus", f"${surplus:,.0f}")
        m3.metric("📈 Savings Rate", f"{savings_rate}%",
                  delta="✅ On track" if savings_rate >= 20 else "⚠️ Below 20%")
        m4.metric("🎯 Months to Goal", f"{months_to_goal} mo")

        st.divider()
        l2, r2 = st.columns(2)
        category_totals = (df.groupby("category")["amount"].sum()
                           .reset_index().sort_values("amount", ascending=False))

        with l2:
            fig_donut = px.pie(category_totals, values="amount", names="category", hole=0.45,
                               color_discrete_sequence=px.colors.sequential.Blues_r,
                               title="Spending Breakdown")
            fig_donut.update_layout(paper_bgcolor="rgba(0,0,0,0)", font_color="#e2e8f0")
            st.plotly_chart(fig_donut, use_container_width=True)

        with r2:
            fig_goal = px.bar(x=[goal_name], y=[months_to_goal],
                              color_discrete_sequence=["#6366f1"],
                              title=f"{goal_name}: {months_to_goal} months away",
                              labels={"y": "Months", "x": ""})
            fig_goal.add_hline(y=6, line_dash="dash", line_color="#f59e0b",
                               annotation_text="6-month target")
            fig_goal.update_layout(paper_bgcolor="rgba(0,0,0,0)", font_color="#e2e8f0")
            st.plotly_chart(fig_goal, use_container_width=True)

        st.divider()

        # AI Budget Advice (bonus — uses LLM directly, no RAG needed)
        if os.getenv("GOOGLE_API_KEY") or api_key:
            with st.expander("🤖 Get AI Budget Advice", expanded=False):
                if st.button("Generate personalized advice"):
                    with st.spinner("Analyzing your budget..."):
                        try:
                            llm = ChatGoogleGenerativeAI(
                                model="gemini-3.8-flash",
                                temperature=0.3,
                                google_api_key=api_key or os.getenv("GOOGLE_API_KEY"),
                            )
                            summary = (
                                f"Monthly income: ${monthly_income}. Total spending this period: ${total_spend:.0f}. "
                                f"Surplus: ${surplus:.0f}. Savings rate: {savings_rate}%. "
                                f"Debt-to-income: {dti}%. Goal: save ${goal_amount} for '{goal_name}' "
                                f"(estimated {months_to_goal} months). "
                                f"Top categories: {category_totals.head(3).to_dict(orient='records')}"
                            )
                            response = llm.invoke([HM(content=
                                f"You are a friendly financial advisor. Based on this budget data, "
                                f"give 5 specific, actionable tips. Be concrete and encouraging.\n\n{summary}"
                            )])
                            advice_text = response.content
                            if isinstance(advice_text, list):
                                advice_text = "".join(p.get("text", "") if isinstance(p, dict) else str(p) for p in advice_text)
                            st.markdown(str(advice_text))
                        except Exception as e:
                            st.error(f"Error: {e}")

        st.markdown("#### Category Breakdown")
        st.dataframe(category_totals, use_container_width=True)
        st.markdown("#### Raw Data (first 20 rows)")
        st.dataframe(df.head(20), use_container_width=True)

    else:
        st.warning(
            "⚠️ Could not detect dataset type. Expected columns:\n"
            "- Transaction: `amount`, `category`, `description`\n"
            "- Profile: `monthly_income_usd`, `credit_score`"
        )
        st.write("Detected columns:", list(df.columns))
        st.dataframe(df.head(10), use_container_width=True)
