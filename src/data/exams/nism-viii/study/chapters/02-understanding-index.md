---
chapter: 2
title: Understanding the Index
topicCode: IDX
marks: 5
difficulty: easy
priority: 3
estimatedMinutes: 10
---

## 🎯 Summary Card

A **stock index** is a portfolio of securities that tracks market or sector performance. Three weighting methods: **market-cap, free-float market-cap, price-weighted, equal-weighted**. India's Sensex/Nifty are now **free-float market-cap weighted**. **Impact cost** is the price degradation suffered when transacting a large order vs the bid-ask midpoint — falls as liquidity rises. New **non-benchmark index derivatives rule (Oct 2025)**: ≥14 constituents, top weight ≤20%, top-3 ≤45%, descending weights.

## 📖 Core Content

### What an index measures

A statistical indicator of the change in a basket of securities vs a base value. The **percentage change** matters, not the absolute number. Used for: market direction, portfolio benchmark, derivative underlying.

### Index weighting methods

| Method | How weights are set | Example |
|---|---|---|
| Market-cap weighted | Weight ∝ total market cap | Older Sensex/Nifty |
| **Free-float market-cap** | Weight ∝ shares actually available for trading (excludes promoter/strategic holdings) | Current **Sensex, Nifty, SX40** |
| Price-weighted | Weight ∝ stock price | Dow Jones, Nikkei 225 |
| Equal-weighted | Every stock = same weight; rebalance to maintain | Some thematic funds |

### Free-float concept

Promoter holdings, strategic stakes, and locked-in shares are excluded; only shares available for daily trading count toward weight. Most modern indices have moved here because it better reflects what's actually being priced.

### Impact cost (high-yield)

```
Ideal price        = (best bid + best ask) / 2
Actual buy price   = volume-weighted execution price across the order book
Impact cost (%)    = (Actual − Ideal) / Ideal × 100
```

**Lower impact cost = more liquid market.** Impact cost is asymmetric (buy vs sell) and grows with order size. Bid-ask spread is just impact cost for the *smallest* trade.

> Worked example: best bid 9.80, best ask 9.90; want to buy 1,500 shares. Available: 1,000 @ 9.90, 1,500 @ 10.00. Ideal = 9.85. Actual = (1000×9.90 + 500×10.00)/1500 = 9.9333. Impact cost = (9.9333−9.85)/9.85 × 100 = **0.84%**.

### Index attributes (a "good" index)

- Reflects market behaviour
- Computed by an **independent third party** (e.g. Asia Index Pvt Ltd for BSE; NSE Indices Ltd for NSE)
- Professionally maintained — adjusted for splits, bonuses, mergers
- Periodically revised — replace stale stocks

### Diversification ceiling

Going from 10 → 20 stocks cuts risk sharply. 50 → 100 helps marginally. **Beyond 100 stocks, almost zero risk reduction.** Indices typically cap constituents around 30 (Sensex) or 50 (Nifty) for this reason.

### New rule (SEBI Oct 2025) — derivatives on non-benchmark indices

For an index to host derivatives (other than Nifty/Sensex), it must satisfy:

| Rule | Threshold |
|---|---|
| Minimum constituents | **14** |
| Top constituent weight | ≤ **20%** |
| Top 3 combined weight | ≤ **45%** |
| Weight structure | Descending |

Phased rollout: BANKEX, FINNIFTY → single tranche by Dec 31, 2025. **BANKNIFTY → 4 monthly tranches** (per-tranche shave = (current − target)/(remaining tranches)) by **Mar 31, 2026**.

### Applications of an index

- **Index funds** — track the index, return ≈ index minus tracking error.
- **Index derivatives** — futures + options (Index Futures, Index Options); hedge market risk.
- **ETFs** — basket of stocks trading like a stock; intraday liquidity, low cost.

## 🧠 Memory Hooks

- **Sensex + Nifty + SX40 = "FFSI"** — **F**ree-**F**loat **S**hifted **I**ndices. Globally most have moved this way.
- **Impact cost asymmetry rule** — "Buy goes UP from ideal, Sell goes DOWN from ideal." Impact cost is always paid against you.
- **20-45-14 for non-benchmark derivatives:** ≤**20%** top, ≤**45%** top-3, ≥**14** constituents. Easy mnemonic: "20-45-14, derivative index gates."
- **Diversification beyond 100 = zero gain.** Index curators stop near 50 for that reason.
- **Weight method by index:** "Sensex, Nifty, SX40 = free-float; Dow, Nikkei = price-weighted." Don't confuse them.
