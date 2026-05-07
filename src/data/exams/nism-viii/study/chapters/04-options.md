---
chapter: 4
title: Introduction to Options
topicCode: OPT
marks: 20
difficulty: medium
priority: 1
estimatedMinutes: 22
---

## 🎯 Summary Card

An **option** gives the buyer the **right (not obligation)** to buy (call) or sell (put) the underlying at a strike, paying a **premium**. Writer has the obligation. **All Indian index/stock options are European** (exercise on expiry only). Three moneyness states: **ITM, ATM, OTM**. Premium = **Intrinsic value + Time value**. Five Greeks: **Delta, Gamma, Theta, Vega, Rho**. Long option = limited loss (premium), unlimited profit. Short option = limited profit (premium), theoretically unlimited loss.

## 📖 Core Content

### Calls vs puts, buyers vs writers

| | Buyer (long, holder) | Writer (short, seller) |
|---|---|---|
| **Call** | Right to **buy** at strike | Obligation to **sell** if exercised |
| **Put** | Right to **sell** at strike | Obligation to **buy** if exercised |
| Pays / receives | Pays premium upfront | Receives premium upfront |
| Max loss | Premium | Theoretically unlimited |
| Max gain | Unlimited (calls) / Strike−Premium (puts) | Premium |

### American vs European

- **American** — exercise any time on or before expiry
- **European** — exercise only on expiry
- **All Indian index + stock options = European.** Settlement is cash-based at expiry's closing spot.

### Contract specs (Nifty options example)

- Underlying Nifty 50, lot 50 (verify current); tick 5 paise
- Cycle: **weekly** (4 serial weeks) + **monthly** near/mid/far + **3 quarterly** + **8 half-yearly** long-dated
- Expiry: NSE Tuesday / BSE Thursday (per SEBI 2025 rule)
- **Only one weekly benchmark per exchange** (post Nov 2024) — NSE chose Nifty 50 weekly Tue; BSE chose Sensex weekly Thu

### Moneyness (high-yield)

| | Call | Put |
|---|---|---|
| **In-the-money (ITM)** | Spot > Strike | Spot < Strike |
| **At-the-money (ATM)** | Spot ≈ Strike | Spot ≈ Strike |
| **Out-of-the-money (OTM)** | Spot < Strike | Spot > Strike |

### Intrinsic value + Time value

```
Premium             = Intrinsic value  +  Time value
Call intrinsic      = max(Spot − Strike, 0)
Put intrinsic       = max(Strike − Spot, 0)
Time value          = Premium − Intrinsic value      (always ≥ 0)
```

ATM and OTM options have **zero intrinsic value** — their premium is **entirely time value**. Time value decays toward zero as expiry approaches.

### Payoff at expiry (per unit)

```
Long call  : max(S_T − X, 0) − Premium
Short call : Premium − max(S_T − X, 0)
Long put   : max(X − S_T, 0) − Premium
Short put  : Premium − max(X − S_T, 0)

Long call BEP  = Strike + Premium
Long put BEP   = Strike − Premium
```

### The Greeks (sensitivity to one input each)

| Greek | Measures sensitivity to | Sign for long call | Sign for long put |
|---|---|---|---|
| **Delta (Δ)** | Spot price | + (0 to +1) | − (0 to −1) |
| **Gamma (Γ)** | Change in delta (curvature) | + | + |
| **Theta (Θ)** | Time decay | − (loses value daily) | − |
| **Vega (ν)** | Implied volatility | + | + |
| **Rho (ρ)** | Interest rate | + (small) | − (small) |

> **Delta intuition:** ATM call ≈ 0.5; deep ITM ≈ 1.0; deep OTM ≈ 0. For a put it's mirrored (negative).
>
> **Theta hurts the buyer, helps the writer.** Buyers race the clock; writers earn it.

### Option pricing models

- **Black-Scholes** — closed-form for European options on non-dividend assets; assumes log-normal returns + constant vol.
- **Binomial (Cox-Ross-Rubinstein)** — discrete tree, handles American style + dividends; converges to Black-Scholes as steps → ∞.

### Implied volatility (IV)

The volatility input that, plugged into the pricing model, returns the observed market premium. **High IV → expensive options** (more uncertainty priced in). Vega is the lever.

### Put-call parity (arbitrage anchor)

```
Call premium − Put premium  =  Spot − Strike × e^(−r × t)
```

Same strike, same expiry, European. Violation → arbitrage (buy underpriced side, sell overpriced).

### Buyer vs Writer perspective

- **Buyer:** small premium → large potential payoff. **Most options expire worthless** — buyers need to be right on direction *and* timing.
- **Writer:** earns premium upfront, statistical edge (most expire worthless), but rare large losses can wipe out years of premiums. Margin requirements are high.

## 🧠 Memory Hooks

- **Buyer = Right; Writer = Wrong (obligation).** Always check who has the optionality before reading the question.
- **All Indian stock/index options = European.** No early exercise problem; all maths assumes expiry-only.
- **Moneyness rule "C-Up, P-Down":** **C**all is ITM when spot is **Up** above strike; **P**ut is ITM when spot is **Down** below strike.
- **Intrinsic ≥ 0 always.** No such thing as negative intrinsic — the holder simply doesn't exercise.
- **Greeks: "DGTVR"** — **D**elta, **G**amma, **T**heta, **V**ega, **R**ho. Theta is the only one that gets *worse* for buyers as time passes — it's the silent killer.
- **BEP rule:** Call BEP = X + P. Put BEP = X − P. Always premium *into* the strike, signed by direction.
- **Put-call parity** locks the relative price of a same-strike same-expiry call & put. Memorise the formula; it shows up as a multiple-choice trap.
