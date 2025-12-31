/**
 * Wallet Page JavaScript
 */

// Refresh Balance
function refreshBalance() {
    const btn = event.target.closest('.wallet-refresh');
    btn.querySelector('i').style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        btn.querySelector('i').style.animation = '';
        alert('تم تحديث الرصيد بنجاح!');
    }, 1000);
}

// Open Deposit Modal
function openDepositModal() {
    document.getElementById('depositModal').style.display = 'flex';
}

// Close Deposit Modal
function closeDepositModal() {
    document.getElementById('depositModal').style.display = 'none';
    document.getElementById('depositAmount').value = '';
    updateDepositDisplay();
}

// Open Withdraw Modal
function openWithdrawModal() {
    document.getElementById('withdrawModal').style.display = 'flex';
}

// Close Withdraw Modal
function closeWithdrawModal() {
    document.getElementById('withdrawModal').style.display = 'none';
    document.getElementById('withdrawAmount').value = '';
    updateWithdrawDisplay();
}

// Set Quick Amount
function setAmount(amount) {
    document.getElementById('depositAmount').value = amount;
    updateDepositDisplay();
}

function setWithdrawAmount(amount) {
    if (amount === 'all') {
        document.getElementById('withdrawAmount').value = 4047.89;
    } else {
        document.getElementById('withdrawAmount').value = amount;
    }
    updateWithdrawDisplay();
}

// Update Deposit Display
document.getElementById('depositAmount')?.addEventListener('input', updateDepositDisplay);

function updateDepositDisplay() {
    const amount = parseFloat(document.getElementById('depositAmount')?.value || 0);
    document.getElementById('depositAmountDisplay').textContent = `$${amount.toFixed(2)}`;
    document.getElementById('depositTotal').textContent = `$${amount.toFixed(2)}`;
}

// Update Withdraw Display
document.getElementById('withdrawAmount')?.addEventListener('input', updateWithdrawDisplay);

function updateWithdrawDisplay() {
    const amount = parseFloat(document.getElementById('withdrawAmount')?.value || 0);
    const fee = amount * 0.02;
    const total = amount - fee;
    
    document.getElementById('withdrawAmountDisplay').textContent = `$${amount.toFixed(2)}`;
    document.getElementById('withdrawFee').textContent = `$${fee.toFixed(2)}`;
    document.getElementById('withdrawTotal').textContent = `$${total.toFixed(2)}`;
}

// Process Deposit
function processDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    
    if (!amount || amount < 10) {
        alert('الحد الأدنى للإيداع هو $10');
        return;
    }
    
    alert('جاري معالجة الإيداع...\nسيتم تحويلك لصفحة الدفع');
    setTimeout(() => {
        closeDepositModal();
    }, 1500);
}

// Process Withdraw
function processWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    
    if (!amount || amount < 10) {
        alert('الحد الأدنى للسحب هو $10');
        return;
    }
    
    if (amount > 4047.89) {
        alert('المبلغ أكبر من الرصيد المتاح');
        return;
    }
    
    alert('تم تقديم طلب السحب بنجاح!\nسيتم معالجته خلال 24-72 ساعة');
    setTimeout(() => {
        closeWithdrawModal();
    }, 1500);
}

// Payment Method Selection
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
    });
});

// Add Payment Method
function addPaymentMethod() {
    alert('سيتم فتح نموذج إضافة طريقة دفع جديدة');
}

// Mobile Menu
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Close modals on overlay click
['depositModal', 'withdrawModal'].forEach(modalId => {
    document.getElementById(modalId)?.addEventListener('click', (e) => {
        if (e.target.id === modalId) {
            if (modalId === 'depositModal') closeDepositModal();
            if (modalId === 'withdrawModal') closeWithdrawModal();
        }
    });
});
