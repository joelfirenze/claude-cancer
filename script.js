/**
 * CancerInsight SG - Interactive JavaScript
 * Provides functionality for all pages including tabs, accordions,
 * calculators, filters, and Chart.js visualizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTabs();
    initAccordions();
    initCancerFilters();
    initTreatmentSelector();
    initCostCalculator();
    initSurvivalCharts();
    initFormHandling();
    initMobileNav();
});

// ============================================
// Tab Functionality
// ============================================
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabGroup = this.closest('.tabs') || this.parentElement;
            const tabId = this.getAttribute('data-tab');

            // Remove active from all tabs in this group
            tabGroup.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));

            // Add active to clicked tab
            this.classList.add('active');

            // Find the parent section to scope tab content
            const parentSection = this.closest('section') || this.closest('.tab-content')?.parentElement || document;

            // Hide all tab contents in this section
            parentSection.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Show selected tab content
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ============================================
// Accordion Functionality
// ============================================
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const isOpen = item.classList.contains('open');

            // Optional: close other accordions in same group
            // const accordion = item.closest('.accordion');
            // accordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

            // Toggle current
            if (isOpen) {
                item.classList.remove('open');
                content.style.maxHeight = null;
            } else {
                item.classList.add('open');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// ============================================
// Cancer Type Filters (index.html)
// ============================================
function initCancerFilters() {
    const genderFilter = document.getElementById('gender-filter');
    const sortFilter = document.getElementById('sort-filter');
    const cancerCards = document.querySelectorAll('.cancer-card');

    if (!genderFilter || !cancerCards.length) return;

    function filterAndSort() {
        const gender = genderFilter?.value || 'all';
        const sort = sortFilter?.value || 'prevalence';
        const container = document.querySelector('.cancer-grid');

        if (!container) return;

        let cards = Array.from(cancerCards);

        // Filter by gender
        cards.forEach(card => {
            const cardGender = card.getAttribute('data-gender') || 'both';
            if (gender === 'all' || cardGender === 'both' || cardGender === gender) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Sort visible cards
        const visibleCards = cards.filter(c => c.style.display !== 'none');

        visibleCards.sort((a, b) => {
            if (sort === 'prevalence') {
                const aRank = parseInt(a.getAttribute('data-prevalence')) || 999;
                const bRank = parseInt(b.getAttribute('data-prevalence')) || 999;
                return aRank - bRank;
            } else if (sort === 'survival') {
                const aSurvival = parseInt(a.getAttribute('data-survival')) || 0;
                const bSurvival = parseInt(b.getAttribute('data-survival')) || 0;
                return bSurvival - aSurvival;
            } else if (sort === 'alpha') {
                const aName = a.querySelector('h3')?.textContent || '';
                const bName = b.querySelector('h3')?.textContent || '';
                return aName.localeCompare(bName);
            }
            return 0;
        });

        // Reorder in DOM
        visibleCards.forEach(card => container.appendChild(card));
    }

    genderFilter?.addEventListener('change', filterAndSort);
    sortFilter?.addEventListener('change', filterAndSort);
}

// ============================================
// Treatment Page Selector
// ============================================
function initTreatmentSelector() {
    const cancerSelect = document.getElementById('cancer-select');
    if (!cancerSelect) return;

    cancerSelect.addEventListener('change', function() {
        const selected = this.value;

        // Hide all treatment sections
        document.querySelectorAll('.treatment-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        const targetSection = document.getElementById(selected + '-treatment');
        if (targetSection) {
            targetSection.style.display = 'block';

            // Re-initialize tabs and accordions for this section
            const tabs = targetSection.querySelectorAll('.tab-btn');
            if (tabs.length) {
                tabs[0].click();
            }
        }
    });

    // Trigger initial selection
    cancerSelect.dispatchEvent(new Event('change'));
}

// ============================================
// Cost Calculator
// ============================================
function initCostCalculator() {
    const calcBtn = document.getElementById('calc-estimate');
    if (!calcBtn) return;

    calcBtn.addEventListener('click', function() {
        const stage = document.getElementById('calc-stage')?.value;
        const hospital = document.getElementById('calc-hospital')?.value;
        const treatment = document.getElementById('calc-treatment')?.value;
        const pchi = document.getElementById('calc-pchi')?.value;

        // Cost estimates based on inputs
        const costs = calculateCosts(stage, hospital, treatment, pchi);

        // Display results
        const resultDiv = document.getElementById('cost-result');
        if (resultDiv) {
            resultDiv.style.display = 'block';

            document.getElementById('gross-cost').textContent = formatCurrency(costs.gross);
            document.getElementById('medishield-coverage').textContent = '-' + formatCurrency(costs.medishield);
            document.getElementById('maf-subsidy').textContent = '-' + formatCurrency(costs.maf);
            document.getElementById('oop-cost').textContent = formatCurrency(costs.oop);
        }
    });
}

function calculateCosts(stage, hospital, treatment, pchi) {
    // Base costs by treatment type (annual estimates)
    const treatmentCosts = {
        'surgery': { 'public-sub': 8000, 'public-priv': 25000, 'private': 45000 },
        'chemo': { 'public-sub': 12000, 'public-priv': 40000, 'private': 80000 },
        'radiation': { 'public-sub': 12000, 'public-priv': 30000, 'private': 50000 },
        'surgery-chemo': { 'public-sub': 18000, 'public-priv': 55000, 'private': 100000 },
        'surgery-chemo-rad': { 'public-sub': 28000, 'public-priv': 75000, 'private': 140000 },
        'targeted': { 'public-sub': 50000, 'public-priv': 90000, 'private': 120000 },
        'immuno': { 'public-sub': 80000, 'public-priv': 150000, 'private': 200000 },
        'combined': { 'public-sub': 120000, 'public-priv': 200000, 'private': 300000 }
    };

    // Stage multipliers
    const stageMultiplier = {
        'early': 0.6,
        'advanced': 1.0,
        'metastatic': 1.5
    };

    // MAF subsidy rates by PCHI
    const mafRates = {
        '0-1200': 0.75,
        '1201-2000': 0.75,
        '2001-2800': 0.60,
        '2801-3600': 0.50,
        '3601-4500': 0.50,
        '4501-5500': 0.40,
        '5501-6500': 0.40,
        'above-6500': 0
    };

    // Calculate gross cost
    let baseCost = treatmentCosts[treatment]?.[hospital] || 50000;
    let gross = Math.round(baseCost * (stageMultiplier[stage] || 1));

    // MediShield Life coverage estimate (simplified)
    let medishieldRate = hospital === 'public-sub' ? 0.5 : (hospital === 'public-priv' ? 0.3 : 0.15);
    let medishield = Math.round(gross * medishieldRate);

    // MAF subsidy (only for public subsidized and eligible drugs)
    let mafRate = mafRates[pchi] || 0;
    let eligibleForMaf = hospital === 'public-sub' && (treatment.includes('targeted') || treatment.includes('immuno') || treatment === 'combined');
    let maf = eligibleForMaf ? Math.round((gross - medishield) * mafRate * 0.5) : 0;

    // Out of pocket
    let oop = gross - medishield - maf;

    return { gross, medishield, maf, oop };
}

function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-SG');
}

// ============================================
// Survival Charts (Chart.js)
// ============================================
function initSurvivalCharts() {
    const chartCanvas = document.getElementById('survival-chart');
    if (!chartCanvas || typeof Chart === 'undefined') return;

    // Cancer survival data by stage
    const survivalData = {
        'breast': {
            labels: ['Diagnosis', '1 Year', '3 Years', '5 Years', '10 Years'],
            datasets: [
                {
                    label: 'Stage I',
                    data: [100, 99, 98, 98, 95],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage II',
                    data: [100, 97, 92, 90, 82],
                    borderColor: '#84cc16',
                    backgroundColor: 'rgba(132, 204, 22, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage III',
                    data: [100, 90, 75, 72, 55],
                    borderColor: '#eab308',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage IV',
                    data: [100, 65, 40, 28, 15],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true
                }
            ]
        },
        'colorectal': {
            labels: ['Diagnosis', '1 Year', '3 Years', '5 Years', '10 Years'],
            datasets: [
                {
                    label: 'Stage I',
                    data: [100, 98, 94, 91, 85],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage II',
                    data: [100, 94, 85, 82, 70],
                    borderColor: '#84cc16',
                    backgroundColor: 'rgba(132, 204, 22, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage III',
                    data: [100, 88, 72, 65, 50],
                    borderColor: '#eab308',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage IV',
                    data: [100, 50, 22, 14, 8],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true
                }
            ]
        },
        'lung': {
            labels: ['Diagnosis', '1 Year', '3 Years', '5 Years', '10 Years'],
            datasets: [
                {
                    label: 'Stage I',
                    data: [100, 88, 72, 63, 45],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage II',
                    data: [100, 75, 52, 45, 30],
                    borderColor: '#84cc16',
                    backgroundColor: 'rgba(132, 204, 22, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage III',
                    data: [100, 55, 28, 18, 10],
                    borderColor: '#eab308',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage IV',
                    data: [100, 30, 10, 6, 3],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true
                }
            ]
        },
        'prostate': {
            labels: ['Diagnosis', '1 Year', '3 Years', '5 Years', '10 Years'],
            datasets: [
                {
                    label: 'Stage I',
                    data: [100, 100, 99, 99, 98],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage II',
                    data: [100, 99, 99, 98, 95],
                    borderColor: '#84cc16',
                    backgroundColor: 'rgba(132, 204, 22, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage III',
                    data: [100, 98, 95, 92, 80],
                    borderColor: '#eab308',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    fill: true
                },
                {
                    label: 'Stage IV',
                    data: [100, 75, 50, 32, 18],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true
                }
            ]
        }
    };

    // Default to breast cancer
    let currentCancer = 'breast';

    const ctx = chartCanvas.getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: survivalData[currentCancer],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Survival Rate by Stage Over Time',
                    font: { size: 16 }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '% survival';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Survival Rate (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time Since Diagnosis'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Cancer type selector for chart
    const chartCancerSelect = document.getElementById('chart-cancer-select');
    if (chartCancerSelect) {
        chartCancerSelect.addEventListener('change', function() {
            currentCancer = this.value;
            if (survivalData[currentCancer]) {
                chart.data = survivalData[currentCancer];
                chart.update();
            }
        });
    }
}

// ============================================
// Form Handling (Assessment Page)
// ============================================
function initFormHandling() {
    const assessmentForm = document.getElementById('assessment-form');
    if (!assessmentForm) return;

    assessmentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(assessmentForm);
        const data = Object.fromEntries(formData.entries());

        // Store in sessionStorage for use on other pages
        sessionStorage.setItem('healthProfile', JSON.stringify(data));

        // Show confirmation
        const resultDiv = document.getElementById('assessment-result');
        if (resultDiv) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h4>Profile Saved</h4>
                    <p>Your health profile has been saved for this session. You can now explore survival rates and treatment options tailored to your profile.</p>
                    <p><a href="survival.html" class="btn btn-primary">View Survival Rates</a> <a href="treatment.html" class="btn btn-secondary">View Treatments</a></p>
                </div>
            `;
        }

        // Scroll to result
        resultDiv?.scrollIntoView({ behavior: 'smooth' });
    });

    // Load existing profile if available
    const savedProfile = sessionStorage.getItem('healthProfile');
    if (savedProfile) {
        try {
            const data = JSON.parse(savedProfile);
            Object.keys(data).forEach(key => {
                const input = assessmentForm.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = data[key] === 'on' || data[key] === true;
                    } else {
                        input.value = data[key];
                    }
                }
            });
        } catch (e) {
            console.error('Error loading saved profile:', e);
        }
    }
}

// ============================================
// Mobile Navigation
// ============================================
function initMobileNav() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    // Create mobile menu toggle
    const navLinks = nav.querySelector('.nav-links');
    if (!navLinks) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle';
    toggleBtn.innerHTML = '☰';
    toggleBtn.setAttribute('aria-label', 'Toggle navigation');

    nav.querySelector('.nav-brand')?.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', function() {
        navLinks.classList.toggle('open');
        this.innerHTML = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggleBtn.innerHTML = '☰';
        });
    });
}

// ============================================
// Utility Functions
// ============================================

// Smooth scroll to element
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate age from date
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Survival Rate Adjustments
// ============================================

// Hazard ratios from research for comorbidity adjustments
const hazardRatios = {
    diabetes: 1.41,
    hypertension: 1.15,
    heartDisease: 1.30,
    kidneyDisease: 1.50,
    liverDisease: 1.45,
    copd: 1.35,
    obesity: 1.20,
    smoking: {
        current: 2.15,
        former: 1.45,
        never: 1.0
    },
    lowActivity: 1.59
};

// Adjust survival rate based on comorbidities
function adjustSurvivalRate(baseSurvival, comorbidities) {
    let adjustedSurvival = baseSurvival;

    // Apply hazard ratios (simplified model)
    comorbidities.forEach(condition => {
        if (hazardRatios[condition]) {
            const hr = typeof hazardRatios[condition] === 'object'
                ? hazardRatios[condition].current
                : hazardRatios[condition];
            // Convert HR to survival adjustment (simplified)
            adjustedSurvival = adjustedSurvival / hr;
        }
    });

    // Don't go below 5%
    return Math.max(5, Math.round(adjustedSurvival));
}

// Get user's comorbidities from stored profile
function getUserComorbidities() {
    const profile = sessionStorage.getItem('healthProfile');
    if (!profile) return [];

    try {
        const data = JSON.parse(profile);
        const comorbidities = [];

        if (data.diabetes) comorbidities.push('diabetes');
        if (data.hypertension) comorbidities.push('hypertension');
        if (data.heartDisease) comorbidities.push('heartDisease');
        if (data.kidneyDisease) comorbidities.push('kidneyDisease');
        if (data.liverDisease) comorbidities.push('liverDisease');
        if (data.copd) comorbidities.push('copd');
        if (data.smokingStatus === 'current') comorbidities.push('smoking');
        if (data.activityLevel === 'low') comorbidities.push('lowActivity');

        return comorbidities;
    } catch (e) {
        return [];
    }
}

// ============================================
// Print Functionality
// ============================================
function printPage() {
    window.print();
}

// Add print button functionality
document.querySelectorAll('.print-btn').forEach(btn => {
    btn.addEventListener('click', printPage);
});

// ============================================
// Accessibility Enhancements
// ============================================

// Keyboard navigation for accordions
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('accordion-header')) {
            e.preventDefault();
            e.target.click();
        }
    }
});

// Skip to main content
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
    skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
            main.tabIndex = -1;
            main.focus();
        }
    });
}
