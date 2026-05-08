---
chapter: 3
title: Securities Broking Operations
topicCode: BRO
marks: 20
difficulty: medium
priority: 1
estimatedMinutes: 22
---

## 🎯 Summary Card

The biggest chapter (20% of marks). Covers **client onboarding (KYC, demat, bank linking), order types, contract notes, brokerage + STT + GST, payout pay-in cycles, margin collection, segregated funds**. Broker must maintain **client funds in separate bank account** (UCC mapping). **Contract note within 24 hours**. **STT, stamp duty, exchange fees, SEBI charges, GST 18%** = full transaction cost stack.

## 📖 Core Content

### Client onboarding flow

1. **KYC** — PAN + Aadhaar + bank cheque + photo (+ address proof). One-time CKYC.
2. **Demat account** — opened via DP (depository participant); BO ID issued.
3. **Bank account linking** — for pay-in / pay-out via NEFT/RTGS/UPI.
4. **Risk profiling** — questionnaire; required pre-onboarding.
5. **PoA (Power of Attorney)** — increasingly replaced by **e-DIS (Demat Instruction Slip)** for client safety.
6. **Risk Disclosure Document (RDD)** — signed at onboarding.
7. **Client Master Form** — opens UCC (Unique Client Code).

### KYC documents (high-yield)

- **PAN card** (mandatory; foreign nationals exempt with declaration)
- **Aadhaar / Voter ID / Passport / DL** (proof of address)
- **Cancelled cheque** (proof of bank account)
- **Photograph**
- **In-person verification (IPV)** — broker-led video / face-to-face

### Order types

- **Limit order** — execute only at specified price or better
- **Market order** — execute now at best available
- **Stop-loss order** — dormant until trigger price; converts to limit/market
- **Day order** — auto-cancelled at EOD
- **IOC (Immediate or Cancel)** — execute now; unmatched portion cancelled

### Order matching

**Price-time priority.** Best price first; same price = earliest timestamp wins.

### Contract note

- **Mandatory** — issued within 24 hours of trade.
- **Digital format** allowed (DCN — Digital Contract Note).
- Itemises: trade details, brokerage, STT, exchange charges, SEBI fees, stamp duty, GST.

### Transaction cost stack

| Cost | Approx |
|---|---|
| **Brokerage** | Negotiated; flat-fee brokers ≈ ₹20/order |
| **STT (Securities Transaction Tax)** | 0.1% on equity delivery (both sides); 0.025% on intraday sell; futures 0.0125%; options 0.10% on premium (sell side) |
| **Exchange transaction charge** | NSE / BSE different rates |
| **SEBI turnover fee** | 0.0001% |
| **Stamp duty** | 0.015% on delivery (buy side); 0.003% on F&O (sell side) |
| **GST** | **18%** on (brokerage + transaction charge + SEBI fee) |
| **DP charges** | ₹13-25 per scrip per debit (sell day from demat) |

### Pay-in / pay-out cycles

- Equity cash market: **T+1 settlement** (since Jan 2023 — full migration).
- F&O: daily MTM settled by next morning; final settlement on expiry.
- Pay-in by buyer (cash + securities) → clearing corp → pay-out to seller.

### Segregated client funds

- **Mandatory**: client funds held in **separate bank account** (cannot mingle with broker's own funds).
- **3-way reconciliation** daily by exchange.
- Misuse of client funds → severe SEBI enforcement.

### Margin collection

- **Pre-trade margin** — collected upfront (mandatory since Sep 2020).
- Failure to collect = penalty.
- **Peak margin** — highest intraday position-margin requirement, frozen for the day.
- **Reporting**: brokers report margin compliance daily to exchange.

### UCC + Mapping

- **UCC (Unique Client Code)** — issued at onboarding, mapped to PAN.
- All trades + funds + securities tagged to UCC.
- **One UCC per PAN per broker**; minor's UCC linked to guardian's PAN.

### Brokerage tiers

- **Full-service brokers** — ICICI Direct, HDFC, Kotak — research + advisory + brokerage 0.3-0.5%.
- **Discount brokers** — Zerodha, Groww, Upstox — flat ₹20 per order, no advisory.
- **AP commission** — TM + AP share brokerage based on agreement (typically 70-80% to AP, 20-30% to TM).

## 🧠 Memory Hooks

- **Client onboarding 7-step**: KYC → Demat → Bank → Risk profile → PoA/eDIS → RDD → CMF (UCC).
- **Contract note within 24 hours**; digital DCN allowed.
- **STT delivery 0.1% both sides; intraday 0.025% sell; futures 0.0125% sell; options 0.10% premium sell.**
- **GST 18%** on (brokerage + transaction + SEBI fees).
- **T+1 settlement** for equity cash market (since Jan 2023).
- **Segregated client funds in separate bank account** — broker can't mingle.
- **Peak margin** = intraday max requirement; frozen daily.
- **Pre-trade margin mandatory since Sep 2020** — failure = penalty.
- **UCC = PAN-mapped**; one per PAN per broker.
- **Sub-broker → AP April 2019**; AP doesn't settle clients directly.
