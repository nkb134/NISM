---
chapter: 3
title: Introduction to Forwards and Futures
topicCode: FUT
marks: 20
difficulty: medium
priority: 1
estimatedMinutes: 22
---

## 🎯 Summary Card

A **forward** is a bilateral OTC contract; a **future** is the same idea standardised, exchange-traded, and clearing-house guaranteed. Two limits of forwards: **liquidity** (no exit) and **counterparty** (default). Both buyer and seller pay **initial margin** + daily **MTM**. **Basis = Spot − Future**, converges to zero at expiry. **Cost of carry = interest − dividend**. Indian rule: **contract value ₹15-20 lakh** at introduction (post Nov 2024). NSE expires **last Tuesday**, BSE **last Thursday**.

## 📖 Core Content

### Forward vs Future — same payoff, different machinery

| | Forward | Future |
|---|---|---|
| Trading venue | OTC (bilateral) | Exchange |
| Standardisation | Customised | Standard size + tenor |
| Counterparty risk | Bilateral | Clearing corp guarantees |
| Margin | None | Initial + MTM, both sides |
| Exit before expiry | Hard (illiquid) | Easy (offset on exchange) |
| Settlement | Physical / negotiated | Cash or physical, exchange-rules |

### Key contract specs (Nifty futures example)

- **Underlying:** Nifty 50
- **Lot size:** 65 (post-2024 hike)
- **Tick size:** 5 paise
- **Cycle:** 3-month rolling (near, next, far)
- **Expiry:** last **Tuesday** of the month (NSE) / **Thursday** (BSE)
- **Trading hours:** 9:15 – 15:30 IST, Mon-Fri

> **SEBI rule (effective Nov 2024):** new derivative contracts must have **value ≥ ₹15 lakh** at intro; lot size set so contract value at review stays in **₹15-20 lakh**. Earlier band was ₹5-10 lakh — bumped 3× to track market growth.
>
> **SEBI rule (May 2025):** each exchange picks **one expiry day** (Tuesday or Thursday). Only **one weekly benchmark** options contract per exchange (e.g. NSE: Nifty 50 weekly Tue; BSE: Sensex weekly Thu). Monthly contracts must have **≥1-month tenor** and expire on the chosen day's last occurrence of the month.

### Settlement prices (high-yield)

- **Daily settlement price** — last 30-min weighted average of that day's futures trades. Drives MTM.
- **Final settlement price** — closing **spot** value of the underlying on expiry day.

### Margins

| Margin | When | Why |
|---|---|---|
| **Initial margin** | Trade entry | Cover ~1-day worst-case loss; both sides pay |
| **MTM margin** | End of every day | Settle gain/loss vs prev day's close |
| **Exposure margin** | Continuous | Cushion above initial; ~3% (5% for stocks) |

### Basis & cost of carry

```
Basis              = Spot price − Futures price
Cost of carry (eq) = Interest paid to fund − Dividend received
```

- If futures > spot → basis is **negative** (a "premium" / contango).
- If spot > futures → basis is **positive** (backwardation).
- Basis → **zero at expiry** (final settlement is at spot).
- For two contracts of same underlying, basis difference = cost of carrying between their expiries.

> **Worked example:** Stock at ₹100, borrow rate 6% p.a., expected dividend ₹2 over the period. Net carry = 6 − 2 = ₹4. Fair 1-yr future = **₹104**.

### Open Interest vs Volume (don't confuse)

- **Open Interest (OI)** = outstanding contracts (yet to be settled). Counts each contract once (long ≡ short by definition).
- **Volume** = contracts traded in a window (day / month / life).

> Worked sequence: A shorts 50, B longs 50 → OI 50, vol 50. Next day C longs 100, D shorts 100 → OI 150 (new positions). Day 3: A buys back to close, E shorts → OI stays at 150 (existing short transferred A→E).

### Position vocabulary

- **Long** — outstanding buy (you bought, haven't sold).
- **Short** — outstanding sell (you sold, haven't bought back).
- **Open position** — net of all unclosed legs across contracts.
- **Roll over** — close near-month, simultaneously open next-month, same underlying. Both legs at the same time to manage basis.

### Payoff for futures

```
Long future  payoff  = Spot at expiry − Future entry price   (per unit)
Short future payoff  = Future entry price − Spot at expiry
```

Both linear, both unlimited in either direction. (Compare to options: asymmetric.)

### Futures pricing — cost-of-carry model

```
F = S × (1 + r − d)^t                  (discrete, simplified)
F = S × e^((r − d) × t)                (continuous compounding)

   F = futures fair price
   S = spot price
   r = risk-free rate
   d = dividend yield (or income from underlying)
   t = time to expiry, years
```

If F > fair value → **cash-and-carry arbitrage** (buy spot, sell future). If F < fair value → **reverse cash-and-carry** (short spot, long future) — but short-selling of stock has its own constraints in India.

### Price band

The trading range allowed for a contract in a day, set vs prev day's close (e.g. ±10%). On Day 1 of a new contract, band is set off the underlying's spot close. Exchanges can widen with trading halts in volatile sessions.

## 🧠 Memory Hooks

- **Forward → Future = "from negotiate to standardise."** Same payoff, machinery upgraded.
- **Both buyer and seller pay margin.** This is the single biggest difference vs options where only the writer pays. Memory: "in a future, both sides have skin."
- **Basis sign rule:** "**S** > **F** = **+**ive basis; **F** > **S** = **−**ive basis (premium)." Always check which is bigger.
- **Cost of carry equity formula = "I minus D"** — Interest minus Dividend. "I-D, fair futures rule."
- **Indian contract value ₹15-20 lakh** since Nov 2024 (was ₹5-10 lakh). Why: market grew 3×.
- **Expiry: NSE Tue, BSE Thu.** "**N**SE = **N**aagle (Tuesday in some Indian regions); **B**SE = **B**rihaspati (Thursday)." Pick whichever sticks.
- **OI ≠ Volume.** OI is outstanding (snapshot). Volume is flow. New positions raise OI; offsetting trades don't.
- **Final settlement always at spot.** That's why basis goes to zero at expiry.
