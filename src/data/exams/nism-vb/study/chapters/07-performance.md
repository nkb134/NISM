---
chapter: 7
title: Performance of Mutual Funds
topicCode: PRF
marks: 12
difficulty: medium
priority: 1
estimatedMinutes: 16
---

## 🎯 Summary Card

MF performance = **NAV-based total return**, including dividend reinvestment. Three time horizons matter: **point-to-point return, rolling return, CAGR**. Compare against the scheme's **benchmark + peer group**. Risk-adjusted measures: **Sharpe, Sortino, Information Ratio**. Past performance is **not a guarantee** of future returns. **Tracking error** for index funds; **alpha** for active funds.

## 📖 Core Content

### Return measures

| Measure | Formula | Use |
|---|---|---|
| **Absolute return** | (End NAV − Begin NAV) / Begin NAV | < 1 year |
| **CAGR (compounded)** | (End/Begin)^(1/n) − 1 | ≥ 1 year |
| **Annualised return** | Same as CAGR for simple growth | Standard for ≥ 1 yr |
| **Rolling return** | CAGR computed for many overlapping windows | Removes start-date dependency |
| **Point-to-point** | CAGR between two specified dates | Headline number |

> **Rolling returns are more honest** than point-to-point for comparing funds — they show consistency, not luck of dates.

### Benchmark comparison

Every scheme's SID specifies a benchmark. Performance vs benchmark = **alpha**.

```
Alpha = Scheme return − Benchmark return        (simplistic)
Alpha (Jensen's) = Rp − [Rf + β × (Rm − Rf)]   (CAPM-adjusted)
```

Positive alpha = outperformance. Persistent positive alpha = manager skill (rare).

### Risk-adjusted measures

| Measure | Formula | Higher = better |
|---|---|---|
| **Sharpe** | (Rp − Rf) / σ_p | ✓ |
| **Sortino** | (Rp − Rf) / Downside σ | ✓ (penalises only downside) |
| **Information Ratio** | (Rp − Rb) / Tracking Error | ✓ (active management efficiency) |
| **Treynor** | (Rp − Rf) / β_p | ✓ (well-diversified portfolios) |

### Tracking error (for index funds + ETFs)

```
Tracking Error = σ of (Scheme return − Benchmark return)
```

**Lower TE = better tracking.** Causes: cash holdings (for redemptions), fund expenses, rebalancing lag.

### Beta (β)

- Sensitivity of scheme's returns to benchmark.
- β = 1 → moves with benchmark.
- β > 1 → more volatile.
- β < 1 → less volatile.

### R² (coefficient of determination)

- 0 to 1.
- High R² (close to 1) → scheme returns closely tracked by benchmark.
- Low R² → scheme has significant idiosyncratic factors (active calls, sector bets).

### Standard deviation (σ)

Total volatility of scheme returns. Lower = more stable.

### Scheme classification + comparison

Compare schemes within the **same category** (e.g. Large Cap with Large Cap). SEBI's October 2017 categorisation framework prevents apples-to-oranges comparisons.

### Star ratings + research

Third-party rating agencies (CRISIL, Morningstar, Value Research) publish star ratings. Methodologies vary; **don't rely on a single rating**. Combine with:
- Long-term consistency (5+ year track record)
- Manager tenure + skill
- Expense ratio
- Risk-adjusted returns
- Portfolio quality (concentration, sector bets, churn)

### Past performance disclaimer

SEBI mandates: "Past performance may or may not be sustained in the future." Distributors must NOT use past performance as the SOLE selling point. Returns are NOT guaranteed.

### Blockbuster example: SIP vs Lump-sum

SIP returns (XIRR) are different from lump-sum CAGR — calculated using **XIRR** (Internal Rate of Return for irregular cash flows). Most fund factsheets show both.

```
XIRR = IRR adjusted for irregular cash flow timing (e.g. monthly SIP installments + final redemption)
```

### Performance reporting timelines

- **Daily NAV** — disclosed by 11 PM on AMC + AMFI sites.
- **Monthly factsheet** — published within 10 days of month-end.
- **Half-yearly portfolio disclosure** — within 30 days of half-year-end.
- **Annual report** — within 4 months of FY-end.

## 🧠 Memory Hooks

- **CAGR for ≥1 yr; absolute for <1 yr; XIRR for SIP.**
- **Rolling returns > point-to-point** for honest comparison.
- **Alpha > 0 = outperformance** vs benchmark.
- **Sharpe = total risk; Treynor = systematic; Sortino = downside only; IR = active vs benchmark efficiency.**
- **Tracking error LOWER = better** for index funds.
- **β = 1 moves with benchmark; > 1 more volatile.**
- **Past performance is NOT a guarantee** — SEBI mandate.
- **NAV by 11 PM daily; factsheet within 10 days; half-yearly disclosure within 30 days.**
