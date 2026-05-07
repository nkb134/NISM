---
chapter: 5
title: Strategies Using Equity Futures and Equity Options
topicCode: ESS
marks: 10
difficulty: hard
priority: 1
estimatedMinutes: 24
---

## 🎯 Summary Card

**Hedge** = take futures position opposite to spot exposure. **Long hedge** locks future buy price; **short hedge** locks future sell price. **Portfolio hedge ratio = (β × Portfolio value) ÷ (Index price × lot size)**. **Cash-and-carry** arbitrages overpriced futures (long spot + short future); **reverse cash-and-carry** the opposite. Options strategies: **straddle** (same strike), **strangle** (different strikes), **spread** (same direction, different strikes), **collar** (long stock + long put + short call), **covered call**, **protective put**, **butterfly**. **Put-call parity** powers options arbitrage. **Delta-hedging** neutralises directional exposure.

## 📖 Core Content

### Hedging with futures

**Long hedge** (planning to buy later, fearing price rise):
- Buy futures now → if spot rises, futures gain offsets the higher spot cost. Effective price ≈ initial futures price.

**Short hedge** (planning to sell later, fearing price fall):
- Sell futures now → if spot falls, futures gain offsets the lower spot proceeds. Effective price ≈ initial futures price.

> Worked: Need to buy 1500 shares of ABC in 6 weeks. Spot ₹455, June futures ₹457.30. Long 1 lot. If spot rises to ₹520 → futures squared at ~₹521. Net cost / share ≈ **₹456** (close to entry futures price). Same logic if spot falls.

### Portfolio hedge with index futures

```
Hedge ratio (lots) = (β × Portfolio value) / (Futures price × lot size)
```

> Worked: Portfolio ₹90 lakh, β = 1.3, Nifty futures 17,700, lot 50.
> Lots = (1.3 × 90,00,000) / (17,700 × 50) = **13.22 → short 13 contracts**.

### Speculation (trading) with futures

Bullish → long futures. Bearish → short futures. Leverage = (Contract value / Margin). 20% margin → ~5× leverage. Same direction view as buying/selling stock, but ~80% less capital tied up.

### Cash-and-carry arbitrage (high-yield)

Triggered when **futures > fair value (S × (1 + r − d)^t)**:

1. Borrow at r, buy spot (long).
2. Sell future at the overpriced level.
3. Hold to expiry, deliver into the future.
4. Lock-in profit = Future − S × (1 + r − d)^t (less costs).

**Reverse cash-and-carry** triggers when futures < fair value: short spot, long future. India's stock-borrow constraints make this less common in practice.

### Calendar spread

Long one expiry + short another expiry of the **same underlying**. Profits from the spread between near-month and far-month futures changing.

### Options strategies — pick the right tool for the view

| View | Strategy | Construction |
|---|---|---|
| Bullish, big move | Long call | Buy call |
| Bearish, big move | Long put | Buy put |
| Bullish, mild | Bull call spread | Long lower-strike call + short higher-strike call |
| Bearish, mild | Bear put spread | Long higher-strike put + short lower-strike put |
| Big move, direction unsure | **Long straddle** | Long ATM call + long ATM put (same strike, same expiry) |
| Big move, direction unsure (cheaper) | **Long strangle** | Long OTM call + long OTM put (diff strikes, same expiry) |
| No move expected | Short straddle / strangle | Mirror of above (sell premium) |
| Hold stock + want income | **Covered call** | Long stock + short call (caps upside, earns premium) |
| Hold stock + want crash protection | **Protective put** | Long stock + long put (insurance) |
| Hold stock, neutral, want hedge | **Collar** | Long stock + long OTM put + short OTM call (caps both sides) |
| Range-bound view | **Long butterfly** | Long 1 ITM call + short 2 ATM calls + long 1 OTM call (or all puts) |

### Straddle vs strangle (memorise the BEPs)

```
Long straddle (strike X, total premium P):
  BEPs at expiry = X + P  and  X − P
  Max loss = P (when S_T = X)

Long strangle (call strike X_c, put strike X_p, total premium P, X_c > X_p):
  BEPs = X_c + P  and  X_p − P
  Max loss = P (when X_p ≤ S_T ≤ X_c)
```

Strangle is **cheaper** (both legs OTM) but needs a **bigger move** to break even.

### Covered call vs protective put — capped vs uncapped

| | Covered call | Protective put |
|---|---|---|
| Position | Long stock + short OTM call | Long stock + long OTM put |
| Upside | **Capped** at strike + premium received | Unlimited (less premium paid) |
| Downside | Stock loss − premium received | **Limited** to (Spot − Strike + Premium) |
| Income vs cost | Earns premium | Pays premium |
| Use case | Mildly bullish, willing to sell at strike | Insurance against crash |

### Arbitrage using options — put-call parity

```
Call − Put  =  S − X × e^(−r × t)
```

If LHS > RHS → call relatively expensive → short call, long put + long stock funded at r. Lock-in arbitrage. Reverse trade if LHS < RHS.

### Delta-hedging

Maintain a **delta-neutral** portfolio by offsetting the option's delta with units of the underlying.
- Long call (Δ = +0.5) on 100 lots → buy 50-lot equivalent of underlying short to hedge.
- Rebalance as delta changes (gamma effect) — known as **dynamic hedging**.

### Reading open interest + put-call ratio

- **OI rising + price rising** → fresh longs, bullish confirmation.
- **OI rising + price falling** → fresh shorts, bearish confirmation.
- **OI falling + price moving** → unwinding (squaring off), trend losing steam.
- **PCR (put OI / call OI)** > 1 → bearish positioning (or contrarian bullish near extremes).

## 🧠 Memory Hooks

- **Hedge ratio mnemonic:** "**β × Value, over Future × Lot**." Always β-adjusted; don't forget the leverage of beta.
- **Cash-and-carry trigger:** "If F > S × carry, the future is RICH — short it." Reverse if F < fair.
- **Straddle = same strike; Strangle = stretched strikes.** Both need volatility; strangle is cheaper, needs bigger move.
- **Covered call CAPS the upside; Protective put CAPS the downside.** Same words ("caps"), opposite ends.
- **Collar = both caps stitched together.** Long put + short call around a held stock. Often near-zero cost.
- **Long straddle BEPs = X ± total premium.** Two break-evens, profit only outside both.
- **Delta-hedging** = neutralise direction; gamma forces re-hedging.
- **PCR > 1** in isolation = bearish; at extremes = contrarian signal.
