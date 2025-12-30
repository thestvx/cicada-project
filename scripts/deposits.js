/**
 * Deposits Page Script
 * Handles all deposit-related functionality
 */

// Payment methods configuration
const paymentMethods = {
    card: {
        name: 'بطاقة ائتمانية',
        icon: 'fa-credit-card',
        minAmount: 50,
        maxAmount: 10000,
        fee: 0,
        processingTime: 'فوري',
        available: true
    },
    paypal: {
        name: 'PayPal',
        icon: 'fab fa-paypal',
        minAmount: 50,
        maxAmount: 5000,
        fee: 2.5,
        processingTime: 'فوري',
        available: true
    },
    bitcoin: {
        name: 'Bitcoin',
        icon: 'fab fa-bitcoin',
        minAmount: 100,
        maxAmount: 50000,
        fee: 0,
        processingTime: '15-30 دقيقة',
        available: true
    },
    ethereum: {
        name: 'Ethereum',
        icon: 'fab fa-ethereum',
        minAmount: 100,
        maxAmount: 50000,
        fee: 0,
        processingTime: '10-20 دقيقة',
        available: true
    },
    usdt: {
        name: 'USDT (TRC20)',
        icon: 'fa-dollar-sign',
        minAmount: 50,
        maxAmount: 50000,
        fee: 1,
        processingTime: '5-15 دقيقة',
        available: true
    },
    bank: {
        name: 'حوالة بنكية',
        icon: 'fa-university',
        minAmount: 100,
        maxAmount: 100000,
        fee: 0,
        processingTime: '1-3 أيام عمل',
        available: true
    }
};

// Demo deposit history
const depositHistory = [
    {
        id: 'DEP001',
        method: 'card',
        amount: 500,
        status: 'completed',
        date: '2025-12-28 14:30',
        transactionId: 'TXN123456789'
    },
    {
        id: 'DEP002',
        method: 'bitcoin',
        amount: 1000,
        status: 'pending',
        date: '2025-12-30 10:15',
        transactionId: 'BTC987654321'
    },
    {
        id: 'DEP003',
        method: 'paypal',
        amount: 250,
        status: 'completed',
        date: '2025-12-25 16:45',
        transactionId: 'PP456789123'
    }
];

// Current deposit state
let selectedPaymentMethod = null;
let depositAmount = 0;

/**
 * Initialize deposits page
 */
function initDepositsPage() {
    initPaymentMethodSelection();
    initAmountInput();
    initQuickAmounts();
    initDepositForm();
    renderDepositHistory();
    updateDepositStats();
}

/**
 * Initialize payment method selection
 */
function initPaymentMethodSelection() {
    const methodCards = document.querySelectorAll('.payment-method-card');
    
    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            const method = card.getAttribute('data-method');
            selectPaymentMethod(method);
        });
    });
}

/**
 * Select payment method
 */
