/**
 * Investments Page Script
 * Handles all investment-related functionality
 */

// Investment plans configuration
const investmentPlans = {
    basic: {
        id: 'basic',
        name: 'الخطة الأساسية',
        dailyReturn: 1.5,
        minInvestment: 50,
        maxInvestment: 999,
        duration: 30,
        totalReturn: 45,
        icon: 'fa-star',
        color: '#3498db',
        features: [
            'عائد يومي 1.5%',
            'الحد الأدنى $50',
            'مدة 30 يوم',
            'سحب يومي',
            'دعم فني 24/7'
        ],
        popular: false
    },
    professional: {
        id: 'professional',
        name: 'الخطة الاحترافية',
        dailyReturn: 2.5,
        minInvestment: 1000,
        maxInvestment: 9999,
        duration: 30,
        totalReturn: 75,
        icon: 'fa-gem',
        color: '#2ecc71',
        features: [
            'عائد يومي 2.5%',
            'الحد الأدنى $1,000',
            'مدة 30 يوم',
            'سحب يومي',
            'مدير حساب شخصي',
            'أولوية في الدعم'
        ],
        popular: true
    },
    enterprise: {
        id: 'enterprise',
        name: 'خطة المؤسسات',
        dailyReturn: 3.5,
        minInvestment: 10000,
        maxInvestment: 1000000,
        duration: 30,
        totalReturn: 105,
        icon: 'fa-crown',
        color: '#f39c12',
        features: [
            'عائد يومي 3.5%',
            'الحد الأدنى $10,000',
            'مدة 30 يوم',
            'سحب فوري',
            'مدير حساب مخصص',
            'استشارات مالية مجانية',
            'دعم VIP'
        ],
        popular: false
    }
};

// Demo active investments
const activeInvestments = [
    {
        id: 'INV001',
        plan: 'professional',
        amount: 5000,
        startDate: '2025-12-15',
        endDate: '2026-01-14',
        daysElapsed: 15,
        daysRemaining: 15,
        totalEarned: 1875,
        dailyEarnings: 125,
        status: 'active',
        autoReinvest: true
    },
    {
        id: 'INV002',
        plan: 'basic',
        amount: 500,
        startDate: '2025-12-20',
        endDate: '2026-01-19',
        daysElapsed: 10,
        daysRemaining: 20,
        totalEarned: 75,
        dailyEarnings: 7.5,
        status: 'active',
        autoReinvest: false
    }
];

// Demo investment history
const investmentHistory = [
    {
        id: 'INV000',
        plan: 'basic',
        amount: 1000,
        startDate: '2025-11-01',
        endDate: '2025-12-01',
        totalEarned: 450,
        status: 'completed'
    }
];

// Current investment state
let selectedPlan = null;
let investmentAmount = 0;

/**
 * Initialize investments page
 */
function initInvestmentsPage() {
    renderInvestmentPlans();
    renderActiveInvestments();
    renderInvestmentHistory();
    updateInvestmentStats();
    initInvestmentActions();
}

/**
 * Render investment plans
 */
