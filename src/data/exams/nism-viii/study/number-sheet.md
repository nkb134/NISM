---
title: Number Sheet — every number you need
---

# VIII Number Sheet

One page. Print this. Memorise.

## Indian derivatives market timeline

| Year | Event |
|---|---|
| 1996 | SEBI L. C. Gupta committee |
| 1998 | J. R. Varma group on margins |
| 1999 | SCRA amended — derivatives = securities |
| **June 2000** | **Index futures** launch (NSE + BSE) |
| **June 2001** | Index options launch |
| **July 2001** | Stock options launch |
| **Nov 2001** | Stock futures launch |
| 2013 | MSEI starts derivatives |
| **Oct 2019** | **Stock F&O switches to physical delivery** |
| **2019** | Interoperability of clearing corps |
| **Nov 20, 2024** | **Contract value bumped to ₹15-20 lakh** |
| **May 2025** | Each exchange picks one expiry day; one weekly benchmark options |
| **Oct 30, 2025** | New non-benchmark index derivative norms (≥14 / ≤20% / ≤45%) |

## Margins + capital

| Item | Number |
|---|---|
| Clearing member net worth (general) | ₹3 cr (300 lakh) |
| Clearing member net worth (self-only) | ₹1 cr (100 lakh) |
| Initial deposit with CC | ₹50 lakh |
| Per additional TM cleared | +₹10 lakh |
| Liquid assets — cash component minimum | **50%** |
| IPF compensation cap | **₹25 lakh / client / default** |
| Trading halt — operating range (futures) | ±10% of base |
| Min derivative contract value (post Nov 2024) | **₹15-20 lakh** |
| Records retention (broker) | **5 years** |

## Position limits (high-yield)

| Level | Limit |
|---|---|
| Trading Member — Index F&O | max(₹500 cr, **15% of OI**) |
| Client — Index F&O | max(₹50 cr, **5% of OI**) |
| TM — Stock derivatives | 20% of MWPL |
| Client — Stock derivatives | max(₹10 cr, 5% of MWPL) |

## Stock eligibility for derivatives ("1250 / 150 / 50")

| Filter | Threshold |
|---|---|
| Universe | Top **500** stocks by avg daily mkt cap + traded value (6-month) |
| MWPL | ≥ **₹1,250 cr** |
| ADTV | ≥ **₹150 cr** |
| Quarter-sigma order size | ≥ **₹50 lakh** |
| Max allowable position | 20% of free-float mkt cap |

## Index eligibility (Oct 30, 2025 rule for non-benchmark indices)

| Rule | Threshold |
|---|---|
| Minimum constituents | **14** |
| Top constituent weight | ≤ **20%** |
| Top 3 combined weight | ≤ **45%** |
| Weight order | Descending |

## Tick sizes

| Underlying | Tick |
|---|---|
| Nifty futures + options | **5 paise** |
| Stocks > ₹250 (NSE) | 5 paise |
| Stocks ≤ ₹250 (NSE) | 1 paise |
| Stocks ≤ ₹100 (BSE) | 1 paise |

## Trading hours

| Event | Time |
|---|---|
| Default derivatives trading | **9:15 AM – 3:30 PM** Mon-Fri |
| SEBI-permitted extended | 9:00 AM – 11:55 PM (with risk infra) |
| Sales-call hours | **9 AM – 8 PM** (unless customer asks otherwise) |

## Expiry days

- **NSE** — last **Tuesday** of the month (monthly + weekly Nifty)
- **BSE** — last **Thursday** of the month (monthly + weekly Sensex)
- Weekly: only ONE benchmark options contract per exchange
- Monthly: minimum 1-month tenor

## STT (selling side mostly)

| Transaction | Rate |
|---|---|
| Sale of futures | **0.0125%** of trade value |
| Sale of options (premium) | **0.10%** of premium |
| Buyer of exercised options | **0.125%** of settlement value |
| Stamp duty — futures (sell) | 0.002% |
| Stamp duty — options (sell) | 0.003% |
| SEBI turnover fee | 0.0001% |
| GST on (brokerage + transaction + SEBI) | **18%** |

## Tax loss carry-forward

| Loss type | Years |
|---|---|
| **Non-speculative business** (derivatives) | **8 years** |
| **Speculative business** (intraday cash equity) | **4 years** |
| Capital gains | 8 years |

## Greeks — directionality at a glance

| Greek | Long call | Long put | Short call | Short put |
|---|---|---|---|---|
| Delta | + | − | − | + |
| Gamma | + | + | − | − |
| Theta | − | − | + | + |
| Vega | + | + | − | − |
| Rho | + (small) | − (small) | − | + |

## Pricing formulas (memorise)

```
Future fair price (discrete)        F = S × (1 + r − d)^t
Future fair price (continuous)      F = S × e^((r − d) × t)

Call intrinsic                      max(S − X, 0)
Put intrinsic                       max(X − S, 0)
Premium = Intrinsic + Time value

Put-call parity (European)          C − P = S − X × e^(−r × t)

Long call BEP                       Strike + Premium
Long put BEP                        Strike − Premium
Long straddle BEPs                  Strike ± total premium
Long strangle BEPs                  Call strike + premium AND Put strike − premium

Hedge ratio (lots)                  (β × Portfolio value) / (Future price × Lot size)

Impact cost (%)                     (Actual − Ideal) / Ideal × 100
```

## SEBI minimum: SCORES + ODR

- **Broker first** — 30-day response window.
- **SCORES** — SEBI complaint portal.
- **SMARTODR** — online dispute resolution platform; conciliation → arbitration.
- **PMLA** — STR (Suspicious Transaction Report) to **FIU-IND** within **7 working days**.
