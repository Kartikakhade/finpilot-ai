"""
FinPilot AI — Synthetic Financial Report Generator
Creates realistic fake annual report text for Apple, Microsoft, and Tesla.
Used to pre-seed ChromaDB so the app works demo-ready without real PDFs.
Run this script once: python generate_reports.py
"""

from app.rag.ingestor import ingest_text

REPORTS = {
    "Apple": {
        "year": "2023",
        "text": """
APPLE INC. — ANNUAL REPORT 2023

MANAGEMENT DISCUSSION AND ANALYSIS

Financial Highlights:
Apple Inc. reported total net sales of $383.3 billion for fiscal year 2023, compared to $394.3 billion in 2022,
a decrease of approximately 2.8%. Despite revenue headwinds from foreign exchange, the company maintained
robust profitability with net income of $97.0 billion, translating to a net profit margin of 25.3%.

Products Segment:
iPhone revenue was $200.6 billion (52.3% of total revenue), down from $205.5 billion. Mac revenue declined
to $29.4 billion from $40.2 billion, impacted by a weaker PC market. iPad revenue was $28.3 billion.
Wearables, Home and Accessories contributed $39.8 billion.

Services Segment:
Services revenue grew 9% year-over-year to $85.2 billion, now representing 22.2% of total revenue.
The App Store, Apple Music, iCloud, Apple TV+, and Apple Pay all contributed to growth.
Services gross margin was 70.8%, significantly higher than Products gross margin of 36.5%.

Balance Sheet Strength:
Cash and cash equivalents plus short-term investments totaled $166.6 billion.
Total assets: $352.6 billion. Total liabilities: $290.4 billion. Shareholders' equity: $62.1 billion.
Long-term debt: $95.3 billion. Current ratio: 0.99 (tight, managed through strong cash generation).

Capital Returns:
Apple returned over $89 billion to shareholders in fiscal 2023 through $15 billion in dividends
and $74 billion in share repurchases. The company has returned over $600 billion to shareholders since 2012.

RISK FACTORS

Macroeconomic Risk:
The company's performance is tied to global economic conditions. Consumer discretionary spending slowdowns
in key markets (China, Europe, USA) could materially impact iPhone and Mac sales. Currency fluctuations
created a $2.5 billion headwind in fiscal 2023.

Competition Risk:
Apple faces intense competition from Samsung, Google (Pixel), and Chinese OEMs in smartphones.
In services, Spotify, Netflix, and Amazon Prime compete directly with Apple's subscription offerings.
The company's premium pricing strategy could face pressure in price-sensitive emerging markets.

Regulatory and Legal Risk:
Apple faces antitrust investigations in the EU regarding the App Store's 30% commission structure.
The Digital Markets Act (DMA) may require Apple to allow third-party app stores, potentially reducing
App Store revenue by an estimated $10-15 billion over five years.

Supply Chain Risk:
Approximately 90% of Apple's manufacturing is concentrated in China. Geopolitical tensions between
the US and China pose significant operational risks. Apple is actively diversifying to India and Vietnam,
aiming to produce 25% of iPhones outside China by 2025.

FINANCIAL RATIOS (Fiscal 2023):
- Net Profit Margin: 25.3%
- Return on Equity (ROE): 156.1% (elevated due to share buybacks reducing equity base)
- Return on Assets (ROA): 27.5%
- Gross Margin: 44.1%
- Current Ratio: 0.99
- Debt-to-Equity: 1.53
- Revenue per Employee: ~$2.4 million
""",
    },
    "Microsoft": {
        "year": "2023",
        "text": """
MICROSOFT CORPORATION — ANNUAL REPORT FISCAL 2023

EXECUTIVE SUMMARY

Microsoft delivered exceptional results in fiscal year 2023, with total revenue of $211.9 billion,
an increase of 7% year-over-year ($198.3 billion in FY2022). Net income was $72.4 billion,
representing a net profit margin of 34.1%, one of the highest among large-cap technology companies.

SEGMENT PERFORMANCE

Intelligent Cloud:
Intelligent Cloud revenue was $87.9 billion, up 19% YoY, driven by Azure cloud computing growth of 27%.
Azure now has a 23% share of the global cloud infrastructure market (vs AWS at 32%, Google Cloud at 10%).
This segment is Microsoft's fastest-growing and highest-margin business.

Productivity and Business Processes:
Revenue of $69.3 billion, up 9%, driven by Microsoft 365 (Office), LinkedIn ($15.1 billion, +10%),
and Dynamics 365 CRM/ERP products. Microsoft 365 Commercial cloud revenue grew 17%.

More Personal Computing:
Revenue of $54.7 billion, down 9%, reflecting the global PC market decline (Windows OEM -25%)
and normalization of Xbox gaming revenues post-pandemic surge.

BALANCE SHEET AND LIQUIDITY

Total assets: $411.9 billion. Cash and short-term investments: $111.3 billion.
Total equity: $206.2 billion. Long-term debt: $41.9 billion.
Current assets: $184.3 billion. Current liabilities: $104.1 billion.
Current ratio: 1.77 — strong liquidity position.
Debt-to-Equity: 0.59 — conservative leverage; investment-grade credit rating (Aaa/AAA).

ARTIFICIAL INTELLIGENCE STRATEGY

Microsoft invested $13 billion in OpenAI, gaining exclusive cloud rights to GPT-4.
Copilot AI features are being embedded across Office 365, Azure, GitHub, and Dynamics.
Management estimates AI could add $100 billion in incremental annual revenue by 2027.
Azure AI services revenue grew 100%+ YoY in FY2023.

RISK FACTORS

Regulatory Risk:
The proposed $68.7 billion acquisition of Activision Blizzard faced regulatory scrutiny from the FTC
and UK CMA. EU approved the deal; concerns center on cloud gaming market concentration.
GDPR compliance costs increased to $2.1 billion in FY2023.

Cybersecurity Risk:
Microsoft disclosed a state-sponsored cyber attack (Storm-0558) that compromised Exchange Online
email accounts of 25 organizations, including US government entities. Security investment
increased by 34% to $20 billion annually.

Competition Risk:
AWS dominates cloud with 32% market share vs Azure's 23%. Google Cloud's aggressive pricing
in AI/ML workloads poses a competitive threat. Salesforce and ServiceNow compete in business applications.

FINANCIAL RATIOS (FY2023):
- Net Profit Margin: 34.1%
- Return on Equity (ROE): 35.1%
- Return on Assets (ROA): 17.6%
- Gross Margin: 69.0%
- Current Ratio: 1.77
- Debt-to-Equity: 0.59
- Asset Turnover: 0.51x
""",
    },
    "Tesla": {
        "year": "2023",
        "text": """
TESLA INC. — ANNUAL REPORT 2023

BUSINESS OVERVIEW

Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation
and storage systems, and related services. In 2023, Tesla delivered a record 1.81 million vehicles,
up 38% from 1.31 million in 2022, despite significant price reductions to stimulate demand.

FINANCIAL PERFORMANCE

Revenue: $96.8 billion (up 19% YoY from $81.5 billion).
Automotive revenue: $82.4 billion (85.1% of total).
Energy generation and storage: $6.0 billion (up 54% YoY).
Services and other: $8.3 billion (up 37% YoY).

Net income: $15.0 billion (down 23% from $19.4 billion in 2022).
Net profit margin: 15.5% (down from 23.8% in 2022).
The decline reflects aggressive price cuts: Tesla reduced Model 3/Y prices by 10-25% globally.

Automotive gross margin dropped from 28.5% to 18.2%, the lowest since 2019.
This is a critical concern for investors monitoring Tesla's pricing power.

BALANCE SHEET

Total assets: $106.6 billion. Cash and investments: $29.1 billion.
Total equity: $62.6 billion. Long-term debt: $2.0 billion (very low leverage).
Current assets: $49.6 billion. Current liabilities: $28.7 billion.
Current ratio: 1.73 — healthy liquidity.
Debt-to-Equity: 0.50 — conservative capital structure.

GROWTH INITIATIVES

Cybertruck: Mass production began in November 2023 at Gigafactory Texas.
Tesla expects Cybertruck to contribute significantly to revenue from 2025.

Next-Gen Vehicle ("Model 2"): Targeting a $25,000 price point for mass market.
Expected production at Gigafactory Mexico in 2025 using revolutionary unboxed manufacturing.

Full Self-Driving (FSD): FSD v12 uses end-to-end neural networks. Tesla plans to launch
robotaxi service in 2024. FSD software revenue ($300-$15,000 per vehicle) carries near-100% margins.

Energy Business: Megapack (utility-scale battery storage) had a record year with 14.7 GWh deployed.
Backlog exceeds $10 billion with Megapack demand outstripping supply.

RISK FACTORS

Margin Compression Risk:
Tesla's aggressive price cuts to maintain volume growth significantly compressed margins.
If price cuts continue without cost reductions, profitability could deteriorate further.
Competition from BYD (China), which surpassed Tesla in Q4 2023 global EV deliveries, poses risk.

Elon Musk Key-Person Risk:
Tesla is highly dependent on CEO Elon Musk. His involvement with X (Twitter), SpaceX, and xAI
raises concerns about time and attention. Musk's compensation package of $56 billion was
rejected by a Delaware court in January 2024, creating legal uncertainty.

Regulatory and Safety Risk:
NHTSA investigations into Autopilot/FSD following accidents have led to 2 million vehicle recalls.
Increased regulatory scrutiny could delay FSD commercialization or increase liability costs.

China Exposure:
China represents 22% of revenue ($21.3 billion). Geopolitical tensions, BYD competition,
and potential tariffs on Chinese-made Teslas (produced at Gigafactory Shanghai) are key risks.

Liquidity Risk (LOW):
With $29 billion in cash and only $2 billion in long-term debt, Tesla's liquidity risk is very low.
The company generates strong free cash flow ($4.4 billion in 2023) despite heavy capex.

FINANCIAL RATIOS (2023):
- Net Profit Margin: 15.5%
- Return on Equity (ROE): 24.0%
- Return on Assets (ROA): 14.1%
- Gross Margin: 18.2%
- Current Ratio: 1.73
- Debt-to-Equity: 0.50
- Asset Turnover: 0.91x
""",
    },
}


def generate_all_reports():
    """Ingest all synthetic reports into ChromaDB."""
    total = 0
    for company, data in REPORTS.items():
        print(f"Ingesting {company} {data['year']} report...", end=" ", flush=True)
        n = ingest_text(
            text=data["text"],
            company=company,
            year=data["year"],
            source=f"{company}_Annual_Report_{data['year']}_synthetic.txt",
        )
        print(f"[OK] {n} chunks")
        total += n
    print(f"\n[DONE] Total: {total} chunks across {len(REPORTS)} companies ingested into ChromaDB.")


if __name__ == "__main__":
    generate_all_reports()