function renderInvestmentPlans() {
    const container = document.getElementById('investmentPlansContainer');
    if (!container) return;

    container.innerHTML = Object.values(investmentPlans).map(plan => `
        <div class="investment-plan-card ${plan.popular ? 'popular' : ''}" data-plan="${plan.id}">
            ${plan.popular ? '<div class="plan-badge">الأكثر شعبية</div>' : ''}
            <div class="plan-header" style="background: ${plan.color};">
                <i class="fas ${plan.icon} fa-3x"></i>
                <h3>${plan.name}</h3>
                <div class="plan-return">
                    <span class="return-value">${plan.dailyReturn}%</span>
                    <span class="return-label">يومياً</span>
                </div>
            </div>
            <div class="plan-body">
                <div class="plan-details">
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>الحد الأدنى: <strong>$${plan.minInvestment.toLocaleString()}</strong></span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>المدة: <strong>${plan.duration} يوم</strong></span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-chart-line"></i>
                        <span>العائد الكلي: <strong>${plan.totalReturn}%</strong></span>
                    </div>
                </div>
                <div class="plan-features">
                    <h4>المميزات:</h4>
                    <ul>
                        ${plan.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="plan-calculator">
                    <label>احسب أرباحك:</label>
                    <input type="number" 
                           class="plan-calc-input" 
                           placeholder="أدخل المبلغ"
                           min="${plan.minInvestment}"
                           data-plan="${plan.id}">
                    <div class="calc-result" id="calcResult-${plan.id}">
                        <div>الربح اليومي: <strong>$0.00</strong></div>
                        <div>الربح الشهري: <strong>$0.00</strong></div>
                        <div>الربح الكلي: <strong>$0.00</strong></div>
                    </div>
                </div>
                <button class="btn-primary btn-block" onclick="selectPlan('${plan.id}')">
                    <i class="fas fa-rocket"></i> استثمر الآن
                </button>
            </div>
        </div>
    `).join('');

    // Initialize calculators
    initPlanCalculators();
}

/**
 * Initialize plan calculators
 */
function initPlanCalculators() {
    const calcInputs = document.querySelectorAll('.plan-calc-input');
    
    calcInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const planId = e.target.getAttribute('data-plan');
            const amount = parseFloat(e.target.value) || 0;
            calculatePlanReturns(planId, amount);
        });
    });
}

/**
 * Calculate plan returns
 */
function calculatePlanReturns(planId, amount) {
    const plan = investmentPlans[planId];
    if (!plan) return;

    const dailyProfit = amount * (plan.dailyReturn / 100);
    const monthlyProfit = dailyProfit * 30;
    const totalProfit = amount * (plan.totalReturn / 100);

    const resultDiv = document.getElementById(`calcResult-${planId}`);
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div>الربح اليومي: <strong>$${dailyProfit.toFixed(2)}</strong></div>
            <div>الربح الشهري: <strong>$${monthlyProfit.toFixed(2)}</strong></div>
            <div>الربح الكلي: <strong>$${totalProfit.toFixed(2)}</strong></div>
        `;
    }
}

/**
 * Select investment plan
 */
function selectPlan(planId) {
    selectedPlan = planId;
    const plan = investmentPlans[planId];
    
    if (!plan) return;

    showInvestmentModal(plan);
}

/**
 * Show investment modal
 */
function showInvestmentModal(plan) {
    const modalHTML = `
        <div class="modal-overlay" id="investmentModal">
            <div class="modal-content investment-modal">
                <div class="modal-header">
                    <h2>استثمار في ${plan.name}</h2>
                    <button class="modal-close" onclick="closeInvestmentModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="investment-form">
                        <div class="plan-summary" style="background: ${plan.color}15; border-right: 4px solid ${plan.color};">
                            <h4><i class="fas ${plan.icon}"></i> ${plan.name}</h4>
                            <div class="summary-grid">
                                <div>العائد اليومي: <strong>${plan.dailyReturn}%</strong></div>
                                <div>المدة: <strong>${plan.duration} يوم</strong></div>
                                <div>الحد الأدنى: <strong>$${plan.minInvestment.toLocaleString()}</strong></div>
                                <div>العائد الكلي: <strong>${plan.totalReturn}%</strong></div>
                            </div>
                        </div>

                        <form id="newInvestmentForm">
                            <div class="form-group">
                                <label><i class="fas fa-dollar-sign"></i> مبلغ الاستثمار</label>
                                <input type="number" 
                                       id="investmentAmountInput"
                                       class="form-input" 
                                       placeholder="أدخل المبلغ"
                                       min="${plan.minInvestment}"
                                       max="${plan.maxInvestment}"
                                       required>
                                <small>الحد الأدنى: $${plan.minInvestment.toLocaleString()} | الحد الأقصى: $${plan.maxInvestment.toLocaleString()}</small>
                            </div>

                            <div class="quick-amounts">
                                <button type="button" onclick="setInvestmentAmount(${plan.minInvestment})">
                                    $${plan.minInvestment}
                                </button>
                                <button type="button" onclick="setInvestmentAmount(${plan.minInvestment * 2})">
                                    $${plan.minInvestment * 2}
                                </button>
                                <button type="button" onclick="setInvestmentAmount(${plan.minInvestment * 5})">
                                    $${plan.minInvestment * 5}
                                </button>
                                <button type="button" onclick="setInvestmentAmount(${plan.minInvestment * 10})">
                                    $${plan.minInvestment * 10}
                                </button>
                            </div>

                            <div class="investment-projection" id="investmentProjection">
                                <!-- Will be filled by JavaScript -->
                            </div>

                            <div class="form-checkbox">
                                <input type="checkbox" id="autoReinvest">
                                <label for="autoReinvest">
                                    إعادة استثمار الأرباح تلقائياً بعد انتهاء المدة
                                </label>
                            </div>

                            <div class="form-checkbox">
                                <input type="checkbox" id="agreeInvestmentTerms" required>
                                <label for="agreeInvestmentTerms">
                                    أوافق على <a href="terms.html" target="_blank">شروط الاستثمار</a> وأقر بفهمي للمخاطر
                                </label>
                            </div>

                            <button type="submit" class="btn-primary btn-block btn-lg">
                                <i class="fas fa-rocket"></i> تأكيد الاستثمار
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize form
    initNewInvestmentForm(plan);
}

