# CancerInsight SG - Data Sources & Website Structure

## Overview

CancerInsight SG is a static educational website about cancer survival rates, treatment options, costs, and support resources in Singapore. Built with vanilla HTML, CSS, and JavaScript with no backend infrastructure.

---

## Website Structure

```
claude_cancer/
├── index.html          # Homepage - Cancer type overview & statistics
├── assessment.html     # Health profile assessment form
├── survival.html       # Survival rates data and charts
├── treatment.html      # Treatment options by cancer type
├── costs.html          # Treatment costs & financing information
├── resources.html      # Support resources & contact information
├── script.js           # Unified JavaScript for all pages
└── styles.css          # Unified stylesheet
```

### Technology Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (no frameworks)
- **Charting:** Chart.js (loaded from CDN)
- **Fonts:** Google Fonts (Inter, Playfair Display)
- **Design:** Responsive, mobile-first with breakpoints at 1024px, 768px, 480px

---

## Data Sources

### 1. Singapore Cancer Registry

**Source:** Singapore Cancer Registry Annual Report 2022
**URL:** https://www.nrdo.gov.sg/publications/cancer
**Used for:**
- Total case counts (87,716 cases from 2018-2022)
- Daily new case rate (48 cases/day)
- Mortality rate (72 deaths per 100,000)
- Cancer prevalence rankings
- 5-year survival rates by cancer type

**Location in codebase:** `index.html` (data attributes on cancer cards)

---

### 2. SEER (Surveillance, Epidemiology, and End Results Program)

**Source:** National Cancer Institute SEER Program
**URLs:**
- https://seer.cancer.gov/statfacts/
- https://seer.cancer.gov/statistics-network/explorer/

**Used for:**
- Survival rate curves by stage (1, 3, 5, 10-year survival)
- Stage-specific survival percentages
- Comparison data for US cancer statistics

**Location in codebase:** `script.js` (survivalData object, lines 262-395)

**Cancer types with survival data:**
- Breast Cancer (Stages I-IV)
- Colorectal Cancer (Stages I-IV)
- Lung Cancer (Stages I-IV)
- Prostate Cancer (Stages I-IV)

---

### 3. GLOBOCAN 2022

**Source:** Global Cancer Observatory (International Agency for Research on Cancer)
**URL:** https://gco.iarc.who.int/

**Used for:**
- Global cancer incidence data
- Comparative international statistics
- Cancer burden estimates

**Location in codebase:** Referenced in survival.html and treatment.html

---

### 4. NCCN Clinical Practice Guidelines 2024

**Source:** National Comprehensive Cancer Network
**URL:** https://www.nccn.org/

**Used for:**
- Treatment protocols by cancer type and stage
- First-line treatment recommendations
- Second-line treatment options
- Drug reference information
- Side effect management guidelines

**Location in codebase:** `treatment.html` (99.4 KB of treatment protocols)

**Cancer types covered:**
- Prostate, Breast, Colorectal, Lung, Liver, Stomach
- Uterine, Ovarian, Lymphoma, Thyroid, Kidney
- Bladder, Pancreatic, Nasopharyngeal, Cervical

---

### 5. Research Publications

#### Hazard Ratios for Comorbidity Adjustments

**Sources:**
- Nature Scientific Reports 2024 (diabetes and cancer mortality)
- American Cancer Society Cancer Statistics 2024
- Various peer-reviewed studies on comorbidity-cancer interactions

**Used for survival adjustment factors:**

| Condition | Hazard Ratio | Source |
|-----------|--------------|--------|
| Diabetes | 1.41 | Nature Scientific Reports 2024 |
| Hypertension | 1.15 | Epidemiological studies |
| Heart Disease | 1.30 | Cardiovascular-oncology research |
| Kidney Disease | 1.50 | Nephrology studies |
| Liver Disease | 1.45 | Hepatology research |
| COPD | 1.35 | Pulmonology studies |
| Obesity | 1.20 | Metabolic studies |
| Smoking (current) | 2.15 | Tobacco research |
| Smoking (former) | 1.45 | Tobacco research |
| Low Physical Activity | 1.59 | Exercise oncology studies |

**Location in codebase:** `script.js` (hazardRatios object, lines 594-608)

---

### 6. Singapore Healthcare Financing Data

**Sources:**
- Ministry of Health Singapore
- MediShield Life scheme documentation
- Medisave-approved Integrated Shield Plan guidelines
- Medical Assistance Fund (MAF) guidelines

**Used for:**

#### MediShield Life Coverage Rates
| Hospital Setting | Coverage Rate |
|------------------|---------------|
| Public Subsidized | 50% |
| Public Private | 30% |
| Private Hospital | 15% |

#### MAF Subsidy Brackets (by Per Capita Household Income)
| PCHI Range | Subsidy Rate |
|------------|--------------|
| $0 - $1,200 | 75% |
| $1,201 - $1,800 | 60% |
| $1,801 - $2,600 | 50% |
| $2,601 - $3,500 | 40% |
| $3,501 - $4,500 | 30% |
| $4,501 - $5,500 | 20% |
| $5,501 - $6,500 | 10% |
| Above $6,500 | 0% |

**Location in codebase:** `script.js` (lines 199-247)

---

### 7. Treatment Cost Estimates

**Sources:**
- Singapore General Hospital published rates
- National Cancer Centre Singapore fee schedules
- Private hospital published rates
- Healthcare industry reports

**Cost categories covered:**
- Surgery (by procedure type)
- Chemotherapy (per cycle)
- Radiation therapy
- Targeted therapy
- Immunotherapy
- Supportive care
- Hospital stays

**Location in codebase:** `script.js` (treatmentCosts object) and `costs.html`

---

## External Services (CDN)

### Google Fonts
```
https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap
```
- Provides: Inter (sans-serif) and Playfair Display (serif) fonts

### Chart.js
```
https://cdn.jsdelivr.net/npm/chart.js
```
- Provides: JavaScript charting library for survival rate visualizations

---

## Client-Side Data Storage

### SessionStorage
- **Key:** `healthProfile`
- **Contents:** User's health assessment responses (JSON)
- **Scope:** Browser session only (cleared on close)
- **Purpose:** Persist user input across page navigation

---

## Data Flow

```
Static HTML/JS Data
        ↓
  User Interaction
        ↓
  Client-side Processing
  (filtering, calculations, chart rendering)
        ↓
  DOM Updates / SessionStorage
        ↓
  Display to User
```

**Key processing functions:**
1. `calculateCosts()` - Computes out-of-pocket costs based on treatment, hospital, stage, and income
2. `adjustSurvivalRate()` - Modifies survival estimates based on user comorbidities
3. `initSurvivalCharts()` - Renders Chart.js survival curves
4. `filterAndSort()` - Filters cancer cards by gender and sorts by selected criteria

---

## Data Update Requirements

| Data Type | Update Frequency | Source to Monitor |
|-----------|------------------|-------------------|
| Cancer statistics | Annually | Singapore Cancer Registry |
| Survival rates | Annually | SEER, Singapore Cancer Registry |
| Treatment protocols | As guidelines change | NCCN |
| Healthcare costs | Annually | MOH, hospitals |
| Financing schemes | As policies change | MOH, CPF Board |

---

## Important Disclaimers

- All information is for educational purposes only
- Not a substitute for professional medical advice
- Cost estimates are approximate and may vary
- Treatment protocols should be discussed with oncologists
- Survival rates are population-based and individual outcomes vary

---

*Last updated: January 2026*
