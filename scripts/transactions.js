/**
 * Transactions Page Script
 * Handles all transaction history and filtering functionality
 */

// Demo transactions data
const allTransactions = [
    {
        id: 'TXN001',
        type: 'deposit',
        method: 'card',
        amount: 500,
        status: 'completed',
        date: '2025-12-30 10:15',
        description: 'إيداع عبر بطاقة ائتمانية',
        reference: 'DEP001'
    },
    {
        id: 'TXN002',
        type: 'investment',
        method: 'professional',
        amount: -5000,
        status: 'completed',
        date: '2025-12-30 09:30',
        description: 'استثمار في الخطة الاحترافية',
        reference: 'INV001'
    },
    {
        id: 'TXN003',
        type: 'earning',
        method: 'investment',
        amount: 125,
        status: 'completed',
        date: '2025-12-30 00:01',
        description: 'أرباح يومية من استثمار INV001',
        reference: 'INV001'
    },
    {
        id: 'TXN004',
        type: 'withdrawal',
        method: 'paypal',
        amount: -250,
        status: 'processing',
        date: '2025-12-29 15:45',
        description: 'سحب عبر PayPal',
        reference: 'WTH002'
    },
    {
        id: 'TXN005',
        type: 'task',
        method: 'video',
        amount: 2.50,
        status: 'completed',
        date: '2025-12-29 14:20',
        description: 'مكافأة مهمة: مشاهدة فيديو ترويجي',
        reference: 'TSK001'
    },
    {
        id: 'TXN006',
        type: 'referral',
        method: 'commission',
        amount: 15.50,
        status: 'completed',
        date: '2025-12-29 11:30',
        description: 'عمولة إحالة من user@example.com',
        reference: 'REF001'
    },
    {
        id: 'TXN007',
        type: 'deposit',
        method: 'bitcoin',
        amount: 1000,
        status: 'pending',
        date: '2025-12-28 18:45',
        description: 'إيداع عبر Bitcoin',
        reference: 'DEP002'
    },
    {
        id: 'TXN008',
        type: 'withdrawal',
        method: 'bank',
        amount: -1000,
        status: 'completed',
        date: '2025-12-27 11:20',
        description: 'سحب عبر حوالة بنكية',
        reference: 'WTH001'
    },
    {
        id: 'TXN009',
        type: 'earning',
        method: 'investment',
        amount: 125,
        status: 'completed',
        date: '2025-12-29 00:01',
        description: 'أرباح يومية من استثمار INV001',
        reference: 'INV001'
    },
    {
        id: 'TXN010',
        type: 'task',
        method: 'survey',
        amount: 4.00,
        status: 'completed',
        date: '2025-12-28 16:30',
        description: 'مكافأة مهمة: إكمال استبيان قصير',
        reference: 'TSK002'
    },
    {
        id: 'TXN011',
        type: 'investment',
        method: 'basic',
        amount: -500,
        status: 'completed',
        date: '2025-12-20 13:15',
        description: 'استثمار في الخطة الأساسية',
        reference: 'INV002'
    },
    {
        id: 'TXN012',
        type: 'earning',
        method: 'investment',
        amount: 7.50,
        status: 'completed',
        date: '2025-12-28 00:01',
        description: 'أرباح يومية من استثمار INV002',
        reference: 'INV002'
    }
];

// Transaction filters state
let currentFilters = {
    type: 'all',
    status: 'all',
    dateFrom: null,
    dateTo: null,
    search: ''
};

// Pagination state
let currentPage = 1;
const itemsPerPage = 10;

/**
 * Initialize transactions page
 */
function initTransactionsPage() {
    renderTransactions();
    initFilters();
    initSearch();
    initPagination();
    initExportButtons();
    updateTransactionStats();
}

/**
 * Render transactions
 */
