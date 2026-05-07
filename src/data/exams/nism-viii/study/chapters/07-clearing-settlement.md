---
chapter: 7
title: Clearing, Settlement and Risk Management
topicCode: CLR
marks: 10
difficulty: medium
priority: 2
estimatedMinutes: 18
---

## 🎯 Summary Card

The **Clearing Corporation** becomes legal counterparty to every trade via **novation** and guarantees settlement. Clearing members: **Self-CM, TCM, PCM**. Net-worth norm: **₹3 cr** (₹1 cr if self-only). **Interoperability (2019)** = trade on any exchange, clear at any clearing corp; one margin pool. Two settlement flavours: **MTM (daily, cash)** and **Final (expiry day)**. **Stock futures + options = physical delivery on expiry; index F&O = cash settlement.** Margin stack: **Initial (SPAN-based) + Exposure + ELM (Extreme Loss) + MTM**. **SGF + IPF** are the safety nets.

## 📖 Core Content

### Novation + the role of the Clearing Corporation

Once a trade matches, the Clearing Corp legally **steps between** buyer and seller (novation). Each side now has the CC as counterparty — eliminates bilateral default risk. CC's three jobs: **Clearing, Settlement, Risk Management**.

### Clearing member types (eligibility)

| Member | Net worth | Trades? | Clears for? |
|---|---|---|---|
| **Self CM (SCM)** | ₹100 lakh | ✓ (own) | Self only |
| **Trading-cum-CM (TCM)** | ₹300 lakh | ✓ | Own + other TMs + custodial participants |
| **Professional CM (PCM)** | ₹300 lakh | ✗ | TMs + custodial participants |

Plus **₹50 lakh deposit** with the CC at induction; **₹10 lakh additional** per extra TM cleared.

### Clearing mechanism (open position rollup)

- TM nets **proprietary** positions per contract.
- **Client positions are summed at the client level** (not netted across clients).
- CM rolls up all his TMs' net long + short separately.

> Worked: TM "PQR" — prop net 2000 long; Client 1 net 1000 long; Client 2 net 2000 long → PQR open = 5000 long. TM "XYZ" — prop net 1000 short; Client 1 net 1000 long; Client 2 net 1000 short → XYZ = 1000 long, 2000 short. CM "A" totals: **6000 long, 2000 short**.

### Interoperability of clearing corporations (2019)

Trade on any exchange → clear at any clearing corp of your choice. Benefits:
- **Single margin pool** across exchanges (long 10 SBI on NSE + short 6 SBI on BSE → net 4 long for margin).
- **Resilience** — if one exchange's link breaks, route trades through another CC.
- **Pricing pressure** — CCs compete on fees, service quality.

### Settlement — what's cash, what's physical

| Contract | Daily | Final on expiry |
|---|---|---|
| **Index futures + index options** | Cash MTM | **Cash** at closing spot |
| **Stock futures + stock options** | Cash MTM | **Physical delivery** (since Oct 2019) |

### MTM settlement (daily)

P/L computed as:
1. Trade price vs day's settlement price (for fresh, unsquared positions)
2. Prev day's settlement vs today's settlement (for brought-forward positions)
3. Buy vs sell (for intraday squared-off positions)

Day's settlement price = **last 30-min volume-weighted average** of that contract across exchanges. If untraded in the last 30 min, use theoretical: **F = S × e^(r × t)**.

Cash pay-in / pay-out happens **before market open the next day**.

### Final settlement (expiry day)

- **Cash-settled** (index): position closes at expiry against the **closing spot** of the underlying.
- **Physically delivered** (stock): seller delivers shares from demat; buyer pays full contract value. Bilateral failure → close-out auction; default penalty.

> Stock options auto-exercise rule: at expiry, **all ITM options** are deemed exercised by the CC; OTM options expire worthless.

### Margin system — the layers

| Layer | Sized by | Purpose |
|---|---|---|
| **Initial margin (SPAN)** | Worst-case 1-day loss across 16 scenarios; covers ~99% confidence | Cover next-day price + vol shock |
| **Exposure margin** | ~3% (index) / 5% (stock) of contract value | Buffer above SPAN |
| **Extreme Loss Margin (ELM)** | Tail risk add-on | Cover beyond-99% events |
| **MTM** | Today's price change | Daily true-up |
| **Calendar-spread margin** | Discounted | Less risky than naked, gets a margin break |
| **Cross-margin** | Offsets across cash + F&O | Hedged positions get capital relief |

### Position limits (high-yield)

| Level | Limit |
|---|---|
| **Trading Member** (index F&O) | Higher of ₹500 cr OR 15% of total OI |
| **Client** (index F&O) | 5% of total OI OR ₹50 cr (whichever is higher) |
| **Stock derivatives — TM** | 20% of MWPL or specified |
| **Stock derivatives — Client** | 5% of MWPL OR ₹10 cr (whichever higher) |
| **FII / Mutual Fund** | Higher than client level (per SEBI scheme) |

### Safety nets

- **Settlement Guarantee Fund (SGF)** — clearing-corp-administered pool that meets settlement if a CM defaults. Funded by CC contributions + member deposits + penalties.
- **Investor Protection Fund (IPF)** — exchange-administered, compensates clients of a defaulted member up to a per-client cap (currently ₹25 lakh per client).
- Stress tests run **monthly** to size SGF.

### Default handling (cascade)

1. Defaulting CM's collateral and margins.
2. SGF.
3. CC's own capital (mandatory minimum).
4. Surviving members' contributions.

### Risk monitoring

- Continuous re-computation of margin requirement intraday.
- Auto square-off if margin < threshold.
- Position-limit alerts at 70%, 85%, 100% of cap.
- SEBI requires CCs to publish stress-test results.

## 🧠 Memory Hooks

- **Novation = "I am now your counterparty."** Clearing corp becomes the legal middle.
- **CM net worth: ₹1 cr (self) / ₹3 cr (others).** Add ₹50 lakh deposit + ₹10 lakh per extra TM.
- **Interoperability = "trade anywhere, clear anywhere."** One pool of margin.
- **Stock = physical, Index = cash.** Always since Oct 2019.
- **Margin stack = "SPAN + Exposure + ELM + MTM."** SPAN covers 99%; ELM is the tail.
- **Settlement timing: T+1 morning** (MTM pay-in / pay-out before market open).
- **Position-limit cheat sheet:** TM index = max(₹500 cr, 15% OI). Client index = max(₹50 cr, 5% OI). Stocks scale off MWPL.
- **Default cascade: Margin → SGF → CC capital → Survivors.** Memorise the order.
- **IPF cap = ₹25 lakh per client.** SGF is pool-level; IPF is investor-level.
