---
title: Common Traps — questions where most candidates lose marks
---

# Common Traps

The answers below are reverse-engineered from question patterns most candidates miss. Skim before every mock; revisit before exam.

## 1. Forward vs Future — who pays margin

> "In a forward contract, only the buyer pays initial margin." — **FALSE.** Forwards have **no formal margin** at all (bilateral OTC). In a **future**, **both buyer and seller** pay initial margin because **both have skin in the game** (binding obligations).

## 2. American vs European in India

> Most candidates flip these. **All Indian index AND stock options are European** (exercise on expiry only). American-style options aren't traded on Indian exchanges. Don't be misled by US-context questions in older question banks.

## 3. ITM definitions — calls vs puts

| | Call | Put |
|---|---|---|
| ITM | Spot **>** Strike | Spot **<** Strike |

The cheat sheet: "**C**all is **C**eiling-up; **P**ut is **D**rop-down." Always reread the question — half of moneyness traps work by reversing the natural intuition.

## 4. Intrinsic value can never be negative

> "Intrinsic value of an OTM call = Strike − Spot." — **FALSE.** Intrinsic value is **always ≥ 0**. For OTM options, intrinsic = 0 and the entire premium is **time value**. The holder simply doesn't exercise.

## 5. Time decay (Theta) hits BUYERS

> Theta is **negative for long options** (buyer loses), **positive for short options** (writer earns). Many candidates think theta is "always negative" — it's only negative for the holder.

## 6. Open Interest ≠ Volume

- **OI** = outstanding contracts at a snapshot.
- **Volume** = contracts traded in a window.

> "If A closes a short by buying back from E (a new short), OI changes." — **FALSE.** OI stays the same; A's short is just transferred to E. Only **new positions** change OI.

## 7. Basis sign

> "Basis = Future − Spot." — **FALSE.** **Basis = Spot − Future.** When **F > S**, basis is **negative** (premium / contango). Goes to **zero at expiry** because final settlement is at spot.

## 8. NSE vs BSE expiry

- **NSE: last Tuesday.** BSE: last Thursday. (Per SEBI's 2025 rule, each exchange picks one.)
- Don't confuse with the older "last Thursday for NSE" rule (changed in 2025).

## 9. Stock F&O = physical delivery (since Oct 2019)

> "All equity F&O is cash settled in India." — **FALSE.** **Stock F&O = physical delivery on expiry; index F&O = cash settled.** Physical delivery brings STT-on-delivery + capital-gains rule risk.

## 10. Initial margin is NOT an expense

In accounting:
- **Initial margin** → balance sheet (Current Asset).
- **MTM loss** → P&L only on a debit balance (prudence rule).
- **MTM gain** → ignored until realised.
- Released initial margin → Bank Dr; Initial Margin Cr.

## 11. Tax: derivatives are NON-speculative

> Section 43(5)(d): equity derivatives traded on a recognised exchange are **non-speculative business income**. Loss can be set off against any business income, **carried forward 8 years** (vs 4 for speculative).

## 12. "Turnover" for tax audit

> NOT the contract value. Turnover = **|profit| + |loss| per trade** + **option premium received** on options written. Mis-reporting this is the #1 audit trigger for derivatives traders.

## 13. RDD timing

> RDD must be signed at **client onboarding**, NOT before the first trade. A pre-trade signing is NOT compliant. SEBI checks this in inspections.

## 14. Sub-broker → Authorised Person

> Sub-brokers ceased to exist on **April 1, 2019**. Anyone calling themselves "sub-broker" today is non-compliant. Authorised Persons (APs) replaced the role.

## 15. Position-limit mechanic

> Once a TM hits position limit, they can ONLY trade to **reduce** exposure. New positions blocked even if cash is available. Misread as "trade halted entirely" — only fresh openers are blocked.

## 16. Hedge ratio — beta is in the numerator

```
Hedge ratio (lots) = (β × Portfolio value) / (Future price × Lot size)
```

Forgetting beta gives you the wrong number of contracts. β = 1.5 portfolio needs 50% MORE contracts than a β = 1 portfolio of the same value.

## 17. Put-call parity — only for European, same strike + expiry

> Don't apply to American options or to combinations across different strikes/expiries. Many wrong-answer trap questions misuse the formula on American or different-strike combos.

## 18. Impact cost is asymmetric

> Impact cost when buying ≠ impact cost when selling, for the same size and book. Each side reads the opposite half of the order book. Always specify the side.

## 19. Operating range vs price band

> Equity derivatives have **NO contract-level price band** (unlike cash equities). Instead they have a **±10% operating range** that triggers a **price freeze** (sent for confirmation, not auto-rejected). Different rule, often confused.

## 20. SEBI 2024 dynamic-band tightening

> Old rule for flexing the band: 25 trades + 5 unique traders on each side. **New rule (May 2024): 50 trades + 10 unique traders + 3 brokerages on each side.** Updated questions test the new threshold.

## 21. Suitability — RDD doesn't absolve the broker

> "After signing the RDD the client is on their own." — **FALSE.** Broker still owes the **suitability** duty. Recommending complex options to an inexperienced senior citizen is a violation **even with a signed RDD**.

## 22. Greeks — Vega applies to BOTH calls and puts (positive for long, negative for short)

> "Vega only matters for puts." — **FALSE.** Vega is positive for any long option (call OR put) and negative for any short option. Volatility lifts both sides of the strike.

## 23. Put-call ratio interpretation

> PCR > 1 in isolation = bearish (puts > calls). At **extremes**, treat as **contrarian** signal (oversold/overbought). Don't read PCR in a vacuum.

## 24. SCORES + SMARTODR are separate steps

> SCORES is SEBI's complaint portal; ODR is the dispute-resolution mechanism. Old exchange-arbitration mechanism for retail has been **replaced by SMARTODR**. Cascade: Broker → SCORES → SMARTODR.

## 25. Cross-default in member discipline

> Default on one segment of one exchange = default on **ALL segments + ALL exchanges** where the member operates. Career-ending event for a broker.
