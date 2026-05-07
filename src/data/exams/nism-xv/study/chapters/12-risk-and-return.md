---
chapter: 12
title: Fundamentals of Risk and Return
topicCode: RTN
marks: 7
difficulty: medium
priority: 2
estimatedMinutes: 14
---

## 🎯 Summary Card

Return = capital gain + income; **measure as arithmetic mean (period-by-period) or geometric mean (compounded)**. Risk = variability; measured by **standard deviation, variance, beta, downside deviation, max drawdown**. Diversification reduces **unsystematic** (company / industry-specific) risk; **systematic** (market) risk remains. Risk-adjusted measures: **Sharpe (excess return / total risk), Treynor (excess / beta), Jensen's alpha, Information Ratio, Sortino**. **CAPM: r = Rf + β(Rm − Rf)**.

## 📖 Core Content

### Return measurement

- **Holding Period Return (HPR)** = (Ending value − Beginning value + Income) / Beginning value
- **Annualised return** for sub-year periods.
- **Arithmetic mean return** = simple average of period returns. Always ≥ geometric mean.
- **Geometric mean (CAGR)** = compound annual growth — what you actually earn over time.
```
CAGR = (Ending / Beginning)^(1/n) − 1
```

> Worked: ₹100 → ₹130 → ₹104 over 2 years. Period returns: +30%, −20%. Arithmetic = 5%; Geometric = (104/100)^(1/2) − 1 = **1.98%**. Geometric is the truth.

### Risk measures

| Measure | What it captures |
|---|---|
| **Variance / Std Deviation (σ)** | Total volatility around the mean |
| **Beta (β)** | Sensitivity to market moves; β > 1 = more volatile than market |
| **Downside deviation** | Volatility of negative returns only |
| **Value at Risk (VaR)** | Loss exceeded with X% probability over T days |
| **Max drawdown** | Largest peak-to-trough loss |
| **Tracking error** | Std dev of return − benchmark return |

### Systematic vs unsystematic risk

| Type | Examples | Diversifiable? |
|---|---|---|
| **Unsystematic (specific)** | Strike at one factory, regulatory action on one company, CEO exit | **Yes** (via diversification) |
| **Systematic (market)** | Recession, interest rate shock, war, pandemic | **No** — affects everyone |

**Total risk = Systematic + Unsystematic.** A diversified portfolio has only systematic risk left.

### Beta — the systematic risk metric

```
β = Cov(stock return, market return) / Var(market return)
```

| β | Behaviour |
|---|---|
| 0 | Uncorrelated with market |
| < 1 | Less volatile than market (defensive) |
| 1 | Moves with the market |
| > 1 | Amplifies market moves (aggressive) |
| < 0 | Inversely correlated (rare; some gold ETFs) |

### CAPM revisited

```
Expected Return = Rf + β × (Rm − Rf)

  Rf  = risk-free rate
  Rm  = expected market return
  β   = stock beta
  Rm − Rf = equity risk premium (5-7% in India)
```

### Risk-adjusted return measures

| Measure | Formula | Higher = better | Use case |
|---|---|---|---|
| **Sharpe** | (Rp − Rf) / σ_p | ✓ | Total-risk basis |
| **Treynor** | (Rp − Rf) / β_p | ✓ | When portfolio is well-diversified |
| **Jensen's α** | Rp − [Rf + β(Rm − Rf)] | ✓ (positive = beat CAPM expectation) | Active-manager skill |
| **Information Ratio** | (Rp − Rb) / Tracking Error | ✓ | Active management efficiency |
| **Sortino** | (Rp − target) / Downside Deviation | ✓ | Penalises only downside vol |

> Sharpe penalises ALL volatility (incl upside). Sortino penalises only downside — preferred for asymmetric strategies.

### Diversification math

```
Portfolio variance for 2 assets:
σ_p² = w_A² σ_A² + w_B² σ_B² + 2 w_A w_B ρ_AB σ_A σ_B

where ρ_AB = correlation between A and B
```

Lower correlation between assets → bigger diversification benefit. **Adding a low-correlation asset reduces portfolio risk even if its individual risk is high.**

### Modern Portfolio Theory (MPT) — Markowitz

- For any expected return level, there exists an **efficient portfolio** with the lowest risk.
- The set of all efficient portfolios = **Efficient Frontier**.
- Adding the risk-free asset → **Capital Market Line (CML)** — the best risk/return trade-off available.
- Optimal portfolio = where investor's indifference curve touches the efficient frontier (or CML).

### Risk preferences

- **Risk-averse** — needs higher expected return for higher risk.
- **Risk-neutral** — indifferent; cares only about expected return.
- **Risk-seeking** — accepts lower expected return for higher risk (rare).

Most investors are risk-averse. Asset allocation should match the risk-aversion level.

## 🧠 Memory Hooks

- **Geometric mean ≤ Arithmetic mean** always. Geometric is what you actually earn.
- **σ measures total risk; β measures systematic risk only.**
- **Diversification kills unsystematic risk; can't touch systematic.**
- **Sharpe = total-risk denominator; Treynor = systematic-risk denominator.**
- **Jensen's alpha > 0 = manager beat CAPM expectation.**
- **CAPM: Rf + β × ERP.**
- **Lower ρ between assets = more diversification benefit.**
- **Markowitz Efficient Frontier + Capital Market Line = MPT core.**
