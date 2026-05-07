---
chapter: 6
title: Trading Mechanism
topicCode: TRD
marks: 10
difficulty: medium
priority: 2
estimatedMinutes: 16
---

## 🎯 Summary Card

Indian derivatives trade on a **fully electronic, screen-based, order-driven** platform. Two big member types: **Trading Member (TM)** and **Clearing Member (CM)**, plus **Authorised Persons** (sub-brokers regime ended 2019). Three corporate user roles: **Corporate Manager → Branch Manager → Dealer**. Order types: time conditions (**Day, IOC**) + price conditions (**Limit, Market, Stop-loss**). Match rule = **price-time priority**. Stocks qualify for derivatives via SEBI's **Market-wide Position Limit (MWPL) + ADTV + Quarter-Sigma** filter (top 500 by avg daily mkt cap; MWPL ≥ ₹1,250 cr; ADTV ≥ ₹150 cr; quarter-sigma order size ≥ ₹50 lakh).

## 📖 Core Content

### Market structure

- Open outcry → extinct in India.
- All futures + options trade **electronically**, screen-based, order-driven, anonymous matching.
- Default trading hours: **9:15 AM – 3:30 PM, Mon-Fri**. SEBI permits exchanges to extend **9:00 AM – 11:55 PM** with adequate risk infra (rarely used).

### Members + entities

| Role | Trades | Clears |
|---|---|---|
| **Trading Member (TM)** | ✓ (own + clients) | ✗ (uses a CM) |
| **Trading-cum-Clearing Member** | ✓ | ✓ (own + clients) |
| **Professional Clearing Member (PCM)** | ✗ | ✓ (for TMs + custodial participants) — typically banks/custodians |
| **Self Clearing Member (SCM)** | ✓ | ✓ (own only — can't clear for other TMs) |
| **Authorised Person (AP)** | Acts as TM's agent | — |

Sub-brokers ceased to exist **April 1, 2019**; all migrated to Authorised Person.

### Corporate hierarchy (in member's trading software)

**Corporate Manager → Branch Manager → Dealer.** Top-down view; only the Corporate Manager can set branch exposure limits. Dealer sees own orders only.

### Order types — time conditions

- **Day order** — valid till market close; auto-cancelled at EOD if unexecuted.
- **IOC (Immediate or Cancel)** — execute now or die. Partial match allowed; unmatched portion cancelled instantly.

### Order types — price conditions

- **Limit order** — execute only at specified price or better (lower for buy, higher for sell).
- **Market order** — execute now at best available price; price not specified.
- **Stop-loss order** — dormant until **trigger price** is hit, then converts to limit (or market). For a sell SL: trigger must be between LTP and limit price.

> Worked: long ABC at ₹100; want to cap loss. Place SL-sell with trigger ₹95, limit ₹92. When ABC trades at or below ₹95, the limit-sell at ₹92 enters the book.

### Order matching rule

**Price-time priority.**
- Best buy = highest bid; Best sell = lowest offer.
- Same price → earliest timestamp wins.
- Partial fills allowed; remainder stays in the book.

### Price bands in derivatives

- **No fixed price band on the contract** itself.
- Operating ranges for erroneous-order prevention: ±10% of base price for index + stock futures; option ranges are delta-based and updated daily.
- Orders outside the operating range hit a **price freeze** (sent for confirmation).

> **SEBI rule (May 2024):** dynamic price-band flexing tightened — now needs **50 trades, 10 unique traders, 3 brokerages on each side** (was 25/5).

### Eligibility for derivatives — stock selection

SEBI's filter (current rule, periodically reviewed):
- Stock must be in the **top 500** by avg daily market cap + traded value (over previous 6 months).
- **Market-Wide Position Limit (MWPL) ≥ ₹1,250 cr.**
- **ADTV (avg daily traded value) ≥ ₹150 cr.**
- **Quarter-sigma order size ≥ ₹50 lakh** — i.e. an order moving the price by quarter-σ should be at least ₹50 lakh, signalling depth.
- Maximum allowable position = **20% of free-float market cap**.

### Eligibility for derivatives — index selection

- Constituents must individually qualify for derivatives.
- Top 1 stock weight ≤ **20%**; top 3 combined ≤ **45%**.
- Minimum **14 constituents** (per Oct 2025 rule for non-benchmark indices).
- Weighted in descending order.

### Adjustments for corporate actions

| Action | Adjustment |
|---|---|
| **Cash dividend** | Adjust strike (if dividend > 5% of stock price); ignore otherwise |
| **Bonus / split / consolidation** | Adjust strike + lot size proportionally |
| **Merger / spin-off** | Contract may be terminated and re-issued |
| **Rights issue** | Adjust strike + lot size based on theoretical price after rights |

Adjustment factor = (price before action) / (price after action).

### Trading costs

| Cost | Approx |
|---|---|
| **STT (Securities Transaction Tax)** | Sell side of futures: 0.0125%; Sell side of options on premium: 0.10% (and 0.125% on intrinsic if exercised) |
| **Stamp duty** | 0.002% on futures; 0.003% on options (sell side, all India after July 2020) |
| **SEBI turnover fee** | 0.0001% |
| **Exchange transaction charge** | Varies by exchange |
| **GST** | 18% on (brokerage + transaction + SEBI fees) |
| **Brokerage** | Negotiated; flat-fee discount brokers ≈ ₹20/order |

### Algorithmic trading

- SEBI permits algos via co-location at the exchange.
- All algos must be **approved by the exchange**; vendor/strategy registration required.
- Minimum order-to-trade ratio compliance to discourage market-stuffing.
- Direct Market Access (DMA) lets institutional clients route orders without broker intermediation; approved on a case-by-case basis.

## 🧠 Memory Hooks

- **TM trades, CM clears, TCM does both, PCM clears only (banks).** Always pair the role with what they're licensed to touch.
- **Sub-broker → Authorised Person, switch happened April 1, 2019.** A favourite trick question.
- **Order matching = "Price first, Time second."** Same price = older order wins.
- **Stop-loss = trigger between LTP and limit.** For a sell SL, trigger > limit.
- **Stock eligibility "1250 / 150 / 50":** MWPL ≥ ₹1,250 cr; ADTV ≥ ₹150 cr; quarter-sigma size ≥ ₹50 lakh. **Top 500 universe.**
- **Index eligibility "14 / 20 / 45":** ≥14 stocks; top ≤20%; top-3 ≤45% (Oct 2025 SEBI rule for non-benchmark indices).
- **Corporate action adjustment = "ratio of before / after price."** Strike + lot size both shift by this ratio.
- **STT side: futures = sell-side; options = sell-premium plus intrinsic if exercised.**
