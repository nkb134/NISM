---
title: Number Sheet — every formula + threshold for XV
---

# XV Number Sheet

Print this. Memorise.

## Equity formulas

```
EPS                = Net Profit / Weighted avg shares
Diluted EPS        = Net Profit / (Shares + potential dilution)
P/E                = Price / EPS
P/B                = Price / Book value per share
Book value/share   = (Equity − Pref capital) / Shares outstanding
Dividend yield     = Annual DPS / Market price
Market cap         = Price × Shares outstanding
Free-float mcap    = Price × Free-float shares (excludes promoter, locked)
```

## Debt formulas

```
YTM (approx) ≈ [C + (FV − P) / n] / [(FV + P) / 2]   where C=annual coupon, P=price, FV=face value, n=years to maturity
Modified duration ≈ Macaulay duration / (1 + YTM)
% bond price change ≈ −Modified duration × Δyield + (½) × Convexity × (Δyield)²
Clean price = Dirty price − Accrued interest
```

## Cash flow + ratios

```
EBITDA              = EBIT + D&A
Free Cash Flow      = CFO − Capex
Working capital     = Current Assets − Current Liabilities
Cash conversion     = CFO / Net Profit       (target: ≥ 1)

Profitability:
  Gross margin      = Gross Profit / Revenue
  Operating margin  = EBIT / Revenue
  Net margin        = PAT / Revenue
  ROE               = PAT / Avg Equity
  ROCE              = EBIT / (Equity + Long-term Debt)
  ROA               = Net Income / Avg Total Assets

Liquidity:
  Current ratio     = CA / CL
  Quick ratio       = (CA − Inventory) / CL
  Cash ratio        = Cash / CL

Leverage:
  D/E               = Total Debt / Equity
  Net debt          = Total Debt − Cash
  Interest coverage = EBIT / Interest expense

Efficiency:
  Asset turnover    = Revenue / Avg Total Assets
  Inventory days    = Inventory × 365 / COGS
  DSO               = Receivables × 365 / Revenue
  DPO               = Payables × 365 / COGS
  Working cap cycle = DSO + Days inventory − DPO

Valuation:
  EV                = Market cap + Net debt + Minority interest − Investments
  EV/EBITDA         = EV / EBITDA
  EV/Sales          = EV / Revenue
  PEG               = P/E / Earnings growth %
```

## DuPont decomposition

```
ROE = (Net Profit / Sales) × (Sales / Assets) × (Assets / Equity)
    = Net Profit Margin × Asset Turnover × Equity Multiplier
```

## CAPM + WACC

```
CAPM:    r_e = Rf + β × (Rm − Rf)
WACC:    WACC = (E/V) × r_e + (D/V) × r_d × (1 − T)

Rf typical India: 7% (10-yr G-Sec)
Equity Risk Premium typical: 5-7%
```

## DCF + DDM

```
DCF:                EV = Σ FCFt / (1+WACC)^t  +  Terminal Value / (1+WACC)^N
                    Equity Value = EV − Net Debt
                    Per-share = Equity / Diluted Shares

Terminal Value (Gordon)  = FCF(N+1) / (WACC − g)
Terminal Value (Multiple) = EBITDA(N) × Exit multiple

DDM (Gordon):       V = D₁ / (r − g)         (constraint: g < r)
Zero growth:        V = D / r
Two-stage:          high-growth phase + stable phase
```

## Risk + return

```
Holding period return  = (End − Begin + Income) / Begin
CAGR                   = (End / Begin)^(1/n) − 1
Geometric ≤ Arithmetic mean (always)

σ (std dev)            = sqrt of variance — total risk
β (beta)               = Cov(Rs, Rm) / Var(Rm) — systematic risk

Sharpe                 = (Rp − Rf) / σ_p
Treynor                = (Rp − Rf) / β_p
Jensen's α             = Rp − [Rf + β(Rm − Rf)]
Information Ratio      = (Rp − Rb) / Tracking Error
Sortino                = (Rp − target) / Downside Deviation

Portfolio var (2 assets):
σ_p² = w_A² σ_A² + w_B² σ_B² + 2 w_A w_B ρ σ_A σ_B
```

## Corporate actions adjustments

```
Adjustment factor = Price BEFORE / Price AFTER
New strike   = Old strike × (1 / factor)
New lot size = Old lot size × factor

Bonus 1:1   → factor 2 → strikes halved, lots doubled
Split 5:1   → factor 5 → strikes ÷ 5, lots × 5
Dividend > 5% of stock price → adjust strike; otherwise ignore for derivatives

TERP (rights issue):
TERP = (Cum-rights price × existing + Issue price × new) / Total shares

Buyback tax: 23.296% paid by company; tax-free in shareholder's hands
Open offer trigger: 25% stake crossing under SAST
```

## Regulatory thresholds (RA-specific)

| Item | Threshold |
|---|---|
| Net worth — individual RA | **₹1 lakh** |
| Net worth — body corporate RA | **₹25 lakh** |
| Records retention | **5 years** |
| Personal-trade cooling-off (around recommendation) | ~30 days before, 5 days after |
| PIT max penalty | **₹25 cr or 3× profit** (whichever higher) |
| PFUTP max penalty | Same — ₹25 cr or 3× ill-gotten gain |
| Mandatory cert for RA | **NISM-XV** |
| Trading window closed pre-results | **T-7 to T+2** typically |

## Industry classifications

| Class | Examples | Outperforms |
|---|---|---|
| **Cyclical** | Auto, steel, cement, capex | Expansion phase |
| **Defensive** | FMCG, pharma, utilities | Contraction phase |
| **Growth** | Tech, fintech, healthcare | Rate-cut phase |
| **Value** | PSUs, traditional manufacturing | Late-cycle |

## Indicator quick lookup

| Indicator | Range | OB / OS |
|---|---|---|
| RSI | 0-100 | > 70 OB; < 30 OS |
| Stochastic | 0-100 | > 80 OB; < 20 OS |
| Williams %R | -100 to 0 | > -20 OB; < -80 OS |
| ADX | 0-100 | > 25 strong trend |
| Bollinger | mean ± 2σ | Touches band = stretched |

## Fibonacci levels

23.6%, 38.2%, **50%**, 61.8%, 78.6%

## Macro indicator sources

- **GDP, IIP, CPI, PMI, Unemployment** — NSO / MoSPI
- **Repo, CRR, SLR, OMO** — RBI
- **Fiscal deficit, Current account deficit** — Union Budget / RBI
- **WPI** — DPIIT
- **PMI** — S&P Global / IHS Markit

## Top 4 chapters by weight (= 49% of exam)

1. Ch 15 Technical Analysis — 15%
2. Ch 8 Financial Analysis — 12%
3. Ch 10 Valuation — 12%
4. Ch 14 Legal & Regulatory — 10%
