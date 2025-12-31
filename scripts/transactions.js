/**
 * Transactions Page JavaScript
 */

// View Transaction Details
function viewTransaction(id) {
    const modal = document.getElementById('transactionModal');
    const detailsContainer = document.getElementById('transactionDetails');
    
    // Sample transaction data
    const transactions = {
        1: {
            id: '#TXN-2025-001234',
            type: 'إيداع',
            method: 'Bitcoin Wallet',
            amount: '$500.00',
            status: 'مكتملة',
            date: '31 ديسمبر 2025 - 10:30 صباحاً',
            hash: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            fee: '$2.50',
            notes: 'تم استلام الإيداع بنجاح'
        }
    };
    
    const txn = transactions[id] || transactions[1];
    
    detailsContainer.innerHTML = `
        <div style="background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">
                ${txn.type === 'إيداع' ? '✅' : '⬆️'}
            </div>
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">${txn.type}</h3>
            <p style="color: var(--text-muted); margin: 0;">${txn.id}</p>
        </div>
        
        <div class="transaction-detail-row">
            <span class="detail-label">المبلغ</span>
            <span class="detail-value" style="color: var(--success); font-size: 1.5rem;">${txn.amount}</span>
        </div>
        
        <div class="transaction-detail-row">
            <span class="detail-label">الحالة</span>
            <span class="status-badge completed">
                <i class="fas fa-check-circle"></i>
                ${txn.status}
            </span>
        </div>
        
        <div class="transaction-detail-row">
            <span class="detail-label">الطريقة</span>
            <span class="detail-value">${txn.method}</span>
        </div>
        
        <div class="transaction-detail-row">
            <span class="detail-label">التاريخ</span>
            <span class="detail-value">${txn.date}</span>
        </div>
        
        <div class="transaction-detail-row">
            <span class="detail-label">الرسوم</span>
            <span class="detail-value">${txn.fee}</span>
        </div>
        
        <div class="transaction-detail-row">
            <span class="detail-label">Hash</span>
            <span class="detail-value" style="font-size: 0.75rem; word-break: break-all;">${txn.hash}</span>
        </div>
        
        <div style="background: rgba(14, 203, 129, 0.1); border: 1px solid rgba(14, 203, 129, 0.3); border-radius: var(--radius-md); padding: 1rem; margin-top: 1.5rem;">
            <p style="color: var(--success); margin: 0; font-size: 0.9rem;">
                <i class="fas fa-info-circle"></i>
                ${txn.notes}
            </p>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button class="btn btn-outline btn-block" onclick="downloadReceipt()">
                <i class="fas fa-download"></i>
                تحميل الإيصال
            </button>
            <button class="btn btn-primary btn-block" onclick="contactSupport()">
                <i class="fas fa-headset"></i>
                الدعم
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Close Transaction Modal
function closeTransactionModal() {
    document.getElementById('transactionModal').style.display = 'none';
}

// Export Transactions
function exportTransactions() {
    alert('جاري تصدير المعاملات...');
}

// Download Receipt
function downloadReceipt() {
    alert('جاري تحميل الإيصال...');
}

// Contact Support
function contactSupport() {
    window.location.href = 'support.html';
}

// Filter Transactions
document.getElementById('typeFilter')?.addEventListener('change', filterTransactions);
document.getElementById('statusFilter')?.addEventListener('change', filterTransactions);
document.getElementById('periodFilter')?.addEventListener('change', filterTransactions);

function filterTransactions() {
    // Filter logic here
    console.log('Filtering transactions...');
}

// Mobile Menu
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Close modal on overlay click
document.getElementById('transactionModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'transactionModal') {
        closeTransactionModal();
    }
});
