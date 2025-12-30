/**
 * Withdrawals Page Script
 * Handles all withdrawal-related functionality
 */

// Withdrawal methods configuration
const withdrawalMethods = {
    card: {
        name: 'بطاقة ائتمانية',
        icon: 'fa-credit-card',
        minAmount: 20,
        maxAmount: 5000,
        fee: 0,
        processingTime: '24-48 ساعة',
        available: true
    },
    paypal: {
        name: 'PayPal',
        icon: 'fab fa-paypal',
        minAmount: 20,
        maxAmount: 3000,
        fee: 2,
        processingTime: '12-24 ساعة',
        available: true
    },
    bitcoin: {
        name: 'Bitcoin',
        icon: 'fab fa-bitcoin',
        minAmount: 50,
        maxAmount: 50000,
        fee: 0,
        processingTime: '1-6 ساعات',
        available: true
    },
    ethereum: {
        name: 'Ethereum',
        icon: 'fab fa-ethereum',
        minAmount: 50,
        maxAmount: 50000,
        fee: 0,
        processingTime: '30 دقيقة - 2 ساعة',
        available: true
    },
    usdt: {
        name: 'USDT (TRC20)',
        icon: 'fa-dollar-sign',
        minAmount: 20,
        maxAmount: 50000,
        fee: 1,
        processingTime: '15-60 دقيقة',
        available: true
    },
    bank: {
        name: 'حوالة بنكية',
        icon: 'fa-university',
        minAmount: 100,
        maxAmount: 100000,
        fee: 0,
        processingTime: '2-5 أيام عمل',
        available: true
    }
};

// Demo withdrawal history
const withdrawalHistory = [
    {
        id: 'WTH001',
        method: 'paypal',
        amount: 250,
        status: 'completed',
        date: '2025-12-27 11:20',
        destination: 'user@email.com',
        fee: 5.00
    },
    {
        id: 'WTH002',
        method: 'bitcoin',
        amount: 500,
        status: 'processing',
        date: '2025-12-29 15:45',
        destination: '1A1z...DivfNa',
        fee: 0
    },
    {
        id: 'WTH003',
        method: 'bank',
        amount: 1000,
        status: 'pending',
        date: '2025-12-30 09:30',
        destination: 'Bank Account ***4567',
        fee: 0
    }
];

// User wallet balance (demo)
let walletBalance = 1250.50;
let availableBalance = 1150.50; // After pending withdrawals

// Current withdrawal state
let selectedWithdrawalMethod = null;
let withdrawalAmount = 0;

/**
 * Initialize withdrawals page
 */
function initWithdrawalsPage() {
    updateBalanceDisplay();
    initWithdrawalMethodSelection();
    initAmountInput();
    initQuickAmounts();
    initWithdrawalForm();
    renderWithdrawalHistory();
    updateWithdrawalStats();
}

/**
 * Update balance display
 */
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('walletBalance');
    const availableElement = document.getElementById('availableBalance');
    
    if (balanceElement) balanceElement.textContent = '$' + walletBalance.toFixed(2);
    if (availableElement) availableElement.textContent = '$' + availableBalance.toFixed(2);
}

/**
 * Initialize withdrawal method selection
 */
function initWithdrawalMethodSelection() {
    const methodCards = document.querySelectorAll('.withdrawal-method-card');
    
    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            const method = card.getAttribute('data-method');
            selectWithdrawalMethod(method);
        });
    });
}

/**
 * Select withdrawal method
 */
