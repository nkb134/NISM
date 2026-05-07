---
chapter: 10
title: Risk, Return and Performance
topicCode: RSK
marks: 7
difficulty: medium
priority: 2
estimatedMinutes: 14
---

## 🎯 Summary Card

Drivers of equity returns: **market direction, stock selection, sector concentration, market cap, style**. Drivers of debt returns: **credit quality, interest rates, liquidity, reinvestment**. **Modified duration** = price sensitivity to rate change (higher duration = higher rate risk). **Macaulay duration** defines SEBI debt scheme classification. Returns: **Absolute (≤1yr), CAGR (>1yr, mandatory in ads), XIRR (irregular flows)**. Risk: **Standard Deviation = total risk**, **Beta = systematic risk** (market beta = 1.0), **R-squared** indicates how well benchmark explains fund's volatility.

## 📖 Core Content

### General + scheme-specific risk factors

Standard risk factors (in every SID):

- Investments involve risks; possibility of capital loss
- Past performance not indicative of future
- Sponsor not liable beyond initial contribution

Scheme-specific:

- **Equity:** market, sector concentration
- **Debt:** credit, interest rate, liquidity, reinvestment
- **International:** currency, country
- **Sectoral/Thematic:** concentration
- **ELSS:** lock-in (illiquidity)

### Drivers of returns and risk

**Equity:**

- Market direction
- Stock selection (alpha)
- Sector concentration / diversification
- Market cap (large/mid/small)
- Investment style (growth vs value)

**Debt:**

- Credit quality
- Interest rate movements (modified duration)
- Liquidity
- Reinvestment risk

### Yield to Maturity (YTM)

- Total return on debt security if held to maturity
- For debt MF: weighted-average YTM is key indicator
- Higher YTM ≠ better always (could indicate higher credit risk)

### Modified Duration

- Measures price sensitivity to rate changes
- **Higher modified duration → higher interest rate risk**
- Strategy: rates expected to fall → increase duration; rates expected to rise → reduce duration

### Macaulay Duration

- Weighted average time to receive cashflows
- Used in SEBI's debt scheme classification (defines maturity buckets in Ch 2)
- Formula: Σ PV(CF) × t ÷ Bond Price

### Measures of returns

| Period | Measure |
|---|---|
| ≤ 1 year | **Absolute return:** (End − Start) ÷ Start × 100 |
| > 1 year | **CAGR** (SEBI-mandated for ads): ((End/Start)^(1/n)) − 1 |
| Irregular cash flows (e.g., SIP) | **XIRR** (Excel: `=XIRR(values, dates)`) |

### SEBI norms on representation of returns

- Performance ad only if scheme >1 year old
- 1–3 year schemes: annualized yields if performance available for ≥7, 15, or 30 days
- 3 year schemes: CAGR for 1, 3, 5 yrs and since inception
- Returns based on **TRI (Total Return Index)** — applicable from 1 Feb 2018

### Risks in fund investing

Standard deviation, Beta, R-squared (covered next) · Portfolio concentration · Fund manager change · Sponsor change · Regulatory risk.

### Measures of risk

**Variance & Standard Deviation**

- SD = √Variance
- Measures **total risk** (systematic + unsystematic)
- Higher SD → greater volatility
- Excel: `=stdev(range)` (`stdev.s` for sample, `stdev.p` for population)

**Beta**

- Measures **systematic risk** (market-related)
- Market beta = 1.0
- Beta > 1 → more volatile than market
- Beta < 1 → less volatile
- Useful only for diversified equity schemes

**R-squared**

- 0 to 1 (or 0% to 100%)
- High R² → fund moves with benchmark; Beta is reliable
- Low R² → fund moves differently; Beta less meaningful

### Provisions on credit risk

- Side pocketing (segregated portfolio) for credit events
- Investment limits per issuer (Ch 4)
- Mandatory credit rating for scheme exposure

## 🧠 Memory Hooks

- **Returns by period — "Absolute → CAGR → XIRR":**
  - ≤1 year: Absolute (simple %)
  - 1 year: CAGR (compounded)
  - Irregular flows: XIRR (Excel function)
- **Modified Duration vs Macaulay Duration:**
  - Modified = sensitivity to rate moves (used for risk)
  - Macaulay = weighted time to cashflows (used for SEBI classification)
- **Bond price ↔ rate inverse:** "When rates UP, bond prices DOWN. Higher duration = bigger swing."
- **Risk measures hierarchy — "SD → Beta → R²":**
  - SD = total risk
  - Beta = systematic (market) risk only
  - R² = how reliable Beta is
- **Beta = 1 means "moves with market":** think of it as "1x leverage on the index."
- **TRI — Total Return Index since 1 Feb 2018:** includes dividends; harder to beat than PRI.
- **Performance ad rule cross-ref (Ch 4):** "1-3-5-since" mandatory for >3yr schemes.
