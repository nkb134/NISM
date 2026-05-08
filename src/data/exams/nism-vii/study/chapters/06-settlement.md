---
chapter: 6
title: Settlement Process
topicCode: STL
marks: 15
difficulty: medium
priority: 1
estimatedMinutes: 16
---

## 🎯 Summary Card

Settlement = **delivery of securities + funds**. India follows **T+1** (cash equity since Jan 2023); **T+0** optional since 2024. **Pay-in window** ~ 11 AM; **pay-out** ~ 1:30 PM on settlement day. **Demat-based delivery** through NSDL/CDSL. **Auction** when seller fails to deliver. **F&O**: stock = physical delivery on expiry; index = cash settled. **Corporate-action settlement**: ex-date is one day before record date in T+1.

## 📖 Core Content

### Settlement timeline (cash equity, T+1)

| Event | Time |
|---|---|
| Trade day (T) | Order matches |
| **T+1 morning** | Pay-in: funds + securities |
| **T+1 ~ 11 AM** | Funds + securities collected |
| **T+1 ~ 1:30 PM** | Pay-out: funds + securities credited |
| **T+1 EOD** | Settlement complete |

### Two pay-in legs

| Leg | Source | Goes to |
|---|---|---|
| **Funds** | Buyer | Clearing corp (then to seller) |
| **Securities** | Seller (from demat) | Clearing corp (then to buyer) |

### Demat delivery

- Seller's broker submits **DIS (Delivery Instruction Slip)** or **eDIS** authorising debit from seller's demat.
- Securities transfer via NSDL/CDSL to CC's pool, then to buyer's demat.
- **No physical certificates** in India since 2019 (full demat).

### POA vs eDIS

- **PoA (Power of Attorney)** — older mechanism; client gives broker rights to debit demat.
- **eDIS** — newer, OTP-authenticated, per-transaction. Replacing PoA for safety.
- SEBI nudging brokers to migrate to eDIS to prevent unauthorised transfers.

### T+0 optional settlement (since 2024)

- Two windows in eligible stocks:
  - **Window 1**: 1:30 PM cut-off; settled same evening.
  - **Window 2**: 3:30 PM cut-off; settled before EOD.
- **Voluntary opt-in** — investor must select.
- Tighter margin + segregation requirements.

### F&O settlement

| Type | Daily | Final on expiry |
|---|---|---|
| **Index futures + index options** | Cash MTM | Cash at closing spot |
| **Stock futures + stock options** | Cash MTM | **Physical delivery** (since Oct 2019) |

- **In-the-money options auto-exercised** on expiry by CC.

### MTM settlement (daily)

- Computed at end of day vs the day's settlement price.
- Pay-in / pay-out the **next morning before market open**.
- Brokers collect MTM from loss-makers, credit to gainers.

### Auction (when seller fails)

- If seller doesn't deliver on T+1, CC initiates **buy-in auction**.
- Auction price typically near close + 20% (penalty).
- Cost charged to defaulting seller; original buyer gets the securities at original trade price.
- Seller takes the loss.

### Close-out

- If auction fails, **close-out at exchange-determined price** (typically high of trade day + buffer).
- Monetary compensation only; no security delivered.

### Corporate-action settlement

- **Record date** = registry closes; entitled holders identified.
- **Ex-date** = first day price trades **without** entitlement (one trading day before record date in T+1).
- **Cum-** vs **ex-** quotes on the exchange around CA dates.
- Examples: dividend, bonus, split, rights — strikes adjusted for derivatives accordingly.

### Special settlement scenarios

- **OFS (Offer for Sale)** — promoter sells via exchange; settlement at auction-determined price.
- **Block deals** — large trades at negotiated prices (within ±1% of market).
- **Bulk deals** — > 0.5% of company shares; reported same day.

### Cross-listing + ADR/GDR

- **ADR (American Depository Receipt)** — Indian co's shares listed on US exchanges via depository.
- **GDR (Global Depository Receipt)** — listed on multiple non-Indian exchanges.
- Holder can convert via custodian; settlement involves cross-border transfer.

### Settlement Guarantee Fund

- CC-managed pool meeting settlement on default.
- Funded continuously; sized via stress test.
- Loss cascade: defaulter → SGF → CC capital → surviving members.

## 🧠 Memory Hooks

- **T+1 settlement** for all cash equity since Jan 2023.
- **T+0 optional** in two windows (1:30 PM, 3:30 PM) since 2024.
- **Pay-in ~11 AM, pay-out ~1:30 PM** on T+1.
- **Demat-only since 2019**; no physical certificates.
- **DIS / eDIS** authorise demat debit; eDIS is OTP-based and safer.
- **F&O: stock = physical, index = cash** (since Oct 2019).
- **ITM options auto-exercised** on expiry.
- **Auction = buy-in when seller fails**; cost to defaulter.
- **Ex-date = T-1 of record date** (in T+1 settlement).
- **Bulk deal = > 0.5% of co shares**; reported same day.