/**
 * Initialize new investment form
 */
function initNewInvestmentForm(plan) {
    const form = document.getElementById('newInvestmentForm');
    const amountInput = document.getElementById('investmentAmountInput');

    // Update projection on amount change
    amountInput.addEventListener('input', (e) => {
        const amount = parseFloat(e.target.value) || 0;
        updateInvestmentProjection(plan, amount);
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(amountInput.value);
        const autoReinvest = document.getElementById('autoReinvest').checked;
        
        createInvestment(plan, amount, autoReinvest);
    });
}

/**
 * Set investment amount
 */
function setInvestmentAmount(amount) {
    const input = document.getElementById('investmentAmountInput');
    if (input) {
        input.value = amount;
        input.dispatchEvent(new Event('input'));
    }
}

/**
 * Update investment projection
 */
function updateInvestmentProjection(plan, amount) {
    const projectionDiv = document.getElementById('investmentProjection');
    if (!projectionDiv) return;

    if (amount < plan.minInvestment) {
        projectionDiv.innerHTML = '';
        return;
    }

    const dailyProfit = amount * (plan.dailyReturn / 100);
    const totalProfit = amount * (plan.totalReturn / 100);
    const totalReturn = amount + totalProfit;

    projectionDiv.innerHTML = `
        <div class="projection-card">
            <h4>توقعات الربح:</h4>
            <div class="projection-grid">
                <div class="projection-item">
                    <i class="fas fa-calendar-day"></i>
                    <span>الربح اليومي</span>
                    <strong>$${dailyProfit.toFixed(2)}</strong>
                </div>
                <div class="projection-item">
                    <i class="fas fa-calendar-week"></i>
                    <span>الربح الأسبوعي</span>
                    <strong>$${(dailyProfit * 7).toFixed(2)}</strong>
                </div>
                <div class="projection-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>الربح الشهري</span>
                    <strong>$${(dailyProfit * 30).toFixed(2)}</strong>
                </div>
                <div class="projection-item highlight">
                    <i class="fas fa-trophy"></i>
                    <span>الربح الكلي (${plan.duration} يوم)</span>
                    <strong>$${totalProfit.toFixed(2)}</strong>
                </div>
            </div>
            <div class="total-return">
                <span>مجموع العائد:</span>
                <strong>$${totalReturn.toFixed(2)}</strong>
            </div>
        </div>
    `;
}

