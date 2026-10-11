"""
FinPilot AI — LangChain Tool Definitions
Four tools the LLM agent can call:
  1. retrieve_financial_insights  — RAG search over uploaded reports
  2. calculate_financial_ratios   — Compute key financial ratios
  3. compare_companies            — Compare two companies on a metric
  4. analyze_risk                 — Risk scoring for a company
"""

from langchain_core.tools import tool
from app.rag.retriever import retrieve, format_retrieved_docs


# ── TOOL 1: RAG-based document retrieval ─────────────────────────────────────

@tool
def retrieve_financial_insights(query: str, company: str = "") -> str:
    """
    Search uploaded financial reports (10-K, annual reports, earnings releases)
    using RAG and return relevant excerpts with page-level citations.

    Use this tool whenever the user asks about a company's performance,
    strategy, revenue, expenses, management discussion, or any information
    that would be found in a financial report.

    Args:
        query:   The specific financial question or topic to look up.
        company: Optional — company name to restrict the search to one company's reports.
                 Leave empty to search across all uploaded reports.

    Returns:
        Formatted text excerpts with source citations.
    """
    docs = retrieve(query=query, company=company if company else None, top_k=5)
    return format_retrieved_docs(docs)


# ── TOOL 2: Financial ratio calculator ───────────────────────────────────────

@tool
def calculate_financial_ratios(
    revenue: float,
    net_income: float,
    total_assets: float,
    total_equity: float,
    current_assets: float,
    current_liabilities: float,
    total_debt: float,
    cogs: float = 0.0,
) -> str:
    """
    Calculate key financial ratios from raw balance sheet and income statement figures.

    Use this tool when the user provides financial numbers and asks for ratio analysis,
    or when you have extracted numbers from a report and need to compute ratios.

    Args:
        revenue:              Total revenue / net sales (annual).
        net_income:           Net income / profit after tax.
        total_assets:         Total assets from the balance sheet.
        total_equity:         Total shareholders' equity.
        current_assets:       Current assets (cash + receivables + inventory).
        current_liabilities:  Current liabilities (due within 12 months).
        total_debt:           Total short-term + long-term debt.
        cogs:                 Cost of goods sold (optional, for gross margin).

    Returns:
        A formatted table of all computed ratios with interpretation.
    """
    results = {}

    # Profitability ratios
    results["Net Profit Margin"] = (
        f"{(net_income / revenue * 100):.2f}%"
        if revenue else "N/A"
    )
    gross_profit = revenue - cogs
    results["Gross Margin"] = (
        f"{(gross_profit / revenue * 100):.2f}%"
        if revenue and cogs else "N/A (COGS not provided)"
    )
    results["Return on Equity (ROE)"] = (
        f"{(net_income / total_equity * 100):.2f}%"
        if total_equity else "N/A"
    )
    results["Return on Assets (ROA)"] = (
        f"{(net_income / total_assets * 100):.2f}%"
        if total_assets else "N/A"
    )

    # Liquidity ratios
    current_ratio = current_assets / current_liabilities if current_liabilities else None
    results["Current Ratio"] = (
        f"{current_ratio:.2f} ({'[Healthy]' if current_ratio and current_ratio >= 1.5 else '[Tight]' if current_ratio and current_ratio >= 1.0 else '[At Risk]'})"
        if current_ratio is not None else "N/A"
    )

    # Leverage ratios
    de_ratio = total_debt / total_equity if total_equity else None
    results["Debt-to-Equity (D/E)"] = (
        f"{de_ratio:.2f} ({'[Low]' if de_ratio and de_ratio <= 1.0 else '[Moderate]' if de_ratio and de_ratio <= 2.0 else '[High]'})"
        if de_ratio is not None else "N/A"
    )

    # Efficiency ratios
    results["Asset Turnover"] = (
        f"{(revenue / total_assets):.2f}x"
        if total_assets else "N/A"
    )

    # Format output
    lines = ["## Financial Ratios", ""]
    lines.append(f"{'Ratio':<30} {'Value'}")
    lines.append("-" * 50)
    for name, value in results.items():
        lines.append(f"{name:<30} {value}")

    lines.append("")
    lines.append("**Interpretation Guide:**")
    lines.append("- Current Ratio >= 1.5 = Healthy | >= 1.0 = Tight | < 1.0 = At Risk")
    lines.append("- D/E <= 1.0 = Low leverage | <= 2.0 = Moderate | > 2.0 = High")
    lines.append("- ROE > 15% is generally considered strong")

    return "\n".join(lines)


