---
chapter: 9
title: Corporate Actions
topicCode: COR
marks: 5
difficulty: medium
priority: 3
estimatedMinutes: 10
---

## 🎯 Summary Card

Corporate actions change the share count, share price, or both. Common: **dividend, bonus, split, consolidation (reverse split), rights issue, buyback, M&A, demerger, ESOP**. **Record date** = who's eligible; **ex-date** = price adjusts (T-1 of record date typically). Adjustment factor for derivatives = (price before) / (price after). **Buyback = capital return + EPS boost** (fewer shares). **Bonus + split don't change market cap**, only number of shares.

## 📖 Core Content

### Key dates

- **Announcement date** — board declares action.
- **Record date** — registry closes; shareholders on this date are entitled.
- **Ex-date** — first day price trades without the entitlement (typically 1 day before record date in T+1 settlement).
- **Effective / Pay date** — cash hits accounts (for dividend) or new shares credited (for bonus/split).

### Cash dividend

- Declared from accumulated profits.
- **Not tax-free in receiver's hands** since FY 21 (DDT abolished); taxed at slab rate.
- **TDS applicable** above ₹5,000 dividend per fiscal year.
- Stock price drops by ~dividend amount on ex-date.

### Bonus issue

- Free shares from reserves; no cash leaves the company.
- **Total market cap unchanged.** Per-share price falls in proportion.
- 1:1 bonus → shares double; price halves.
- Improves liquidity, signals management confidence.

### Stock split

- Reduces face value (e.g. ₹10 → ₹2 = 5-for-1 split).
- Number of shares × 5; price ÷ 5; market cap unchanged.
- Used to bring per-share price to a more retail-friendly range.

### Reverse split (consolidation)

- Opposite of split — reduce share count, raise price per share.
- Often used by penny stocks to stay above exchange-mandated minimum price.

### Rights issue

- Shares offered to existing holders **pro rata** at a discount to market.
- **Renounceable** — can sell rights entitlement on the exchange.
- Theoretical ex-rights price (TERP):
```
TERP = (Cum-rights price × existing shares + Issue price × new shares) / Total shares
```

### Buyback

- Company repurchases its own shares using surplus cash.
- **Reduces share count → boosts EPS, ROE.**
- Two routes: **Tender offer** (premium price; pro rata acceptance) or **Open market**.
- **Buyback tax: 23.296%** paid by company on distributed amount; tax-free in shareholder's hands (post FY20).
- Limits per Companies Act + SEBI Buyback Regulations: typically max 25% of paid-up capital + free reserves; min 50% acceptance ratio.

### Mergers & acquisitions

- **Merger** — two companies combine into one new entity.
- **Acquisition** — one company buys another; target may continue or be absorbed.
- **Swap ratio** — shares of acquirer issued per share of target. Negotiated based on relative valuation.
- **Open offer (SAST)** — acquirer crossing 25% must make a public offer for ≥26% more.

### Demerger / Spin-off

- One business unit hived off into a separate listed entity.
- Existing shareholders typically receive new co's shares pro rata.
- Often value-unlocking — improves transparency, allows different multiples.

### ESOP (Employee Stock Options)

- Grant → vesting period → exercise window.
- Dilutes EPS when exercised (common test point).
- Issued at a specified strike; intrinsic difference at exercise vs market = perquisite value, taxable.

### Adjustment for derivatives

When the underlying has a corporate action:

```
Adjustment factor = Price BEFORE the action / Price AFTER the action
New strike  = Old strike × (1 / factor)
New lot size = Old lot size × factor
```

For a 2:1 bonus: price halves → factor = 2 → strikes halved, lots doubled.

For dividends: adjust strike only if dividend is **>5% of stock price** (extraordinary); otherwise ignore.

## 🧠 Memory Hooks

- **Bonus + Split don't change market cap** — only the share count.
- **Record date = who's eligible; Ex-date = price drops.**
- **DDT abolished in FY21** — dividends now taxable at slab rate; TDS over ₹5,000.
- **Buyback boosts EPS** by reducing share count.
- **Buyback tax: 23.296% paid by company; recipient tax-free.**
- **Open offer triggered at 25%** stake crossing under SAST Regs.
- **Adjustment factor = Price before / Price after.** Same formula whether bonus, split, or rights.
- **Dividend > 5% → adjust strike;** otherwise ignore for derivatives.
