---
chapter: 3
title: Terminology in Equity & Debt Markets
topicCode: TER
marks: 2
difficulty: easy
priority: 3
estimatedMinutes: 8
---

## 🎯 Summary Card

Equity vocabulary: **face value, market price, book value, EPS, P/E, P/B, dividend yield, market cap, free-float**. Debt vocabulary: **coupon, YTM, accrued interest, modified duration, convexity, credit rating**. Bond price moves **inversely** to yield. **Modified duration** = % price change for 1% yield move. **Convexity** is the curvature correction. **G-Sec yield curve** anchors all other yields in the economy.

## 📖 Core Content

### Equity terms

| Term | Definition |
|---|---|
| **Face value (par)** | Nominal value of a share (often ₹1, ₹2, ₹10) — used for dividend declarations |
| **Market price** | Current trading price |
| **Book value per share** | (Equity − Preference capital) / outstanding shares |
| **EPS** | Net profit / weighted average shares; **Diluted EPS** includes potential dilution |
| **P/E** | Price / EPS — how many years of current earnings the market is pricing in |
| **P/B** | Price / book value — premium over net asset backing |
| **Dividend yield** | Annual dividend / market price |
| **Market cap** | Price × shares outstanding |
| **Free-float market cap** | Price × non-promoter, non-locked shares |
| **Beta** | Sensitivity of stock returns to market returns; β = 1 means moves with market |

### Debt terms

| Term | Definition |
|---|---|
| **Face value** | Principal repaid at maturity |
| **Coupon rate** | Annual interest as % of face value |
| **YTM (Yield to Maturity)** | Discount rate that equates future cash flows to current price; the bond's IRR if held to maturity |
| **Accrued interest** | Coupon earned but not yet paid; settled in clean-price quote |
| **Clean price vs dirty price** | Dirty = clean + accrued interest |
| **Modified duration** | % change in bond price per 1% change in yield (linear approximation) |
| **Convexity** | Second-order correction; bonds with higher convexity benefit more from large yield moves |
| **Macaulay duration** | Weighted average time to receive cash flows, in years |
| **Credit rating** | AAA → BBB (investment grade); BB → D (speculative / default) |

### Bond pricing intuition

- **Price ↑ when yield ↓** (and vice versa) — always inverse.
- **Long-maturity bonds = more sensitive** to rate changes.
- **Low-coupon bonds = more sensitive** than high-coupon (more weight on the distant principal repayment).

```
Modified duration ≈ Macaulay duration / (1 + YTM)
% change in price ≈ −Modified duration × Δyield + (½) × Convexity × (Δyield)²
```

### Yield curve

Plot of yield vs maturity for **G-Secs** (risk-free benchmark).
- **Normal (upward)** — investors demand higher yield for longer maturity.
- **Inverted** — short rates above long rates; historically a recession signal.
- **Flat** — uncertainty about direction.

### G-Sec, T-Bill, CD, CP

| Instrument | Issuer | Tenor | Notes |
|---|---|---|---|
| **G-Sec (Government Security)** | Central / State govts | 1 yr - 40 yrs | Sovereign credit; benchmark yields |
| **T-Bill (Treasury Bill)** | Government of India | 91 / 182 / 364 days | Issued at discount, redeemed at par |
| **Certificate of Deposit (CD)** | Scheduled commercial banks | 7 days - 1 year | Negotiable money-market instrument |
| **Commercial Paper (CP)** | Corporates, PDs, FIs | Min 7 days, max 1 year | Unsecured promissory note; rated min A2 |

## 🧠 Memory Hooks

- **EPS / P/E / Dividend yield** — the trio every Q tests. Memorise their formulas cold.
- **Bond rates inverse rule** — "rates UP, prices DOWN." Always.
- **Modified duration ≈ Macaulay / (1+YTM).** Modified is the practical number; Macaulay is the academic one.
- **Convexity is asymmetric** — bond gains more on a yield drop than it loses on an equal yield rise.
- **G-Sec yield curve = the anchor** for all other rates in the economy.
- **AAA = top credit; D = default.**