# ── TOOL 3: Company comparison ────────────────────────────────────────────────

@tool
def compare_companies(company_a: str, company_b: str, metric: str) -> str:
    """
    Compare two companies on a given financial metric using information
    retrieved from uploaded financial reports.

    Use this tool when the user asks to compare, benchmark, or contrast
    two companies — e.g., "Compare Apple and Microsoft's revenue growth".

    Args:
        company_a: First company name (e.g. "Apple").
        company_b: Second company name (e.g. "Microsoft").
        metric:    The financial metric or topic to compare
                   (e.g. "revenue", "profit margin", "debt levels", "risk factors").

    Returns:
        Side-by-side comparison text with data from each company's reports.
    """
    query = f"{metric} financial performance analysis"

    docs_a = retrieve(query=query, company=company_a, top_k=3)
    docs_b = retrieve(query=query, company=company_b, top_k=3)

    context_a = format_retrieved_docs(docs_a)
    context_b = format_retrieved_docs(docs_b)

    output = [
        f"## Company Comparison: {company_a} vs {company_b}",
        f"**Metric:** {metric}",
        "",
        f"### {company_a}",
        context_a,
        "",
        f"### {company_b}",
        context_b,
        "",
        "*(Use the above excerpts to synthesize a comparative analysis)*",
    ]

    return "\n".join(output)


# ── TOOL 4: Risk analysis ─────────────────────────────────────────────────────

@tool
def analyze_risk(company: str, risk_type: str = "overall") -> str:
    """
    Perform a risk analysis for a company using data from uploaded financial reports.
    Retrieves risk factor sections and scores liquidity, debt, and operational risks.

    Use this tool when the user asks about risks, vulnerabilities, red flags,
    or the financial health/stability of a company.

    Args:
        company:   Company name to analyze (e.g. "Tesla").
        risk_type: Type of risk to focus on. Options:
                   "credit"      — debt load, interest coverage, credit ratings
                   "market"      — revenue volatility, competition, macro exposure
                   "operational" — supply chain, regulatory, management risks
                   "liquidity"   — cash position, current ratio, burn rate
                   "overall"     — comprehensive multi-dimensional risk summary

    Returns:
        A structured risk report with qualitative and quantitative insights.
    """
    risk_queries = {
        "credit": f"{company} debt obligations credit risk interest coverage",
        "market": f"{company} market risk competition revenue volatility macroeconomic",
        "operational": f"{company} operational risk supply chain regulatory compliance",
        "liquidity": f"{company} liquidity cash flow working capital current ratio",
        "overall": f"{company} risk factors financial risks annual report",
    }

    query = risk_queries.get(risk_type, risk_queries["overall"])
    docs = retrieve(query=query, company=company, top_k=5)
    context = format_retrieved_docs(docs)

    risk_labels = {
        "credit": "[Credit Risk]",
        "market": "[Market Risk]",
        "operational": "[Operational Risk]",
        "liquidity": "[Liquidity Risk]",
        "overall": "[Overall Risk]",
    }

    output = [
        f"## {risk_labels.get(risk_type, '[Risk Analysis]')}: {company}",
        "",
        "### Relevant Excerpts from Financial Reports",
        context,
        "",
        "### Risk Assessment Framework",
        "The LLM will synthesize the above excerpts to produce:",
        "- **Risk Rating**: Low / Medium / High / Critical",
        "- **Key Risk Drivers**: Top 3–5 factors identified",
        "- **Mitigating Factors**: What the company is doing to manage risk",
        "- **Recommendation**: Investor/analyst action points",
    ]

    return "\n".join(output)


# ── Tool registry (imported by graph.py) ─────────────────────────────────────

TOOLS = [
    retrieve_financial_insights,
    calculate_financial_ratios,
    compare_companies,
    analyze_risk,
]