function selectWithdrawalMethod(method) {
    if (!withdrawalMethods[method] || !withdrawalMethods[method].available) {
        showAlert('error', 'هذه الطريقة غير متاحة حالياً');
        return;
    }

    selectedWithdrawalMethod = method;
    const methodData = withdrawalMethods[method];

    // Update UI
    document.querySelectorAll('.withdrawal-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-method="${method}"]`)?.classList.add('selected');

    // Update min/max amounts
    const amountInput = document.getElementById('withdrawalAmount');
    if (amountInput) {
        amountInput.min = methodData.minAmount;
        amountInput.max = Math.min(methodData.maxAmount, availableBalance);
        amountInput.placeholder = `الحد الأدنى: $${methodData.minAmount}`;
    }

    // Update method info
    updateWithdrawalMethodInfo(methodData);

    // Show withdrawal form
    const withdrawalForm = document.getElementById('withdrawalFormSection');
    if (withdrawalForm) {
        withdrawalForm.style.display = 'block';
        withdrawalForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Update withdrawal method info
 */
function updateWithdrawalMethodInfo(methodData) {
    const infoSection = document.getElementById('withdrawalMethodInfo');
    if (!infoSection) return;

    infoSection.innerHTML = `
        <div class="method-info-card">
            <h4><i class="fas ${methodData.icon}"></i> ${methodData.name}</h4>
            <div class="method-details">
                <div class="detail-row">
                    <span>الحد الأدنى:</span>
                    <strong>$${methodData.minAmount}</strong>
                </div>
                <div class="detail-row">
                    <span>الحد الأقصى:</span>
                    <strong>$${Math.min(methodData.maxAmount, availableBalance).toLocaleString()}</strong>
                </div>
                <div class="detail-row">
                    <span>الرسوم:</span>
                    <strong>${methodData.fee > 0 ? methodData.fee + '%' : 'مجاني'}</strong>
                </div>
                <div class="detail-row">
                    <span>وقت المعالجة:</span>
                    <strong>${methodData.processingTime}</strong>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize amount input
 */
function initAmountInput() {
    const amountInput = document.getElementById('withdrawalAmount');
    
    if (amountInput) {
        amountInput.addEventListener('input', (e) => {
            withdrawalAmount = parseFloat(e.target.value) || 0;
            updateWithdrawalSummary();
        });

        amountInput.addEventListener('blur', () => {
            validateWithdrawalAmount();
        });
    }
}

/**
 * Initialize quick amount buttons
 */
function initQuickAmounts() {
    const quickAmountBtns = document.querySelectorAll('[data-withdrawal-amount]');
    
    quickAmountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-withdrawal-amount');
            let amount = 0;

            switch(type) {
                case '25':
                    amount = availableBalance * 0.25;
                    break;
                case '50':
                    amount = availableBalance * 0.50;
                    break;
                case '75':
                    amount = availableBalance * 0.75;
                    break;
                case '100':
                    amount = availableBalance;
                    break;
                default:
                    amount = parseFloat(type);
            }

            const amountInput = document.getElementById('withdrawalAmount');
            if (amountInput) {
                amountInput.value = amount.toFixed(2);
                withdrawalAmount = amount;
                updateWithdrawalSummary();
            }
        });
    });
}

/**
 * Validate withdrawal amount
 */
function validateWithdrawalAmount() {
    if (!selectedWithdrawalMethod) {
        showAlert('warning', 'يرجى اختيار طريقة السحب أولاً');
        return false;
    }

    const methodData = withdrawalMethods[selectedWithdrawalMethod];
    
    if (withdrawalAmount < methodData.minAmount) {
        showAlert('error', `الحد الأدنى للسحب هو $${methodData.minAmount}`);
        return false;
    }

    if (withdrawalAmount > availableBalance) {
        showAlert('error', `الرصيد المتاح غير كافٍ. الرصيد المتاح: $${availableBalance.toFixed(2)}`);
        return false;
    }

    if (withdrawalAmount > methodData.maxAmount) {
        showAlert('error', `الحد الأقصى للسحب هو $${methodData.maxAmount.toLocaleString()}`);
        return false;
    }

    return true;
}

/**
 * Update withdrawal summary
 */
function updateWithdrawalSummary() {
    const summarySection = document.getElementById('withdrawalSummary');
    if (!summarySection || !selectedWithdrawalMethod) return;

    const methodData = withdrawalMethods[selectedWithdrawalMethod];
    const fee = withdrawalAmount * (methodData.fee / 100);
    const netAmount = withdrawalAmount - fee;

    summarySection.innerHTML = `
        <div class="summary-card">
            <h4>ملخص السحب</h4>
            <div class="summary-details">
                <div class="summary-row">
                    <span>المبلغ المطلوب:</span>
                    <strong>$${withdrawalAmount.toFixed(2)}</strong>
                </div>
                ${fee > 0 ? `
                <div class="summary-row fee">
                    <span>الرسوم (${methodData.fee}%):</span>
                    <strong>-$${fee.toFixed(2)}</strong>
                </div>
                ` : ''}
                <div class="summary-row total">
                    <span>المبلغ الصافي:</span>
                    <strong>$${netAmount.toFixed(2)}</strong>
                </div>
                <div class="summary-row remaining">
                    <span>الرصيد المتبقي:</span>
                    <strong>$${(availableBalance - withdrawalAmount).toFixed(2)}</strong>
                </div>
            </div>
            <p class="summary-note">
                <i class="fas fa-info-circle"></i>
                سيتم معالجة طلبك خلال ${methodData.processingTime}
            </p>
        </div>
    `;

    summarySection.style.display = 'block';
}

/**
 * Initialize withdrawal form
 */
function initWithdrawalForm() {
    const form = document.getElementById('withdrawalForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            processWithdrawal();
        });
    }
}

/**
 * Process withdrawal
 */
async function processWithdrawal() {
    // Validate
    if (!validateWithdrawalAmount()) return;

    // Get destination
    const destination = getDestinationInput();
    if (!destination) {
        showAlert('error', 'يرجى إدخال معلومات الوجهة');
        return;
    }

    // Verify with 2FA (optional)
    const verify2FA = document.getElementById('twoFactorCode');
    if (verify2FA && verify2FA.value.length === 0) {
        showAlert('error', 'يرجى إدخال رمز التحقق الثنائي');
        return;
    }

    // Confirm withdrawal
    if (!confirm(`هل أنت متأكد من سحب $${withdrawalAmount.toFixed(2)} إلى ${destination}?`)) {
        return;
    }

    // Show loading
    const submitBtn = document.querySelector('#withdrawalForm button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';

    // Simulate API call
    setTimeout(() => {
        const methodData = withdrawalMethods[selectedWithdrawalMethod];
        const fee = withdrawalAmount * (methodData.fee / 100);

        // Create withdrawal
        const withdrawal = {
            id: 'WTH' + String(withdrawalHistory.length + 1).padStart(3, '0'),
            method: selectedWithdrawalMethod,
            amount: withdrawalAmount,
            status: 'pending',
            date: new Date().toLocaleString('ar-EG'),
            destination: destination,
            fee: fee
        };

        withdrawalHistory.unshift(withdrawal);

        // Update balance
        availableBalance -= withdrawalAmount;
        updateBalanceDisplay();

        // Reset form
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        document.getElementById('withdrawalForm').reset();
        document.getElementById('withdrawalSummary').style.display = 'none';

        // Show success
        showSuccessModal(withdrawal);

        // Update UI
        renderWithdrawalHistory();
        updateWithdrawalStats();
    }, 2000);
}

/**
 * Get destination input based on method
 */
function getDestinationInput() {
    const method = selectedWithdrawalMethod;
    
    switch(method) {
        case 'paypal':
            return document.getElementById('paypalEmail')?.value;
        case 'bitcoin':
            return document.getElementById('bitcoinAddress')?.value;
        case 'ethereum':
            return document.getElementById('ethereumAddress')?.value;
        case 'usdt':
            return document.getElementById('usdtAddress')?.value;
        case 'card':
            return document.getElementById('cardNumber')?.value;
        case 'bank':
            return document.getElementById('bankAccount')?.value;
        default:
            return null;
    }
}

/**
 * Show success modal
 */
function showSuccessModal(withdrawal) {
    const methodData = withdrawalMethods[withdrawal.method];
    
    const modalHTML = `
        <div class="modal-overlay" id="successModal">
            <div class="modal-content success-modal">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>تم إنشاء طلب السحب بنجاح!</h2>
                <div class="withdrawal-details">
                    <div class="detail-item">
                        <span>رقم الطلب:</span>
                        <strong>${withdrawal.id}</strong>
                    </div>
                    <div class="detail-item">
                        <span>المبلغ:</span>
                        <strong>$${withdrawal.amount.toFixed(2)}</strong>
                    </div>
                    <div class="detail-item">
                        <span>الرسوم:</span>
                        <strong>$${withdrawal.fee.toFixed(2)}</strong>
                    </div>
                    <div class="detail-item">
                        <span>المبلغ الصافي:</span>
                        <strong>$${(withdrawal.amount - withdrawal.fee).toFixed(2)}</strong>
                    </div>
                    <div class="detail-item">
                        <span>الطريقة:</span>
                        <strong>${methodData.name}</strong>
                    </div>
                    <div class="detail-item">
                        <span>الوجهة:</span>
                        <strong>${withdrawal.destination}</strong>
                    </div>
                    <div class="detail-item">
                        <span>الحالة:</span>
                        <strong class="status pending">قيد المعالجة</strong>
                    </div>
                </div>
                <div class="success-note">
                    <i class="fas fa-info-circle"></i>
                    <p>سيتم معالجة طلبك خلال ${methodData.processingTime}. سنرسل لك إشعاراً عند اكتمال العملية.</p>
                </div>
                <button onclick="closeSuccessModal()" class="btn-primary btn-lg">
                    <i class="fas fa-check"></i> تم
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Close success modal
 */
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
}

/**
 * Render withdrawal history
 */
function renderWithdrawalHistory() {
    const container = document.getElementById('withdrawalHistory');
    if (!container) return;

    if (withdrawalHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox fa-3x"></i>
                <p>لا توجد عمليات سحب سابقة</p>
            </div>
        `;
        return;
    }

    container.innerHTML = withdrawalHistory.map(withdrawal => {
        const methodData = withdrawalMethods[withdrawal.method];
        const statusClass = getStatusClass(withdrawal.status);
        const statusText = getStatusText(withdrawal.status);

        return `
            <div class="history-item">
                <div class="history-icon ${statusClass}">
                    <i class="fas ${methodData?.icon || 'fa-money-bill'}"></i>
                </div>
                <div class="history-details">
                    <h4>${methodData?.name || withdrawal.method}</h4>
                    <p class="destination">${withdrawal.destination}</p>
                    <p class="date">${withdrawal.date}</p>
                    <small>رقم المعاملة: ${withdrawal.id}</small>
                </div>
                <div class="history-amount">
                    <span class="amount">-$${withdrawal.amount.toFixed(2)}</span>
                    ${withdrawal.fee > 0 ? `<span class="fee">رسوم: $${withdrawal.fee.toFixed(2)}</span>` : ''}
                    <span class="status ${statusClass}">${statusText}</span>
                </div>
                <div class="history-actions">
                    ${withdrawal.status === 'pending' ? `
                        <button onclick="cancelWithdrawal('${withdrawal.id}')" class="btn-danger btn-sm">
                            <i class="fas fa-times"></i> إلغاء
                        </button>
                    ` : ''}
                    <button onclick="viewWithdrawalDetails('${withdrawal.id}')" class="btn-secondary btn-sm">
                        <i class="fas fa-eye"></i> التفاصيل
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Get status class
 */
function getStatusClass(status) {
    const classes = {
        completed: 'success',
        processing: 'warning',
        pending: 'info',
        failed: 'danger',
        cancelled: 'secondary'
    };
    return classes[status] || 'secondary';
}

/**
 * Get status text in Arabic
 */
function getStatusText(status) {
    const statusMap = {
        completed: 'مكتمل',
        processing: 'جاري المعالجة',
        pending: 'قيد الانتظار',
        failed: 'فشل',
        cancelled: 'ملغي'
    };
    return statusMap[status] || status;
}

/**
 * Cancel withdrawal
 */
function cancelWithdrawal(withdrawalId) {
    if (!confirm('هل أنت متأكد من إلغاء طلب السحب؟')) {
        return;
    }

    const withdrawal = withdrawalHistory.find(w => w.id === withdrawalId);
    if (!withdrawal) return;

    if (withdrawal.status !== 'pending') {
        showAlert('error', 'لا يمكن إلغاء هذا الطلب');
        return;
    }

    // Update status
    withdrawal.status = 'cancelled';

    // Refund amount
    availableBalance += withdrawal.amount;
    updateBalanceDisplay();

    showAlert('success', 'تم إلغاء طلب السحب وإعادة المبلغ إلى محفظتك');
    renderWithdrawalHistory();
    updateWithdrawalStats();
}

/**
 * View withdrawal details
 */
function viewWithdrawalDetails(withdrawalId) {
    const withdrawal = withdrawalHistory.find(w => w.id === withdrawalId);
    if (!withdrawal) return;

    const methodData = withdrawalMethods[withdrawal.method];
    const statusClass = getStatusClass(withdrawal.status);
    const statusText = getStatusText(withdrawal.status);

    const detailsHTML = `
        <div class="withdrawal-details-modal">
            <div class="details-header">
                <i class="fas ${methodData.icon} fa-3x"></i>
                <h3>${methodData.name}</h3>
            </div>
            <div class="details-body">
                <div class="detail-row">
                    <span>رقم الطلب:</span>
                    <strong>${withdrawal.id}</strong>
                </div>
                <div class="detail-row">
                    <span>التاريخ:</span>
                    <strong>${withdrawal.date}</strong>
                </div>
                <div class="detail-row">
                    <span>المبلغ المطلوب:</span>
                    <strong>$${withdrawal.amount.toFixed(2)}</strong>
                </div>
                <div class="detail-row">
                    <span>الرسوم:</span>
                    <strong>$${withdrawal.fee.toFixed(2)}</strong>
                </div>
                <div class="detail-row">
                    <span>المبلغ الصافي:</span>
                    <strong>$${(withdrawal.amount - withdrawal.fee).toFixed(2)}</strong>
                </div>
                <div class="detail-row">
                    <span>الوجهة:</span>
                    <strong>${withdrawal.destination}</strong>
                </div>
                <div class="detail-row">
                    <span>الحالة:</span>
                    <strong class="status ${statusClass}">${statusText}</strong>
                </div>
                <div class="detail-row">
                    <span>وقت المعالجة المتوقع:</span>
                    <strong>${methodData.processingTime}</strong>
                </div>
            </div>
            <button onclick="closeModal()" class="btn-primary btn-block">
                <i class="fas fa-times"></i> إغلاق
            </button>
        </div>
    `;

    showModal('تفاصيل السحب', detailsHTML);
}

/**
 * Update withdrawal stats
 */
function updateWithdrawalStats() {
    const totalWithdrawals = withdrawalHistory.reduce((sum, w) => 
        w.status === 'comp
