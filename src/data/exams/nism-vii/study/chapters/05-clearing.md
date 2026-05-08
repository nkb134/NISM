---
chapter: 5
title: Clearing Process
topicCode: CLG
marks: 15
difficulty: medium
priority: 1
estimatedMinutes: 16
---

## 🎯 Summary Card

Clearing = **post-trade obligation calculation**. Three CCs in India: **NCL (NSE), ICCL (BSE), MCCIL (MSEI)**. **Novation** makes the CC the central counterparty. **Interoperability (2019)** lets you trade on any exchange and clear at any CC. **Multilateral netting** reduces gross obligations. **T+1 settlement** for cash equity (since Jan 2023). Clearing members net positions across TMs + custodial participants.

## 📖 Core Content

### Clearing flow

```
Trade matched at exchange
  → CC novates (becomes counterparty to both sides)
    → CM nets positions per CC's rules
      → Pay-in / pay-out scheduled
        → Settlement on T+1 (cash equity)
```

### Novation

- Once trade matches, CC **steps between** buyer and seller as legal counterparty.
- Eliminates bilateral default risk.
- Each leg now has the CC as counterparty — a **central counterparty (CCP)** structure.

### Three Indian CCs

| CC | Exchange |
|---|---|
| **NCL (NSE Clearing Ltd)** | NSE |
| **ICCL (Indian Clearing Corp Ltd)** | BSE |
| **MCCIL (Metropolitan Clearing Corp of India Ltd)** | MSEI |

### Interoperability (2019)

- Trade on any exchange → clear at any CC of your choice.
- **Single margin pool** across exchanges (long 10 SBI on NSE + short 6 SBI on BSE → net 4 long for margin).
- **Resilience** — alternate routing if one CC fails.
- Pricing pressure between CCs.

### Multilateral netting

- All trades of a CM across all clients + own + TMs → netted to a single position per security.
- Drastically reduces gross obligations.
- Per security, only the net long or net short flows on settlement day.

### Clearing member types (recap)

| Member | Trades | Clears |
|---|---|---|
| **SCM** | ✓ (own) | Self only |
| **TCM** | ✓ | Own + other TMs + custodial participants |
| **PCM** | ✗ | TMs + custodial participants (typically banks/custodians) |

### Clearing member eligibility

| Requirement | Threshold |
|---|---|
| Net worth (general) | **₹3 crore** (₹300 lakh) |
| Net worth (self-only) | ₹1 crore |
| CC deposit | ₹50 lakh |
| Per additional TM cleared | +₹10 lakh |

### Position calculation (rolling up to CC)

- TM nets **proprietary** positions per security.
- **Client positions are summed at client level** (not netted across clients — each client's net is preserved).
- CM rolls up all TMs' nets per security per CC.

> Worked: TM "PQR" — prop net 2000 long; Client 1 net 1000 long; Client 2 net 2000 long → PQR's open = 5000 long.

### T+1 settlement (cash equity)

- **All Indian listed equity moved to T+1 by Jan 2023.**
- Pay-in (buyer's funds + seller's securities) on T+1 morning.
- Pay-out (cash to seller, securities to buyer) on T+1 by ~5 PM.
- F&O is daily MTM; final settlement on expiry.

### T+0 (rolling settlement)

- Optional T+0 (same-day) settlement available for select stocks since 2024.
- Two windows: 1:30 PM cut-off (Window 1), 3:30 PM (Window 2).
- Helps quick redeployment of capital; voluntary opt-in.

### Pay-in / pay-out mechanics

- Pay-in via clearing bank account; **funds debited at scheduled time**.
- Pay-out via crediting CMs' accounts.
- **Time-bound**: missed pay-in = default → cascade triggered.

### Auction + close-out

- If buyer fails to pay or seller fails to deliver:
  - **Auction**: market-buy to deliver to original buyer; cost to defaulter.
  - **Close-out**: monetary settlement at auction price + penalty.

### Cross-margin

- Hedged positions across cash + F&O get **margin relief**.
- Released margin = capital efficiency for institutional traders.

### Settlement Guarantee Fund (SGF)

- CC-administered pool that meets settlement on member default.
- Funded by CC contributions + member deposits + penalty collections.
- Stress-tested monthly.

## 🧠 Memory Hooks

- **Novation** = "CC becomes my counterparty." Eliminates bilateral risk.
- **Three CCs: NCL / ICCL / MCCIL** = NSE / BSE / MSEI.
- **Interoperability 2019** = "trade anywhere, clear anywhere."
- **Multilateral netting** drastically cuts gross obligations to a single net per security.
- **CM net worth: ₹3 cr (others) / ₹1 cr (self).** Plus ₹50 lakh deposit + ₹10 lakh per extra TM.
- **T+1 settlement** since Jan 2023 (cash equity); F&O daily MTM.
- **T+0 optional** since 2024 in two windows (1:30 PM, 3:30 PM).
- **Default = auction + close-out**; loss to defaulter.
- **Cross-margin** rewards hedged positions.
