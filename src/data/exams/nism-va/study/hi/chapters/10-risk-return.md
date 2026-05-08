---
chapter: 10
title: जोखिम, रिटर्न और प्रदर्शन
topicCode: RSK
marks: 7
difficulty: medium
priority: 2
estimatedMinutes: 14
---

## 🎯 Summary Card

रिटर्न = पूँजीगत लाभ + आय। **CAGR ≥ 1 साल; absolute < 1 साल; XIRR SIP के लिए**। **σ = कुल जोखिम; β = सिस्टमैटिक जोखिम**। **विविधीकरण unsystematic risk घटाता है, systematic नहीं**। जोखिम-समायोजित: **Sharpe (कुल), Treynor (β), Jensen's α, Information Ratio, Sortino (downside)**। बेंचमार्क **TRI** के विरुद्ध; **alpha > 0** = outperformance। **Tracking error LOWER = बेहतर** index funds के लिए।

## 📖 Core Content

### रिटर्न के माप

| माप | सूत्र | उपयोग |
|---|---|---|
| **HPR** | (अंत − प्रारंभ + आय) / प्रारंभ | < 1 साल |
| **CAGR** | (अंत/प्रारंभ)^(1/n) − 1 | ≥ 1 साल |
| **Annualised** | CAGR के समान simple growth | मानक ≥ 1 yr |
| **Rolling return** | कई overlapping windows पर CAGR | start-date dependency कम |
| **XIRR** | irregular cash flows के लिए IRR | SIP, STP |

> **Rolling returns > point-to-point** — honest तुलना के लिए।

### जोखिम के माप

| माप | क्या मापता है |
|---|---|
| **σ (मानक विचलन)** | कुल volatility |
| **β (Beta)** | बेंचमार्क के प्रति sensitivity |
| **Downside deviation** | केवल negative रिटर्न की volatility |
| **VaR** | X% प्रायिकता पर loss |
| **Max drawdown** | peak-to-trough largest loss |
| **Tracking error** | σ of (scheme − benchmark) |

### Systematic vs Unsystematic risk

| प्रकार | उदाहरण | Diversifiable? |
|---|---|---|
| **Unsystematic** | एक कंपनी की हड़ताल, regulatory action, CEO निकलना | **हाँ** |
| **Systematic** | recession, ब्याज दर शॉक, युद्ध, महामारी | **नहीं** |

**कुल जोखिम = Systematic + Unsystematic**। विविधीकृत पोर्टफोलियो में केवल systematic बचता है।

### Beta — systematic जोखिम मेट्रिक

```
β = Cov(stock return, market return) / Var(market return)
```

| β | व्यवहार |
|---|---|
| 0 | बाज़ार से uncorrelated |
| < 1 | बाज़ार से कम volatile (defensive) |
| 1 | बाज़ार के साथ चलता है |
| > 1 | बाज़ार moves को amplify |
| < 0 | inversely correlated (दुर्लभ) |

### CAPM

```
अपेक्षित रिटर्न = Rf + β × (Rm − Rf)

  Rf  = जोखिम-मुक्त दर (10-yr G-Sec)
  Rm  = अपेक्षित बाजार रिटर्न
  β   = stock beta
  Rm − Rf = equity risk premium (5-7% भारत में)
```

### जोखिम-समायोजित रिटर्न माप

| माप | सूत्र | उच्च = बेहतर | उपयोग |
|---|---|---|---|
| **Sharpe** | (Rp − Rf) / σ_p | ✓ | कुल-जोखिम आधार |
| **Treynor** | (Rp − Rf) / β_p | ✓ | well-diversified portfolio |
| **Jensen's α** | Rp − [Rf + β(Rm − Rf)] | ✓ | active मैनेजर skill |
| **Information Ratio** | (Rp − Rb) / Tracking Error | ✓ | active मैनेजर efficiency |
| **Sortino** | (Rp − target) / Downside Deviation | ✓ | केवल downside vol |

> Sharpe सभी volatility को penalise करता है; Sortino केवल downside को।

### विविधीकरण गणित

```
दो परिसंपत्तियों का पोर्टफोलियो वैरियंस:
σ_p² = w_A² σ_A² + w_B² σ_B² + 2 w_A w_B ρ_AB σ_A σ_B
```

ρ < 1 → अधिक विविधीकरण लाभ। **कम सहसंबंध वाली परिसंपत्ति जोड़ने से जोखिम कम** होता है, चाहे उसका individual जोखिम अधिक हो।

### Markowitz Efficient Frontier

- हर अपेक्षित रिटर्न के लिए **न्यूनतम जोखिम** वाला पोर्टफोलियो।
- सेट = **Efficient Frontier**।
- जोखिम-मुक्त परिसंपत्ति जोड़ने पर → **Capital Market Line (CML)**।

### जोखिम वरीयताएँ

- **Risk-averse** — उच्च जोखिम के लिए उच्च अपेक्षित रिटर्न।
- **Risk-neutral** — केवल अपेक्षित रिटर्न पर ध्यान।
- **Risk-seeking** — कम अपेक्षित रिटर्न पर भी उच्च जोखिम स्वीकार (दुर्लभ)।

## 🧠 Memory Hooks

- **Geometric ≤ Arithmetic mean** हमेशा। Geometric = वास्तविक कमाई।
- **σ = कुल जोखिम; β = systematic जोखिम**।
- **विविधीकरण = unsystematic killer**, systematic untouchable।
- **Sharpe = कुल; Treynor = β; Sortino = downside; IR = active efficiency**।
- **Jensen's α > 0 = manager beat CAPM**।
- **CAPM: Rf + β × ERP**।
- **कम ρ = अधिक विविधीकरण लाभ**।
- **Markowitz Efficient Frontier + CML = MPT core**।