function renderTransactions() {
    const container = document.getElementById('transactionsContainer');
    if (!container) return;

    // Filter transactions
    const filteredTransactions = filterTransactions();

    // Paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    if (paginatedTransactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>لا توجد معاملات</h3>
                <p>لم يتم العثور على معاملات تطابق معايير البحث</p>
            </div>
        `;
        return;
    }

    container.innerHTML = paginatedTransactions.map(tx => createTransactionCard(tx)).join('');

    // Update pagination
    updatePaginationUI(filteredTransactions.length);
}

/**
 * Filter transactions
 */
function filterTransactions() {
    return allTransactions.filter(tx => {
        // Type filter
        if (currentFilters.type !== 'all' && tx.type !== currentFilters.type) {
            return false;
        }

        // Status filter
        if (currentFilters.status !== 'all' && tx.status !== currentFilters.status) {
            return false;
        }

        // Date range filter
        if (currentFilters.dateFrom || currentFilters.dateTo) {
            const txDate = new Date(tx.date);
            if (currentFilters.dateFrom && txDate < new Date(currentFilters.dateFrom)) {
                return false;
            }
            if (currentFilters.dateTo && txDate > new Date(currentFilters.dateTo)) {
                return false;
            }
        }

        // Search filter
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            return (
                tx.id.toLowerCase().includes(searchLower) ||
                tx.description.toLowerCase().includes(searchLower) ||
                tx.reference.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });
}

/**
 * Create transaction card HTML
 */
function createTransactionCard(tx) {
    const typeConfig = getTransactionTypeConfig(tx.type);
    const statusClass = getStatusClass(tx.status);
    const statusText = getStatusText(tx.status);
    const isPositive = tx.amount > 0;

    return `
        <div class="transaction-card ${tx.type}" data-id="${tx.id}">
            <div class="transaction-icon ${tx.type}">
                <i class="fas ${typeConfig.icon}"></i>
            </div>
            <div class="transaction-info">
                <h4 class="transaction-description">${tx.description}</h4>
                <div class="transaction-meta">
                    <span class="transaction-id">
                        <i class="fas fa-hashtag"></i> ${tx.id}
                    </span>
                    <span class="transaction-date">
                        <i class="fas fa-clock"></i> ${tx.date}
                    </span>
                    <span class="transaction-reference">
                        <i class="fas fa-link"></i> ${tx.reference}
                    </span>
                </div>
            </div>
            <div class="transaction-details">
                <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}
                </div>
                <span class="transaction-type">${typeConfig.label}</span>
                <span class="transaction-status ${statusClass}">${statusText}</span>
            </div>
            <button onclick="viewTransactionDetails('${tx.id}')" class="transaction-action-btn">
                <i class="fas fa-eye"></i>
            </button>
        </div>
    `;
}

/**
 * Get transaction type configuration
 */
function getTransactionTypeConfig(type) {
    const configs = {
        deposit: {
            label: 'إيداع',
            icon: 'fa-arrow-down',
            color: '#27ae60'
        },
        withdrawal: {
            label: 'سحب',
            icon: 'fa-arrow-up',
            color: '#e74c3c'
        },
        investment: {
            label: 'استثمار',
            icon: 'fa-chart-line',
            color: '#3498db'
        },
        earning: {
            label: 'أرباح',
            icon: 'fa-coins',
            color: '#f39c12'
        },
        task: {
            label: 'مهمة',
            icon: 'fa-tasks',
            color: '#9b59b6'
        },
        referral: {
            label: 'إحالة',
            icon: 'fa-user-friends',
            color: '#1abc9c'
        },
        bonus: {
            label: 'مكافأة',
            icon: 'fa-gift',
            color: '#e67e22'
        }
    };
    return configs[type] || { label: type, icon: 'fa-circle', color: '#95a5a6' };
}

/**
 * Get status class
 */
function getStatusClass(status) {
    const classes = {
        completed: 'success',
        pending: 'warning',
        processing: 'info',
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
        pending: 'قيد الانتظار',
        processing: 'جاري المعالجة',
        failed: 'فشل',
        cancelled: 'ملغي'
    };
    return statusMap[status] || status;
}

/**
 * Initialize filters
 */
function initFilters() {
    // Type filter
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            currentFilters.type = e.target.value;
            currentPage = 1;
            renderTransactions();
        });
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentPage = 1;
            renderTransactions();
        });
    }

    // Date filters
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');

    if (dateFrom) {
        dateFrom.addEventListener('change', (e) => {
            currentFilters.dateFrom = e.target.value;
            currentPage = 1;
            renderTransactions();
        });
    }

    if (dateTo) {
        dateTo.addEventListener('change', (e) => {
            currentFilters.dateTo = e.target.value;
            currentPage = 1;
            renderTransactions();
        });
    }

    // Quick date filters
    const quickDateBtns = document.querySelectorAll('[data-date-range]');
    quickDateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const range = btn.getAttribute('data-date-range');
            applyQuickDateFilter(range);
        });
    });

    // Reset filters button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

/**
 * Apply quick date filter
 */
function applyQuickDateFilter(range) {
    const today = new Date();
    let dateFrom = new Date();

    switch(range) {
        case 'today':
            dateFrom = new Date(today);
            break;
        case 'week':
            dateFrom.setDate(today.getDate() - 7);
            break;
        case 'month':
            dateFrom.setMonth(today.getMonth() - 1);
            break;
        case 'year':
            dateFrom.setFullYear(today.getFullYear() - 1);
            break;
        default:
            return;
    }

    currentFilters.dateFrom = dateFrom.toISOString().split('T')[0];
    currentFilters.dateTo = today.toISOString().split('T')[0];

    // Update inputs
    const dateFromInput = document.getElementById('dateFrom');
    const dateToInput = document.getElementById('dateTo');
    if (dateFromInput) dateFromInput.value = currentFilters.dateFrom;
    if (dateToInput) dateToInput.value = currentFilters.dateTo;

    currentPage = 1;
    renderTransactions();
}

/**
 * Reset filters
 */
function resetFilters() {
    currentFilters = {
        type: 'all',
        status: 'all',
        dateFrom: null,
        dateTo: null,
        search: ''
    };

    // Reset UI
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const searchInput = document.getElementById('transactionSearch');

    if (typeFilter) typeFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    if (dateFrom) dateFrom.value = '';
    if (dateTo) dateTo.value = '';
    if (searchInput) searchInput.value = '';

    currentPage = 1;
    renderTransactions();
}

/**
 * Initialize search
 */
function initSearch() {
    const searchInput = document.getElementById('transactionSearch');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = e.target.value;
                currentPage = 1;
                renderTransactions();
            }, 300);
        });
    }
}

/**
 * Initialize pagination
 */
function initPagination() {
    // Pagination will be updated dynamically in updatePaginationUI
}

/**
 * Update pagination UI
 */
function updatePaginationUI(totalItems) {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <div class="pagination">
            <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
    `;

    // Show page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            paginationHTML += `
                <button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (
            i === currentPage - 3 ||
            i === currentPage + 3
        ) {
            paginationHTML += `<span>...</span>`;
        }
    }

    paginationHTML += `
            <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        </div>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

/**
 * Go to page
 */
function goToPage(page) {
    const filteredTransactions = filterTransactions();
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderTransactions();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * View transaction details
 */
function viewTransactionDetails(transactionId) {
    const tx = allTransactions.find(t => t.id === transactionId);
    if (!tx) return;

    const typeConfig = getTransactionTypeConfig(tx.type);
    const statusClass = getStatusClass(tx.status);
    const statusText = getStatusText(tx.status);
    const isPositive = tx.amount > 0;

    const detailsHTML = `
        <div class="transaction-details-modal">
            <div class="details-header" style="background: ${typeConfig.color}15;">
                <i class="fas ${typeConfig.icon} fa-3x" style="color: ${typeConfig.color};"></i>
                <h3>${typeConfig.label}</h3>
            </div>
            <div class="details-body">
                <div class="detail-section">
                    <h4>معلومات المعاملة</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>رقم المعاملة:</span>
                            <strong>${tx.id}</strong>
                        </div>
                        <div class="detail-row">
                            <span>المرجع:</span>
                            <strong>${tx.reference}</strong>
                        </div>
                        <div class="detail-row">
                            <span>النوع:</span>
                            <strong>${typeConfig.label}</strong>
                        </div>
                        <div class="detail-row">
                            <span>الطريقة:</span>
                            <strong>${tx.method}</strong>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>المبلغ والحالة</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>المبلغ:</span>
                            <strong class="${isPositive ? 'positive' : 'negative'}">
                                ${isPositive ? '+' : ''}$${Math.abs(tx.amount).toFixed(2)}
                            </strong>
                        </div>
                        <div class="detail-row">
                            <span>الحالة:</span>
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>التاريخ والوقت</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>التاريخ:</span>
                            <strong>${tx.date}</strong>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>الوصف</h4>
                    <p>${tx.description}</p>
                </div>
            </div>
            <div class="details-actions">
                <button onclick="printTransaction('${tx.id}')" class="btn-secondary">
                    <i class="fas fa-print"></i> طباعة
                </button>
                <button onclick="closeModal()" class="btn-primary">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;

    showModal('تفاصيل المعاملة', detailsHTML);
}

