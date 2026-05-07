---
chapter: 10
title: Valuation Principles
topicCode: VAL
marks: 12
difficulty: hard
priority: 1
estimatedMinutes: 22
---

## 🎯 Summary Card

Two big approaches: **Absolute (intrinsic)** = DCF, DDM, residual income; **Relative** = P/E, EV/EBITDA, P/B, P/Sales. **DCF: V = Σ FCF / (1+r)^t + Terminal Value**. **WACC** = blend of cost of equity (CAPM) + after-tax cost of debt, weighted by capital mix. **Gordon Growth Model: V = D₁ / (r − g)**. Use **multiple methods** + take a triangulated view; sensitivity-test the key inputs (growth, discount rate, terminal multiple).

## 📖 Core Content

### Absolute vs Relative valuation

| | Absolute (Intrinsic) | Relative |
|---|---|---|
| Method | DCF, DDM, residual income | Multiples vs peers |
| Inputs | Cash flow forecasts, discount rate | Comparable companies' multiples |
| Sensitivity | High to assumptions | High to peer-set choice |
| Best for | Stable, predictable cash flows | Cyclical, peer-rich industries |

### DCF — the canonical formula

```
Enterprise Value = Σ (FCFt / (1 + WACC)^t)   +   Terminal Value / (1 + WACC)^N

Terminal Value (Gordon)  = FCF(N+1) / (WACC − g)
Terminal Value (Multiple) = EBITDA(N) × Exit multiple

Equity Value = Enterprise Value − Net Debt
Per-share value = Equity Value / Diluted shares
```

### WACC (Weighted Average Cost of Capital)

```
WACC = (E/V) × r_e   +   (D/V) × r_d × (1 − T)

  E = market value of equity     D = market value of debt     V = E + D
  r_e = cost of equity (from CAPM)
  r_d = cost of debt (current borrowing rate)
  T   = corporate tax rate
```

### CAPM — cost of equity

```
r_e = Rf + β × (Rm − Rf)

  Rf  = risk-free rate (10-yr G-Sec)
  Rm  = expected market return
  β   = stock's beta vs market
  Rm − Rf = equity risk premium (5-7% in India typically)
```

> Worked example: Rf = 7%, β = 1.2, equity premium = 6% → r_e = 7 + 1.2 × 6 = **14.2%**.

### Dividend Discount Model (DDM)

For dividend-paying companies. Variants:

```
Zero growth:  V = D / r
Constant growth (Gordon):  V = D₁ / (r − g)     // requires g < r
Two-stage:    high-growth phase + stable phase
```

> Worked: Next dividend ₹2, cost of equity 12%, expected growth 4% → V = 2 / (0.12 − 0.04) = **₹25**.

### Residual Income Model

```
V = Book Value₀ + Σ (RIt / (1 + r)^t)
RIt = Net Income_t − r × Book Value(t-1)
```

Useful when DCF is messy and dividends are erratic. Ties value back to book equity.

### Relative valuation — common multiples

| Multiple | Numerator | Denominator | Best for |
|---|---|---|---|
| **P/E** | Price | EPS | Mature, profitable companies |
| **P/B** | Price | Book value / share | Banks, financials, asset-heavy |
| **EV/EBITDA** | Enterprise Value | EBITDA | Cap-intensive, high-leverage |
| **EV/Sales** | EV | Revenue | Pre-profit growth companies |
| **Dividend yield** | DPS | Price | Income-focused investors, REITs |
| **PEG** | P/E | Earnings growth % | Growth-vs-value comparison |

### How to pick the right multiple

| Industry | Preferred multiple |
|---|---|
| Banks | P/B (NIM driven, asset-heavy) |
| Tech / SaaS | EV/Sales (early-stage), P/E (mature) |
| Telecom, infra | EV/EBITDA (capex heavy, leveraged) |
| FMCG | P/E (stable margins, predictable) |
| Real estate | P/NAV |
| Insurance | Embedded value multiples |

### Triangulation

Best practice: derive a value from **2-3 methods**, weight them by relevance, take a range. Single-method valuation is fragile.

### Sensitivity analysis (must do)

Vary your key inputs: growth rate ±2%, WACC ±1%, terminal multiple ±2x. See how the valuation range shifts. **The output range is more honest than a single point estimate.**

### Common DCF traps

- **Hockey-stick projections** — assuming margins / growth that the company has never achieved.
- **WACC too low** → over-valuation. Use a realistic equity risk premium.
- **Terminal value dominates** — often >70% of total. Sanity-check terminal growth (must be ≤ long-term GDP growth, typically 3-5%).
- **Ignoring stock-based comp dilution** in tech companies.
- **Mixing nominal cash flows with real discount rate** (or vice versa).

### Margin of safety

Buy at a price below your estimated intrinsic value. Typical hurdle: **30-50% discount** for a "good buy" — accounts for forecast error and unforeseen risk.

## 🧠 Memory Hooks

- **Absolute vs Relative.** Always do at least one of each.
- **WACC = blend of equity + after-tax debt cost.** Tax shield on interest matters.
- **CAPM: Rf + β × ERP.** Three inputs, all observable.
- **Gordon: V = D₁ / (r − g).** Constraint: g < r.
- **DCF terminal value > 70% of total = warning sign.** Be conservative on g.
- **EV/EBITDA for capex-heavy; P/E for mature; P/B for financials; P/Sales for early-stage.**
- **Triangulate.** Single-method valuation is brittle.
- **Margin of safety = buy 30-50% below intrinsic.**