function selectPaymentMethod(method) {
    if (!paymentMethods[method] || !paymentMethods[method].available) {
        showAlert('error', 'هذه الطريقة غير متاحة حالياً');
        return;
    }

    selectedPaymentMethod = method;
    const methodData = paymentMethods[method];

    // Update UI
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-method="${method}"]`)?.classList.add('selected');

    // Update min/max amounts
    const amountInput = document.getElementById('depositAmount');
    if (amountInput) {
        amountInput.min = methodData.minAmount;
        amountInput.max = methodData.maxAmount;
        amountInput.placeholder = `الحد الأدنى: $${methodData.minAmount}`;
    }

    // Update method info
    updatePaymentMethodInfo(methodData);

    // Show deposit form
    const depositForm = document.getElementById('depositFormSection');
    if (depositForm) {
        depositForm.style.display = 'block';
        depositForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Update payment method info
 */
function updatePaymentMethodInfo(methodData) {
    const infoSection = document.getElementById('paymentMethodInfo');
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
                    <strong>$${methodData.maxAmount.toLocaleString()}</strong>
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
    const amountInput = document.getElementById('depositAmount');
    
    if (amountInput) {
        amountInput.addEventListener('input', (e) => {
            depositAmount = parseFloat(e.target.value) || 0;
            updateDepositSummary();
        });

        amountInput.addEventListener('blur', (e) => {
            validateDepositAmount();
        });
    }
}

/**
 * Initialize quick amount buttons
 */
function initQuickAmounts() {
    const quickAmountBtns = document.querySelectorAll('[data-amount]');
    
    quickAmountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseFloat(btn.getAttribute('data-amount'));
            const amountInput = document.getElementById('depositAmount');
            
            if (amountInput) {
                amountInput.value = amount;
                depositAmount = amount;
                updateDepositSummary();
            }
        });
    });
}

/**
 * Validate deposit amount
 */
function validateDepositAmount() {
    if (!selectedPaymentMethod) {
        showAlert('warning', 'يرجى اختيار طريقة الدفع أولاً');
        return false;
    }

    const methodData = paymentMethods[selectedPaymentMethod];
    
    if (depositAmount < methodData.minAmount) {
        showAlert('error', `الحد الأدنى للإيداع هو $${methodData.minAmount}`);
        return false;
    }

    if (depositAmount > methodData.maxAmount) {
        showAlert('error', `الحد الأقصى للإيداع هو $${methodData.maxAmount.toLocaleString()}`);
        return false;
    }

    return true;
}

/**
 * Update deposit summary
 */
function updateDepositSummary() {
    const summarySection = document.getElementById('depositSummary');
    if (!summarySection || !selectedPaymentMethod) return;

    const methodData = paymentMethods[selectedPaymentMethod];
    const fee = depositAmount * (methodData.fee / 100);
    const totalAmount = depositAmount + fee;

    summarySection.innerHTML = `
        <div class="summary-card">
            <h4>ملخص الإيداع</h4>
            <div class="summary-details">
                <div class="summary-row">
                    <span>المبلغ:</span>
                    <strong>$${depositAmount.toFixed(2)}</strong>
                </div>
                ${fee > 0 ? `
                <div class="summary-row">
                    <span>الرسوم (${methodData.fee}%):</span>
                    <strong>$${fee.toFixed(2)}</strong>
                </div>
                ` : ''}
                <div class="summary-row total">
                    <span>المجموع الكلي:</span>
                    <strong>$${totalAmount.toFixed(2)}</strong>
                </div>
            </div>
            <p class="summary-note">
                <i class="fas fa-info-circle"></i>
                سيتم إضافة المبلغ إلى محفظتك خلال ${methodData.processingTime}
            </p>
        </div>
    `;

    summarySection.style.display = 'block';
}

/**
 * Initialize deposit form
 */
function initDepositForm() {
    const form = document.getElementById('depositForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            processDeposit();
        });
    }
}

/**
 * Process deposit
 */
async function processDeposit() {
    // Validate
    if (!validateDepositAmount()) return;

    // Get form data
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    
    if (!agreeTerms) {
        showAlert('error', 'يجب الموافقة على الشروط والأحكام');
        return;
    }

    // Show loading
    const submitBtn = document.querySelector('#depositForm button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';

    // Simulate API call
    setTimeout(() => {
        // Create deposit
        const deposit = {
            id: 'DEP' + String(depositHistory.length + 1).padStart(3, '0'),
            method: selectedPaymentMethod,
            amount: depositAmount,
            status: 'pending',
            date: new Date().toLocaleString('ar-EG'),
            transactionId: 'TXN' + Date.now()
        };

        depositHistory.unshift(deposit);

        // Show payment gateway based on method
        showPaymentGateway(deposit);

        // Reset form
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }, 1500);
}

/**
 * Show payment gateway
 */
function showPaymentGateway(deposit) {
    const methodData = paymentMethods[deposit.method];
    
    let gatewayContent = '';

    switch(deposit.method) {
        case 'card':
            gatewayContent = getCardGatewayHTML(deposit);
            break;
        case 'bitcoin':
        case 'ethereum':
        case 'usdt':
            gatewayContent = getCryptoGatewayHTML(deposit);
            break;
        case 'paypal':
            gatewayContent = getPayPalGatewayHTML(deposit);
            break;
        case 'bank':
            gatewayContent = getBankGatewayHTML(deposit);
            break;
        default:
            gatewayContent = getGenericGatewayHTML(deposit);
    }

    showModal('بوابة الدفع', gatewayContent);
}

/**
 * Get card gateway HTML
 */
function getCardGatewayHTML(deposit) {
    return `
        <div class="payment-gateway">
            <div class="gateway-header">
                <i class="fas fa-credit-card fa-3x"></i>
                <h3>إيداع عبر البطاقة الائتمانية</h3>
                <p>المبلغ: <strong>$${deposit.amount.toFixed(2)}</strong></p>
            </div>
            <form id="cardPaymentForm" class="gateway-form">
                <div class="form-group">
                    <label>رقم البطاقة</label>
                    <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>تاريخ الانتهاء</label>
                        <input type="text" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="text" placeholder="123" maxlength="3" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>اسم حامل البطاقة</label>
                    <input type="text" placeholder="JOHN DOE" required>
                </div>
                <button type="submit" class="btn-primary btn-block">
                    <i class="fas fa-lock"></i> إتمام الدفع الآمن
                </button>
            </form>
            <div class="gateway-security">
                <i class="fas fa-shield-alt"></i>
                <span>تتم معالجة الدفع عبر بوابة آمنة ومشفرة</span>
            </div>
        </div>
    `;
}

/**
 * Get crypto gateway HTML
 */
function getCryptoGatewayHTML(deposit) {
    const cryptoAddress = generateDemoAddress(deposit.method);
    const cryptoName = paymentMethods[deposit.method].name;
    
    return `
        <div class="payment-gateway">
            <div class="gateway-header">
                <i class="fab ${paymentMethods[deposit.method].icon.replace('fa-', 'fa-')} fa-3x"></i>
                <h3>إيداع عبر ${cryptoName}</h3>
                <p>المبلغ: <strong>$${deposit.amount.toFixed(2)}</strong></p>
            </div>
            <div class="crypto-payment">
                <div class="crypto-instructions">
                    <h4>تعليمات الدفع:</h4>
                    <ol>
                        <li>انسخ العنوان أدناه</li>
                        <li>افتح محفظتك</li>
                        <li>أرسل المبلغ المحدد بالضبط</li>
                        <li>انتظر التأكيدات على الشبكة</li>
                    </ol>
                </div>
                <div class="crypto-address">
                    <label>عنوان المحفظة:</label>
                    <div class="address-box">
                        <input type="text" value="${cryptoAddress}" readonly id="cryptoAddress">
                        <button onclick="copyCryptoAddress()" class="btn-secondary">
                            <i class="fas fa-copy"></i> نسخ
                        </button>
                    </div>
                </div>
                <div class="crypto-qr">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${cryptoAddress}" 
                         alt="QR Code">
                    <p>امسح رمز QR من محفظتك</p>
                </div>
                <div class="crypto-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>تأكد من إرسال ${cryptoName} فقط إلى هذا العنوان</span>
                </div>
                <button onclick="confirmCryptoPayment('${deposit.id}')" class="btn-primary btn-block">
                    <i class="fas fa-check"></i> تم إرسال المبلغ
                </button>
            </div>
        </div>
    `;
}

/**
 * Get PayPal gateway HTML
 */
function getPayPalGatewayHTML(deposit) {
    return `
        <div class="payment-gateway">
            <div class="gateway-header">
                <i class="fab fa-paypal fa-3x" style="color:#0070ba;"></i>
                <h3>إيداع عبر PayPal</h3>
                <p>المبلغ: <strong>$${deposit.amount.toFixed(2)}</strong></p>
            </div>
            <div class="paypal-payment">
                <p style="text-align:center; margin:2rem 0;">
                    سيتم تحويلك إلى بوابة PayPal الآمنة لإتمام الدفع
                </p>
                <button onclick="redirectToPayPal('${deposit.id}')" class="btn-primary btn-block" style="background:#0070ba;">
                    <i class="fab fa-paypal"></i> متابعة إلى PayPal
                </button>
            </div>
        </div>
    `;
}

/**
 * Get bank gateway HTML
 */
function getBankGatewayHTML(deposit) {
    return `
        <div class="payment-gateway">
            <div class="gateway-header">
                <i class="fas fa-university fa-3x"></i>
                <h3>إيداع عبر حوالة بنكية</h3>
                <p>المبلغ: <strong>$${deposit.amount.toFixed(2)}</strong></p>
            </div>
            <div class="bank-payment">
                <div class="bank-details">
                    <h4>معلومات الحساب البنكي:</h4>
                    <div class="bank-info">
                        <div class="info-row">
                            <span>اسم البنك:</span>
                            <strong>National Bank of Algeria</strong>
                        </div>
                        <div class="info-row">
                            <span>اسم الحساب:</span>
                            <strong>Cicada Investment LLC</strong>
                        </div>
                        <div class="info-row">
                            <span>رقم الحساب:</span>
                            <strong>0012345678901234</strong>
                        </div>
                        <div class="info-row">
                            <span>IBAN:</span>
                            <strong>DZ12 0001 2345 6789 0123 4567 89</strong>
                        </div>
                        <div class="info-row">
                            <span>SWIFT/BIC:</span>
                            <strong>CICADDZA</strong>
                        </div>
                    </div>
                </div>
                <div class="bank-instructions">
                    <h4>التعليمات:</h4>
                    <ol>
                        <li>قم بتحويل المبلغ إلى الحساب أعلاه</li>
                        <li>أرفق إيصال التحويل أدناه</li>
                        <li>استخدم رقم الإيداع كمرجع: <strong>${deposit.id}</strong></li>
                        <li>ستتم المعالجة خلال 1-3 أيام عمل</li>
                    </ol>
                </div>
                <div class="form-group">
                    <label>إرفاق إيصال التحويل</label>
                    <input type="file" accept="image/*,.pdf" id="bankReceipt">
                </div>
                <button onclick="submitBankTransfer('${deposit.id}')" class="btn-primary btn-block">
                    <i class="fas fa-upload"></i> رفع الإيصال
                </button>
            </div>
        </div>
    `;
}

/**
 * Get generic gateway HTML
 */
function getGenericGatewayHTML(deposit) {
    return `
        <div class="payment-gateway">
            <div class="gateway-header">
                <i class="fas fa-check-circle fa-3x" style="color:var(--success-color);"></i>
                <h3>تم إنشاء طلب الإيداع</h3>
            </div>
            <div class="success-message">
                <p>رقم الطلب: <strong>${deposit.id}</strong></p>
                <p>المبلغ: <strong>$${deposit.amount.toFixed(2)}</strong></p>
                <p>الحالة: <strong>قيد المعالجة</strong></p>
                <button onclick="closeModal()" class="btn-primary btn-block">
                    <i class="fas fa-check"></i> تم
                </button>
            </div>
        </div>
    `;
}

/**
 * Generate demo crypto address
 */
function generateDemoAddress(method) {
    const addresses = {
        bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ethereum: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
        usdt: 'TRXaddress1234567890abcdefghijklmnopqr'
    };
    return addresses[method] || 'DEMO_ADDRESS_' + Date.now();
}

/**
 * Copy crypto address
 */
function copyCryptoAddress() {
    const addressInput = document.getElementById('cryptoAddress');
    if (addressInput) {
        addressInput.select();
        document.execCommand('copy');
        showAlert('success', 'تم نسخ العنوان بنجاح');
    }
}

/**
 * Confirm crypto payment
 */
function confirmCryptoPayment(depositId) {
    closeModal();
    showAlert('success', 'تم استلام طلبك. سنقوم بالتحقق من الدفع وإضافة المبلغ إلى محفظتك قريباً.');
    renderDepositHistory();
}

/**
 * Redirect to PayPal
 */
function redirectToPayPal(depositId) {
    showAlert('info', 'جاري التحويل إلى PayPal...');
    setTimeout(() => {
        closeModal();
        showAlert('success', 'تم إتمام الدفع عبر PayPal بنجاح!');
        renderDepositHistory();
    }, 2000);
}

/**
 * Submit bank transfer
 */
function submitBankTransfer(depositId) {
    const receiptInput = document.getElementById('bankReceipt');
    if (!receiptInput?.files?.length) {
        showAlert('error', 'يرجى إرفاق إيصال التحويل');
        return;
    }
    
    closeModal();
    showAlert('success', 'تم رفع الإيصال بنجاح. سيتم مراجعته خلال 24 ساعة.');
    renderDepositHistory();
}

/**
 * Render deposit history
 */
function renderDepositHistory() {
    const container = document.getElementById('depositHistory');
    if (!container) return;

    if (depositHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox fa-3x"></i>
                <p>لا توجد عمليات إيداع سابقة</p>
            </div>
        `;
        return;
    }

    container.innerHTML = depositHistory.map(deposit => `
        <div class="history-item">
            <div class="history-icon">
                <i class="fas ${paymentMethods[deposit.method]?.icon || 'fa-money-bill'}"></i>
            </div>
            <div class="history-details">
                <h4>${paymentMethods[deposit.method]?.name || deposit.method}</h4>
                <p>${deposit.date}</p>
                <small>رقم المعاملة: ${deposit.transactionId}</small>
            </div>
            <div class="history-amount">
                <span class="amount">+$${deposit.amount.toFixed(2)}</span>
                <span class="status ${deposit.status}">${getStatusText(deposit.status)}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Get status text in Arabic
 */
function getStatusText(status) {
    const statusMap = {
        completed: 'مكتمل',
        pending: 'قيد المعالجة',
        failed: 'فشل',
        cancelled: 'ملغي'
    };
    return statusMap[status] || status;
}

/**
 * Update deposit stats
 */
function updateDepositStats() {
    const totalDeposits = depositHistory.reduce((sum, d) => 
        d.status === 'completed' ? sum + d.amount : sum, 0
    );
    const pendingDeposits = depositHistory.filter(d => d.status === 'pending').length;

    updateStatIfExists('total-deposits', '$' + totalDeposits.toFixed(2));
    updateStatIfExists('pending-deposits', pendingDeposits);
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
        <div class="modal-overlay" id="paymentModal" onclick="if(event.target === this) closeModal()">
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
    const modal = document.getElementById('paymentModal');
    if (modal) modal.remove();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('deposits.html')) {
        initDepositsPage();
    }
});

// Export functions for global use
window.copyCryptoAddress = copyCryptoAddress;
window.confirmCryptoPayment = confirmCryptoPayment;
window.redirectToPayPal = redirectToPayPal;
window.submitBankTransfer = submitBankTransfer;
window.closeModal = closeModal;