/**
 * Print transaction
 */
function printTransaction(transactionId) {
    const tx = allTransactions.find(t => t.id === transactionId);
    if (!tx) return;

    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>فاتورة - ${tx.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .details { border: 1px solid #ddd; padding: 20px; }
                .row { display: flex; justify-content: space-between; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Cicada Investment Platform</h1>
                <h2>إيصال معاملة</h2>
            </div>
            <div class="details">
                <div class="row"><span>رقم المعاملة:</span><strong>${tx.id}</strong></div>
                <div class="row"><span>التاريخ:</span><strong>${tx.date}</strong></div>
                <div class="row"><span>النوع:</span><strong>${getTransactionTypeConfig(tx.type).label}</strong></div>
                <div class="row"><span>المبلغ:</span><strong>$${Math.abs(tx.amount).toFixed(2)}</strong></div>
                <div class="row"><span>الحالة:</span><strong>${getStatusText(tx.status)}</strong></div>
                <div class="row"><span>الوصف:</span><strong>${tx.description}</strong></div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

/**
 * Initialize export buttons
 */
function initExportButtons() {
    const exportCSVBtn = document.getElementById('exportCSV');
    const exportPDFBtn = document.getElementById('exportPDF');

    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportToCSV);
    }

    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', exportToPDF);
    }
}

/**
 * Export to CSV
 */
function exportToCSV() {
    const filteredTransactions = filterTransactions();
    
    let csv = 'رقم المعاملة,النوع,المبلغ,الحالة,التاريخ,الوصف\n';
    
    filteredTransactions.forEach(tx => {
        csv += `${tx.id},${getTransactionTypeConfig(tx.type).label},${tx.amount},${getStatusText(tx.status)},${tx.date},"${tx.description}"\n`;
    });

    downloadFile(csv, 'transactions.csv', 'text/csv');
    showAlert('success', 'تم تصدير المعاملات بنجاح');
}

/**
 * Export to PDF (simplified)
 */
function exportToPDF() {
    showAlert('info', 'جاري تصدير المعاملات إلى PDF...');
    
    // In real implementation, you would use a library like jsPDF
    setTimeout(() => {
        showAlert('success', 'تم تصدير المعاملات بنجاح');
    }, 1500);
}

/**
 * Download file
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Update transaction stats
 */
function updateTransactionStats() {
    const totalTransactions = allTransactions.length;
    const completedTransactions = allTransactions.filter(tx => tx.status === 'completed').length;
    const pendingTransactions = allTransactions.filter(tx => tx.status === 'pending' || tx.status === 'processing').length;
    
    const totalIncome = allTransactions
        .filter(tx => tx.amount > 0 && tx.status === 'completed')
        .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalExpense = allTransactions
        .filter(tx => tx.amount < 0 && tx.status === 'completed')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    updateStatIfExists('total-transactions', totalTransactions);
    updateStatIfExists('completed-transactions', completedTransactions);
    updateStatIfExists('pending-transactions', pendingTransactions);
    updateStatIfExists('total-income', '$' + totalIncome.toFixed(2));
    updateStatIfExists('total-expense', '$' + totalExpense.toFixed(2));
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
    if (window.location.pathname.includes('transactions.html')) {
        initTransactionsPage();
    }
});

// Export functions for global use
window.goToPage = goToPage;
window.viewTransactionDetails = viewTransactionDetails;
window.printTransaction = printTransaction;
window.closeModal = closeModal;
