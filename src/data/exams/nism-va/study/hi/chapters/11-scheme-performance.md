---
chapter: 11
title: म्यूचुअल फंड स्कीम का प्रदर्शन
topicCode: PRF
marks: 7
difficulty: easy
priority: 2
estimatedMinutes: 12
---

## 🎯 Summary Card

प्रदर्शन = **NAV-आधारित कुल रिटर्न** (पुनर्निवेश सहित)। तीन क्षितिज: **point-to-point, rolling, CAGR**। बेंचमार्क **TRI** के विरुद्ध। **Past performance ≠ guarantee** (SEBI mandate)। **Tracking error कम = बेहतर** index funds; **alpha** active funds। **Sharpe / Sortino / IR** जोखिम-समायोजित। NAV दैनिक 11 PM तक; मासिक factsheet 10 दिनों में; अर्ध-वार्षिक portfolio 30 दिनों में।

## 📖 Core Content

### रिटर्न माप

| माप | सूत्र | उपयोग |
|---|---|---|
| **Absolute** | (अंत − प्रारंभ) / प्रारंभ | < 1 साल |
| **CAGR** | (अंत/प्रारंभ)^(1/n) − 1 | ≥ 1 साल |
| **Annualised** | CAGR के समान | ≥ 1 yr मानक |
| **Rolling** | overlapping windows पर CAGR | start-date dependency कम |
| **Point-to-point** | दो specified dates के बीच CAGR | headline |

> **Rolling > point-to-point** honest तुलना के लिए — दिखाते हैं consistency, luck of dates नहीं।

### बेंचमार्क तुलना

हर स्कीम SID में बेंचमार्क बताती है। **Alpha** = स्कीम − बेंचमार्क।

```
Alpha (simple) = Rp − Rb
Jensen's Alpha = Rp − [Rf + β × (Rm − Rf)]   (CAPM-adjusted)
```

Positive alpha = outperformance। **persistent positive alpha = मैनेजर skill** (दुर्लभ)।

### जोखिम-समायोजित माप

| माप | सूत्र | उच्च = बेहतर |
|---|---|---|
| **Sharpe** | (Rp − Rf) / σ_p | ✓ |
| **Sortino** | (Rp − Rf) / Downside σ | ✓ (केवल downside) |
| **Information Ratio** | (Rp − Rb) / Tracking Error | ✓ (active efficiency) |
| **Treynor** | (Rp − Rf) / β_p | ✓ (well-diversified) |

### Tracking error

```
Tracking Error = σ of (Scheme return − Benchmark return)
```

**कम TE = बेहतर tracking**। कारण: cash holdings (redemption के लिए), expenses, rebalancing lag।

### Beta + R²

- **β = 1** → बेंचमार्क के साथ; > 1 अधिक volatile; < 1 कम।
- **R²** (0-1): उच्च = बेंचमार्क द्वारा explained; कम = idiosyncratic factors।

### Standard deviation (σ)

स्कीम returns की कुल volatility। कम = stable।

### स्कीम वर्गीकरण + तुलना

**एक ही श्रेणी** के स्कीम तुलना करें (Large Cap, Large Cap के साथ)। SEBI के Oct 2017 ढाँचे ने apples-to-oranges तुलना से बचाया।

### Star ratings

CRISIL, Morningstar, Value Research स्टार रेटिंग देते हैं। **एक रेटिंग पर निर्भर न रहें**। साथ देखें:
- दीर्घकालिक consistency (5+ साल)
- मैनेजर tenure + skill
- खर्च अनुपात
- जोखिम-समायोजित रिटर्न
- पोर्टफोलियो गुणवत्ता (concentration, sector bets, churn)

### Past performance disclaimer

SEBI mandate: "Past performance may or may not be sustained in the future." वितरक past performance को **एकमात्र विक्रय बिंदु** न बनाएँ। रिटर्न **गारंटी नहीं**।

### SIP रिटर्न vs lump-sum CAGR

SIP रिटर्न **XIRR** से (irregular cash flows के लिए IRR)। अधिकांश factsheets दोनों दिखाते हैं।

### प्रदर्शन रिपोर्टिंग समय-सीमाएँ

- **दैनिक NAV** — 11 PM तक AMC + AMFI साइट पर
- **मासिक factsheet** — महीने-समाप्ति के 10 दिनों के अंदर
- **अर्ध-वार्षिक portfolio** — आधे-वर्ष-समाप्ति के 30 दिनों के अंदर
- **वार्षिक रिपोर्ट** — FY-समाप्ति के 4 महीने के अंदर

## 🧠 Memory Hooks

- **CAGR ≥ 1 yr; absolute < 1 yr; XIRR SIP के लिए**।
- **Rolling > point-to-point** honest तुलना।
- **Alpha > 0 = बेंचमार्क outperformance**।
- **Sharpe = कुल; Treynor = β; Sortino = downside; IR = active vs benchmark**।
- **Tracking Error कम = बेहतर** index funds।
- **β = 1 बेंचमार्क के साथ; > 1 अधिक volatile**।
- **Past performance ≠ guarantee** — SEBI mandate।
- **NAV 11 PM; factsheet 10 दिन; अर्ध-वार्षिक 30 दिन**।
