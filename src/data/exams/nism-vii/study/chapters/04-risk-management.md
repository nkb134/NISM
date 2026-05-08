---
chapter: 4
title: Risk Management
topicCode: RIS
marks: 15
difficulty: hard
priority: 1
estimatedMinutes: 18
---

## 🎯 Summary Card

Three layers of broker risk: **client (default), market (price), operational (process)**. SEBI's margin framework: **VaR + ELM + adhoc + MTM**. **Pre-trade margin mandatory since Sep 2020** — collected upfront. **Peak margin** intraday max, frozen daily. **Settlement Guarantee Fund (SGF)** at clearing-corp level. **Investor Protection Fund (IPF)** caps at ₹25 lakh per client. Default cascade: defaulter's collateral → SGF → CC capital → surviving members.

## 📖 Core Content

### Risk types facing a broker

| Risk | Source |
|---|---|
| **Client default** | Client fails to pay/deliver |
| **Market risk** | Price moves against open positions |
| **Operational** | System glitch, fraud, mis-execution |
| **Counterparty** | OTC trades — clearing corp eliminates for exchange-traded |
| **Liquidity** | Inability to exit / fund position |
| **Compliance / regulatory** | KYC lapse, AML, SEBI inspection findings |

### Margin framework (SEBI)

**VaR + Extreme Loss Margin + Adhoc Margin + MTM** — total margin requirement.

| Layer | What it covers |
|---|---|
| **VaR (Value at Risk) margin** | Statistical worst-case 1-day loss (99% confidence) |
| **Extreme Loss Margin (ELM)** | Tail-risk add-on |
| **Adhoc / Special margin** | Imposed in volatile times |
| **MTM (Mark to Market)** | Daily P/L true-up |
| **Exposure margin** | Buffer above VaR (~3-5% of contract value) |

### Pre-trade margin (mandatory since Sep 2020)

- Brokers must collect margin **upfront** before placing the order.
- **Failure to collect = penalty** by the exchange.
- Reported daily; multiple breaches → enforcement.

### Peak margin

- **Highest intraday position-margin** requirement during a trading day.
- Sample windows (4 random snapshots) by clearing corp.
- Calculated for the position closed at the random snapshot — frozen for the day.
- Brokers must keep margin coverage at peak level — discourages excessive intraday leverage.

### Margin shortfall reporting

- Brokers report client margin compliance **daily**.
- **Penalty rates**: 0.5% per day for the first occurrence; rising for repeats.
- After 5 consecutive instances, the broker may be required to **disable client trading**.

### Collateral types

| Type | Haircut |
|---|---|
| Cash | 0% |
| Bank guarantees / FDR | 0-2% |
| G-secs / T-bills | 2-5% |
| Approved equity (top-100) | ~12.5% |
| Approved equity (others) | 25-50% |
| Mutual fund units | varies |

**At least 50% of margin must be cash component** (T+1 onwards) for proprietary positions.

### Default cascade

When a member defaults, the clearing corp uses:

1. **Defaulter's collateral + margins**
2. **Settlement Guarantee Fund (SGF)** — clearing-corp pool
3. **CC's own capital** (mandatory minimum)
4. **Surviving members' contributions**

### Settlement Guarantee Fund (SGF)

- Funded by CC contributions, member deposits, penalty collections.
- Stress-tested **monthly** to size adequately.
- Sized to meet "extreme but plausible" default scenarios.

### Investor Protection Fund (IPF)

- **Exchange-administered** (separate from SGF).
- Compensates **clients of a defaulted broker**.
- **Cap: ₹25 lakh per client per default**.
- Funded by exchange + member contributions + fines.

### Risk reporting + monitoring

- **Continuous re-computation** of margin requirement intraday.
- **Auto square-off** if margin coverage falls below threshold.
- **Position-limit alerts** at 70%, 85%, 100% of cap.
- SEBI requires CCs to publish stress-test results periodically.

### Operational risk controls

- **Maker-checker** for all client onboarding + payouts
- **Segregation of duties** — trading desk separate from settlement
- **Daily cash-vs-securities reconciliation**
- **Disaster recovery** plans + alternate site testing
- **Cyber-security audits** under SEBI's CSCRF framework

### Client dispute escalation

| Level | Window |
|---|---|
| Broker compliance | 30 days |
| Exchange Investor Service Cell | 30 days |
| **SCORES (SEBI)** | Online |
| **SMARTODR** (Online Dispute Resolution) | If unresolved |

## 🧠 Memory Hooks

- **Margin stack: VaR + ELM + Adhoc + MTM** (+ Exposure for futures).
- **Pre-trade margin mandatory since Sep 2020.**
- **Peak margin = intraday max, sampled at 4 random points.**
- **At least 50% cash component** for prop margin (T+1).
- **Default cascade: Defaulter → SGF → CC capital → Survivors.**
- **IPF cap = ₹25 lakh per client per default.**
- **Margin shortfall penalty: 0.5%/day** first occurrence; escalates.
- **Cash + BG/FDR + G-Sec = lowest-haircut collateral.**
- **SCORES → SMARTODR** for unresolved client grievance.
