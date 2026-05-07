---
chapter: 9
title: Accounting and Taxation
topicCode: TXA
marks: 5
difficulty: medium
priority: 3
estimatedMinutes: 14
---

## 🎯 Summary Card

ICAI guidance notes govern derivative accounting. **Initial margin** debited to a margin account (not P&L); **MTM** debited/credited to a separate MTM Margin account. **Prudence rule:** create provision for **anticipated loss** (debit balance in MTM); **ignore anticipated profit** (credit balance) until realised. Final profit/loss recognised on **settlement / squaring off**. **Tax: derivatives = non-speculative business income (Sec 43(5)(d))** — taxed at slab rate; losses set off against any business income, carried forward 8 years. **STT applies; no LTCG concession.**

## 📖 Core Content

### Forward contracts (AS-11)

| Purpose | Premium / discount | Exchange difference |
|---|---|---|
| **Hedging** | Amortise over contract life | Recognise in P&L of the year |
| **Trading / speculation** | Don't recognise upfront | Mark forward rate to year-end forward rate; difference to P&L |

Profit/loss on cancellation or renewal → **always P&L of the year**.

### Equity index + stock futures — accounting flow

1. **At inception** — Pay initial margin → debit "Initial Margin – Equity Futures A/c"; credit Bank. **No entry for the futures contract itself.**
2. **Daily MTM** — Pay or receive MTM → "Mark-to-Market Margin A/c" debit/credit, against Bank. Maintain index-wise / stock-wise.
3. **Balance-sheet date** — Apply prudence:
   - **Debit balance** in MTM (net loss to date) → create a **provision for loss** (debit P&L). Show MTM as Current Asset, provision as deduction.
   - **Credit balance** (net gain to date) → **ignore** for P&L. Show under Current Liabilities.
4. **Settlement / squaring off** — Compute realised P&L = final settlement price − contract price; transfer through MTM A/c to P&L. Release initial margin (Bank Dr, Initial Margin Cr).
5. **Default** — Contract closed out; loss adjusted against initial margin; excess released, shortfall recoverable from client.

> **Worked sequence (margin movements):** Initial ₹50,000 paid → next day SPAN rises to ₹55,000 (pay extra ₹5,000) → ₹45,000 (refund ₹10,000) → ₹47,000 (pay ₹2,000). All entries hit "Initial Margin" not P&L.

### Equity options — accounting (cash-settled)

| Party | At inception |
|---|---|
| **Buyer/holder** | Premium paid → "Equity Option Premium A/c" Dr; Bank Cr |
| **Seller/writer** | Premium received → Bank Dr; "Equity Option Premium A/c" Cr (a liability). Plus pay initial margin into "Option Margin A/c" |

Daily margin moves through the Option Margin A/c. Balance-sheet date prudence: **buyer provides for fall in premium below cost** (anticipated loss); seller provides if premium has risen above their entry.

### Disclosure requirements

- Open interest count + units (long + short separately, index/stock wise) at year end.
- Bank guarantees / securities lodged in lieu of cash margin — value + market value disclosed.

### Taxation — the central rule

**Section 43(5)(d) of Income-tax Act:** an "eligible transaction" in derivatives carried out on a recognised stock exchange is **NOT a speculative transaction**. Treated as **business income** if frequency / volume so suggests.

| Treatment | Tax effect |
|---|---|
| **Business income** (derivatives) | Net P/L taxed at slab rate; losses set off against any business income; **carry forward 8 years** as non-speculative business loss |
| **Speculative income** (intraday cash equity, NOT derivatives) | Losses set off only against speculative gains; carry forward **4 years** |
| **Capital gains** (delivery in cash market) | STCG 20% (post-July 2024); LTCG 12.5% beyond ₹1.25 lakh per year |

### Audit + presumptive tax

- Tax audit under **Section 44AB** if turnover exceeds the threshold (currently ₹10 cr if ≥95% digital, else ₹1 cr).
- **Turnover for derivatives** = absolute sum of profit + loss on each trade + premium received on options written. Not the contract value.
- **Presumptive scheme (Section 44AD)** generally not applied to derivatives in practice.

### Tax on transactions (STT) — derivatives

| Transaction | Rate (paid by) | Base |
|---|---|---|
| Sale of futures | **0.0125%** (seller) | Trade value |
| Sale of options (premium) | **0.10%** (seller) | Premium |
| Sale of options (exercised) | **0.125%** (buyer) | Settlement value |

Plus stamp duty (0.002% futures / 0.003% options sell side), exchange + SEBI charges, GST 18% on (brokerage + transaction + SEBI fees).

### Set-off + carry-forward summary

| Loss type | Set off in same year against | Carry forward years | C/F set off only against |
|---|---|---|---|
| **Non-speculative business** (derivatives) | Any income head except salary | **8** | Any business income |
| **Speculative business** | Speculative income only | **4** | Speculative income only |
| **STCG** (equity) | Any capital gain | 8 | Any capital gain |
| **LTCG** (equity) | LTCG only | 8 | LTCG only |

### Cash settlement vs physical delivery — tax angle

- **Cash-settled** (index F&O) — gains/losses are business income.
- **Physically settled** (stock F&O at expiry, since Oct 2019) — delivery treated like a cash-market transaction; **STT on delivery applies**, capital-gains rules potentially trigger.

## 🧠 Memory Hooks

- **Initial margin ≠ expense.** It's a current asset on the balance sheet — not P&L until released or adjusted on default.
- **Prudence rule = "Show losses, hide gains."** Provide for anticipated loss; ignore anticipated profit.
- **Section 43(5)(d) = derivatives are NON-speculative business income.** This is THE high-yield tax fact.
- **C/F: Non-spec biz = 8 years; Spec biz = 4 years.** Mnemonic: "Non-speculative gets a longer leash."
- **Turnover for derivatives = absolute P/L per trade + option premium written**, NOT contract value. Critical for tax audit threshold.
- **Buyer pays STT only on exercised options** (0.125% on settlement value); else STT is on the seller side.
- **Stock F&O physical = like a cash trade for tax purposes.** Capital gains may apply if the held shares are eventually sold.