/**
 * Create investment
 */
function createInvestment(plan, amount, autoReinvest) {
    // Validate amount
    if (amount < plan.minInvestment || amount > plan.maxInvestment) {
        showAlert('error', `المبلغ يجب أن يكون بين $${plan.minInvestment.toLocaleString()} و $${plan.maxInvestment.toLocaleString()}`);
        return;
    }

    // Show loading
    const submitBtn = document.querySelector('#newInvestmentForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';

    // Simulate API call
    setTimeout(() => {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + plan.duration);

        const investment = {
            id: 'INV' + String(activeInvestments.length + 1).padStart(3, '0'),
            plan: plan.id,
            amount: amount,
            startDate: today.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            daysElapsed: 0,
            daysRemaining: plan.duration,
            totalEarned: 0,
            dailyEarnings: amount * (plan.dailyReturn / 100),
            status: 'active',
            autoReinvest: autoReinvest
        };

        activeInvestments.unshift(investment);

        // Close modal
        closeInvestmentModal();

        // Show success
        showSuccessAlert(investment, plan);

        // Update UI
        renderActiveInvestments();
        updateInvestmentStats();

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 2000);
}

/**
 * Show success alert
 */
function showSuccessAlert(investment, plan) {
    const alertHTML = `
        <div class="success-alert-overlay" onclick="this.remove()">
            <div class="success-alert-box">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>تم إنشاء الاستثمار بنجاح!</h3>
                <div class="investment-summary">
                    <p>رقم الاستثمار: <strong>${investment.id}</strong></p>
                    <p>الخطة: <strong>${plan.name}</strong></p>
                    <p>المبلغ: <strong>$${investment.amount.toLocaleString()}</strong></p>
                    <p>الربح اليومي: <strong>$${investment.dailyEarnings.toFixed(2)}</strong></p>
                    <p>المدة: <strong>${plan.duration} يوم</strong></p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-primary">
                    <i class="fas fa-check"></i> رائع!
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', alertHTML);
}

/**
 * Close investment modal
 */
function closeInvestmentModal() {
    const modal = document.getElementById('investmentModal');
    if (modal) modal.remove();
}

/**
 * Render active investments
 */
function renderActiveInvestments() {
    const container = document.getElementById('activeInvestmentsContainer');
    if (!container) return;

    if (activeInvestments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line fa-3x"></i>
                <h3>لا توجد استثمارات نشطة</h3>
                <p>ابدأ استثمارك الأول الآن واحصل على أرباح يومية</p>
                <button onclick="document.getElementById('investmentPlansContainer').scrollIntoView({behavior:'smooth'})" class="btn-primary">
                    <i class="fas fa-rocket"></i> استثمر الآن
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = activeInvestments.map(inv => {
        const plan = investmentPlans[inv.plan];
        const progress = (inv.daysElapsed / plan.duration) * 100;
        const expectedTotal = inv.amount * (plan.totalReturn / 100);

        return `
            <div class="active-investment-card">
                <div class="investment-header" style="background: ${plan.color}15;">
                    <div class="investment-plan-info">
                        <i class="fas ${plan.icon}" style="color: ${plan.color};"></i>
                        <div>
                            <h4>${plan.name}</h4>
                            <span class="investment-id">#${inv.id}</span>
                        </div>
                    </div>
                    <div class="investment-status">
                        <span class="status-badge active">نشط</span>
                        ${inv.autoReinvest ? '<span class="reinvest-badge"><i class="fas fa-sync"></i> إعادة استثمار</span>' : ''}
                    </div>
                </div>
                <div class="investment-body">
                    <div class="investment-stats">
                        <div class="stat-item">
                            <span>المبلغ المستثمر</span>
                            <strong>$${inv.amount.toLocaleString()}</strong>
                        </div>
                        <div class="stat-item highlight">
                            <span>الأرباح المحققة</span>
                            <strong>$${inv.totalEarned.toFixed(2)}</strong>
                        </div>
                        <div class="stat-item">
                            <span>الربح اليومي</span>
                            <strong>$${inv.dailyEarnings.toFixed(2)}</strong>
                        </div>
                        <div class="stat-item">
                            <span>الربح المتوقع</span>
                            <strong>$${expectedTotal.toFixed(2)}</strong>
                        </div>
                    </div>
                    <div class="investment-progress">
                        <div class="progress-header">
                            <span>التقدم: ${inv.daysElapsed} من ${plan.duration} يوم</span>
                            <span>${progress.toFixed(1)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%; background: ${plan.color};"></div>
                        </div>
                        <div class="progress-footer">
                            <span>تاريخ البداية: ${inv.startDate}</span>
                            <span>تاريخ الانتهاء: ${inv.endDate}</span>
                        </div>
                    </div>
                    <div class="investment-actions">
                        <button onclick="viewInvestmentDetails('${inv.id}')" class="btn-secondary">
                            <i class="fas fa-eye"></i> التفاصيل
                        </button>
                        <button onclick="withdrawInvestment('${inv.id}')" class="btn-primary">
                            <i class="fas fa-money-bill-wave"></i> سحب الأرباح
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * View investment details
 */
function viewInvestmentDetails(investmentId) {
    const investment = activeInvestments.find(inv => inv.id === investmentId);
    if (!investment) return;

    const plan = investmentPlans[investment.plan];
    const expectedTotal = investment.amount * (plan.totalReturn / 100);
    const remainingProfit = expectedTotal - investment.totalEarned;

    const detailsHTML = `
        <div class="investment-details">
            <div class="details-header" style="background: ${plan.color};">
                <i class="fas ${plan.icon} fa-3x"></i>
                <h3>${plan.name}</h3>
                <p>#${investment.id}</p>
            </div>
            <div class="details-body">
                <div class="detail-section">
                    <h4>معلومات الاستثمار</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>المبلغ المستثمر:</span>
                            <strong>$${investment.amount.toLocaleString()}</strong>
                        </div>
                        <div class="detail-row">
                            <span>العائد اليومي:</span>
                            <strong>${plan.dailyReturn}%</strong>
                        </div>
                        <div class="detail-row">
                            <span>الربح اليومي:</span>
                            <strong>$${investment.dailyEarnings.toFixed(2)}</strong>
                        </div>
                        <div class="detail-row">
                            <span>المدة:</span>
                            <strong>${plan.duration} يوم</strong>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>الأرباح</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>الأرباح المحققة:</span>
                            <strong class="success">$${investment.totalEarned.toFixed(2)}</strong>
                        </div>
                        <div class="detail-row">
                            <span>الأرباح المتبقية:</span>
                            <strong>$${remainingProfit.toFixed(2)}</strong>
                        </div>
                        <div class="detail-row">
                            <span>الربح الكلي المتوقع:</span>
                            <strong>$${expectedTotal.toFixed(2)}</strong>
                        </div>
                        <div class="detail-row">
                            <span>مجموع العائد:</span>
                            <strong class="highlight">$${(investment.amount + expectedTotal).toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>التواريخ</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>تاريخ البداية:</span>
                            <strong>${investment.startDate}</strong>
                        </div>
                        <div class="detail-row">
                            <span>تاريخ الانتهاء:</span>
                            <strong>${investment.endDate}</strong>
                        </div>
                        <div class="detail-row">
                            <span>الأيام المنقضية:</span>
                            <strong>${investment.daysElapsed} يوم</strong>
                        </div>
                        <div class="detail-row">
                            <span>الأيام المتبقية:</span>
                            <strong>${investment.daysRemaining} يوم</strong>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>الإعدادات</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>إعادة الاستثمار التلقائي:</span>
                            <strong>${investment.autoReinvest ? 'مفعّل' : 'غير مفعّل'}</strong>
                        </div>
                        <div class="detail-row">
                            <span>الحالة:</span>
                            <strong class="status active">نشط</strong>
                        </div>
                    </div>
                </div>
            </div>
            <button onclick="closeModal()" class="btn-primary btn-block">
                <i class="fas fa-times"></i> إغلاق
            </button>
        </div>
    `;

    showModal('تفاصيل الاستثمار', detailsHTML);
}

/**
 * Withdraw investment
 */
function withdrawInvestment(investmentId) {
    const investment = activeInvestments.find(inv => inv.id === investmentId);
    if (!investment) return;

    if (investment.totalEarned <= 0) {
        showAlert('warning', 'لا توجد أرباح متاحة للسحب حالياً');
        return;
    }

    if (confirm(`هل تريد سحب الأرباح المتاحة ($${investment.totalEarned.toFixed(2)})?`)) {
        showAlert('success', `تم سحب $${investment.totalEarned.toFixed(2)} إلى محفظتك`);
        investment.totalEarned = 0;
        renderActiveInvestments();
    }
}

/**
 * Render investment history
 */
function renderInvestmentHistory() {
    const container = document.getElementById('investmentHistoryContainer');
    if (!container) return;

    if (investmentHistory.length === 0) {
        container.innerHTML = '<p class="text-muted">لا يوجد سجل استثمارات سابقة</p>';
        return;
    }

    container.innerHTML = investmentHistory.map(inv => {
        const plan = investmentPlans[inv.plan];
        return `
            <div class="history-investment-card">
                <div class="history-icon ${inv.status}">
                    <i class="fas ${plan.icon}"></i>
                </div>
                <div class="history-details">
                    <h4>${plan.name}</h4>
                    <p>${inv.startDate} - ${inv.endDate}</p>
                    <span class="investment-id">#${inv.id}</span>
                </div>
                <div class="history-amounts">
                    <div>المبلغ: <strong>$${inv.amount.toLocaleString()}</strong></div>
                    <div class="success">الأرباح: <strong>+$${inv.totalEarned.toFixed(2)}</strong></div>
                </div>
                <span class="status-badge ${inv.status}">${inv.status === 'completed' ? 'مكتمل' : inv.status}</span>
            </div>
        `;
    }).join('');
}

/**
 * Update investment stats
 */
function updateInvestmentStats() {
    const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalEarned = activeInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0);
    const activeCount = activeInvestments.length;

    updateStatIfExists('total-invested', '$' + totalInvested.toLocaleString());
    updateStatIfExists('total-earned-investments', '$' + totalEarned.toFixed(2));
    updateStatIfExists('active-investments-count', activeCount);
}

/**
 * Initialize investment actions
 */
function initInvestmentActions() {
    // Add any additional action handlers here
}

/**
 * Update stat if element exists
 */
function updateStatIfExists(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

/**
 * Show alert
 */
function showAlert(type, message) {
    if (window.CicadaAuth && window.CicadaAuth.showAuthAlert) {
        window.CicadaAuth.showAuthAlert(type, message);
    } else {
        alert(message);
    }
}

/**
 * Show modal
 */
function showModal(title, content) {
    const modalHTML = `
        <div class="modal-overlay" id="detailsModal" onclick="if(event.target === this) closeModal()">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) modal.remove();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('investments.html')) {
        initInvestmentsPage();
    }
});

// Export functions for global use
window.selectPlan = selectPlan;
window.setInvestmentAmount = setInvestmentAmount;
window.closeInvestmentModal = closeInvestmentModal;
window.viewInvestmentDetails = viewInvestmentDetails;
window.withdrawInvestment = withdrawInvestment;
window.closeModal = closeModal;
