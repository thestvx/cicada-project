/**
 * Referrals Page Script
 * Handles all referral system functionality
 */

// User referral data
const referralData = {
    referralCode: 'CICADA-USER123',
    referralLink: 'https://cicada-platform.com/register?ref=CICADA-USER123',
    totalReferrals: 24,
    activeReferrals: 18,
    totalEarnings: 1250.50,
    pendingEarnings: 125.00,
    commissionRate: 5,
    tier1: 18,
    tier2: 42,
    tier3: 78
};

// Demo referrals list
const referralsList = [
    {
        id: 'REF001',
        username: 'user@example.com',
        name: 'أحمد محمد',
        joinDate: '2025-12-15',
        status: 'active',
        totalInvestment: 5000,
        yourEarnings: 187.50,
        level: 1
    },
    {
        id: 'REF002',
        username: 'investor@example.com',
        name: 'سارة أحمد',
        joinDate: '2025-12-10',
        status: 'active',
        totalInvestment: 10000,
        yourEarnings: 375.00,
        level: 1
    },
    {
        id: 'REF003',
        username: 'trader@example.com',
        name: 'خالد علي',
        joinDate: '2025-12-05',
        status: 'active',
        totalInvestment: 2500,
        yourEarnings: 93.75,
        level: 1
    },
    {
        id: 'REF004',
        username: 'newuser@example.com',
        name: 'فاطمة حسن',
        joinDate: '2025-12-28',
        status: 'pending',
        totalInvestment: 0,
        yourEarnings: 0,
        level: 1
    },
    {
        id: 'REF005',
        username: 'inactive@example.com',
        name: 'محمود عبدالله',
        joinDate: '2025-11-20',
        status: 'inactive',
        totalInvestment: 500,
        yourEarnings: 18.75,
        level: 1
    }
];

// Earnings history
const earningsHistory = [
    {
        id: 'EARN001',
        referralId: 'REF001',
        referralName: 'أحمد محمد',
        amount: 12.50,
        type: 'investment_profit',
        date: '2025-12-30 00:01',
        description: 'عمولة من أرباح استثمار'
    },
    {
        id: 'EARN002',
        referralId: 'REF002',
        referralName: 'سارة أحمد',
        amount: 25.00,
        type: 'investment_profit',
        date: '2025-12-30 00:01',
        description: 'عمولة من أرباح استثمار'
    },
    {
        id: 'EARN003',
        referralId: 'REF001',
        referralName: 'أحمد محمد',
        amount: 50.00,
        type: 'signup_bonus',
        date: '2025-12-15 14:30',
        description: 'مكافأة تسجيل جديد'
    }
];

/**
 * Initialize referrals page
 */
function initReferralsPage() {
    updateReferralStats();
    renderReferralInfo();
    renderReferralsList();
    renderEarningsHistory();
    initCopyButtons();
    initShareButtons();
    initReferralFilters();
}

/**
 * Update referral stats
 */
function updateReferralStats() {
    updateStatIfExists('total-referrals', referralData.totalReferrals);
    updateStatIfExists('active-referrals', referralData.activeReferrals);
    updateStatIfExists('total-earnings', '$' + referralData.totalEarnings.toFixed(2));
    updateStatIfExists('pending-earnings', '$' + referralData.pendingEarnings.toFixed(2));
    updateStatIfExists('commission-rate', referralData.commissionRate + '%');
    updateStatIfExists('tier1-count', referralData.tier1);
    updateStatIfExists('tier2-count', referralData.tier2);
    updateStatIfExists('tier3-count', referralData.tier3);
}

/**
 * Render referral info
 */
function renderReferralInfo() {
    const codeElement = document.getElementById('referralCode');
    const linkElement = document.getElementById('referralLink');

    if (codeElement) codeElement.textContent = referralData.referralCode;
    if (linkElement) linkElement.value = referralData.referralLink;
}

/**
 * Render referrals list
 */
function renderReferralsList() {
    const container = document.getElementById('referralsListContainer');
    if (!container) return;

    if (referralsList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users fa-3x"></i>
                <h3>لا توجد إحالات بعد</h3>
                <p>ابدأ بدعوة أصدقائك واحصل على عمولة من أرباحهم</p>
            </div>
        `;
        return;
    }

    container.innerHTML = referralsList.map(ref => {
        const statusClass = getStatusClass(ref.status);
        const statusText = getStatusText(ref.status);

        return `
            <div class="referral-card ${statusClass}">
                <div class="referral-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="referral-info">
                    <h4>${ref.name}</h4>
                    <p class="referral-email">${ref.username}</p>
                    <div class="referral-meta">
                        <span><i class="fas fa-calendar"></i> انضم في: ${ref.joinDate}</span>
                        <span class="referral-level"><i class="fas fa-layer-group"></i> المستوى ${ref.level}</span>
                    </div>
                </div>
                <div class="referral-stats">
                    <div class="stat-item">
                        <span>استثماراته</span>
                        <strong>$${ref.totalInvestment.toLocaleString()}</strong>
                    </div>
                    <div class="stat-item highlight">
                        <span>أرباحك منه</span>
                        <strong>$${ref.yourEarnings.toFixed(2)}</strong>
                    </div>
                </div>
                <div class="referral-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <button onclick="viewReferralDetails('${ref.id}')" class="btn-icon">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Get status class
 */
function getStatusClass(status) {
    const classes = {
        active: 'success',
        pending: 'warning',
        inactive: 'secondary'
    };
    return classes[status] || 'secondary';
}

/**
 * Get status text
 */
function getStatusText(status) {
    const texts = {
        active: 'نشط',
        pending: 'قيد الانتظار',
        inactive: 'غير نشط'
    };
    return texts[status] || status;
}

/**
 * View referral details
 */
function viewReferralDetails(referralId) {
    const referral = referralsList.find(r => r.id === referralId);
    if (!referral) return;

    const statusClass = getStatusClass(referral.status);
    const statusText = getStatusText(referral.status);

    const detailsHTML = `
        <div class="referral-details-modal">
            <div class="details-header">
                <i class="fas fa-user-circle fa-3x"></i>
                <h3>${referral.name}</h3>
                <p>${referral.username}</p>
            </div>
            <div class="details-body">
                <div class="detail-section">
                    <h4>معلومات الإحالة</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>رقم الإحالة:</span>
                            <strong>${referral.id}</strong>
                        </div>
                        <div class="detail-row">
                            <span>تاريخ الانضمام:</span>
                            <strong>${referral.joinDate}</strong>
                        </div>
                        <div class="detail-row">
                            <span>المستوى:</span>
                            <strong>المستوى ${referral.level}</strong>
                        </div>
                        <div class="detail-row">
                            <span>الحالة:</span>
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>الإحصائيات</h4>
                    <div class="detail-grid">
                        <div class="detail-row">
                            <span>إجمالي الاستثمار:</span>
                            <strong>$${referral.totalInvestment.toLocaleString()}</strong>
                        </div>
                        <div class="detail-row highlight">
                            <span>أرباحك الكلية:</span>
                            <strong class="success">$${referral.yourEarnings.toFixed(2)}</strong>
                        </div>
                        <div class="detail-row">
                            <span>نسبة العمولة:</span>
                            <strong>${referralData.commissionRate}%</strong>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>سجل الأرباح من هذه الإحالة</h4>
                    <div class="earnings-list">
                        ${getEarningsForReferral(referral.id)}
                    </div>
                </div>
            </div>
            <button onclick="closeModal()" class="btn-primary btn-block">
                <i class="fas fa-times"></i> إغلاق
            </button>
        </div>
    `;

    showModal('تفاصيل الإحالة', detailsHTML);
}

/**
 * Get earnings for specific referral
 */
function getEarningsForReferral(referralId) {
    const earnings = earningsHistory.filter(e => e.referralId === referralId);
    
    if (earnings.length === 0) {
        return '<p class="text-muted">لا توجد أرباح بعد من هذه الإحالة</p>';
    }

    return earnings.map(e => `
        <div class="earning-item">
            <div class="earning-info">
                <span class="earning-type">${e.description}</span>
                <span class="earning-date">${e.date}</span>
            </div>
            <div class="earning-amount">+$${e.amount.toFixed(2)}</div>
        </div>
    `).join('');
}

/**
 * Render earnings history
 */
function renderEarningsHistory() {
    const container = document.getElementById('earningsHistoryContainer');
    if (!container) return;

    if (earningsHistory.length === 0) {
        container.innerHTML = '<p class="text-muted">لا توجد أرباح بعد</p>';
        return;
    }

    container.innerHTML = earningsHistory.map(earning => `
        <div class="earning-history-card">
            <div class="earning-icon">
                <i class="fas fa-coins"></i>
            </div>
            <div class="earning-details">
                <h4>${earning.description}</h4>
                <p>من: <strong>${earning.referralName}</strong></p>
                <span class="earning-date">
                    <i class="fas fa-clock"></i> ${earning.date}
                </span>
            </div>
            <div class="earning-amount">
                <span class="amount">+$${earning.amount.toFixed(2)}</span>
                <span class="earning-id">#${earning.id}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Initialize copy buttons
 */
function initCopyButtons() {
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            copyToClipboard(referralData.referralCode);
            showAlert('success', 'تم نسخ رمز الإحالة بنجاح');
        });
    }

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            copyToClipboard(referralData.referralLink);
            showAlert('success', 'تم نسخ رابط الإحالة بنجاح');
        });
    }
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

/**
 * Initialize share buttons
 */
function initShareButtons() {
    // WhatsApp
    const whatsappBtn = document.getElementById('shareWhatsApp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const text = `انضم إلى Cicada واحصل على أرباح يومية!\n${referralData.referralLink}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    // Facebook
    const facebookBtn = document.getElementById('shareFacebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.referralLink)}`, '_blank');
        });
    }

    // Twitter
    const twitterBtn = document.getElementById('shareTwitter');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', () => {
            const text = 'انضم إلى Cicada واحصل على أرباح يومية!';
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralData.referralLink)}`, '_blank');
        });
    }

    // Telegram
    const telegramBtn = document.getElementById('shareTelegram');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', () => {
            const text = `انضم إلى Cicada واحصل على أرباح يومية!\n${referralData.referralLink}`;
            window.open(`https://t.me/share/url?url=${encodeURIComponent(referralData.referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    // Email
    const emailBtn = document.getElementById('shareEmail');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            const subject = 'دعوة للانضمام إلى Cicada';
            const body = `مرحباً،\n\nأدعوك للانضمام إلى منصة Cicada للاستثمار والحصول على أرباح يومية.\n\nاستخدم رابط الإحالة الخاص بي:\n${referralData.referralLink}\n\nأتمنى لك استثماراً موفقاً!`;
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
}

/**
 * Initialize referral filters
 */
function initReferralFilters() {
    const filterBtns = document.querySelectorAll('[data-referral-filter]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-referral-filter');
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter referrals
            filterReferrals(filter);
        });
    });
}

/**
 * Filter referrals
 */
function filterReferrals(filter) {
    const cards = document.querySelectorAll('.referral-card');
    
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'flex';
        } else {
            const hasClass = card.classList.contains(filter);
            card.style.display = hasClass ? 'flex' : 'none';
        }
    });
}

/**
 * Generate referral QR code
 */
function generateReferralQR() {
    const qrContainer = document.getElementById('referralQR');
    if (!qrContainer) return;

    // Using QR Server API for demo
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralData.referralLink)}`;
    
    qrContainer.innerHTML = `
        <div class="qr-code-container">
            <img src="${qrImageUrl}" alt="QR Code">
            <button onclick="downloadQRCode()" class="btn-secondary btn-sm">
                <i class="fas fa-download"></i> تحميل QR Code
            </button>
        </div>
    `;
}

/**
 * Download QR code
 */
function downloadQRCode() {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(referralData.referralLink)}`;
    
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = 'cicada-referral-qr.png';
    link.click();
    
    showAlert('success', 'تم تحميل QR Code بنجاح');
}

/**
 * Calculate potential earnings
 */
function calculatePotentialEarnings() {
    const referralsInput = document.getElementById('potentialReferrals');
    const avgInvestmentInput = document.getElementById('avgInvestment');
    const resultDiv = document.getElementById('potentialResult');

    if (!referralsInput || !avgInvestmentInput || !resultDiv) return;

    const referralsCount = parseInt(referralsInput.value) || 0;
    const avgInvestment = parseFloat(avgInvestmentInput.value) || 0;

    if (referralsCount === 0 || avgInvestment === 0) {
        resultDiv.innerHTML = '<p class="text-muted">أدخل القيم لحساب الأرباح المتوقعة</p>';
        return;
    }

    // Assuming 2.5% daily return and 5% commission
    const dailyReturn = 0.025;
    const commission = referralData.commissionRate / 100;

    const dailyEarnings = referralsCount * avgInvestment * dailyReturn * commission;
    const monthlyEarnings = dailyEarnings * 30;
    const yearlyEarnings = dailyEarnings * 365;

    resultDiv.innerHTML = `
        <div class="potential-earnings-result">
            <h4>الأرباح المتوقعة:</h4>
            <div class="earnings-breakdown">
                <div class="earning-item">
                    <span>يومياً</span>
                    <strong>$${dailyEarnings.toFixed(2)}</strong>
                </div>
                <div class="earning-item">
                    <span>شهرياً</span>
                    <strong>$${monthlyEarnings.toFixed(2)}</strong>
                </div>
                <div class="earning-item highlight">
                    <span>سنوياً</span>
                    <strong>$${yearlyEarnings.toFixed(2)}</strong>
                </div>
            </div>
            <p class="calculation-note">
                <i class="fas fa-info-circle"></i>
                الحسابات تقريبية بناءً على عائد يومي ${(dailyReturn * 100).toFixed(1)}% وعمولة ${referralData.commissionRate}%
            </p>
        </div>
    `;
}

/**
 * Initialize earnings calculator
 */
function initEarningsCalculator() {
    const calculateBtn = document.getElementById('calculateEarnings');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePotentialEarnings);
    }

    // Real-time calculation
    const inputs = document.querySelectorAll('#potentialReferrals, #avgInvestment');
    inputs.forEach(input => {
        input.addEventListener('input', calculatePotentialEarnings);
    });
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
    if (window.location.pathname.includes('referrals.html')) {
        initReferralsPage();
        initEarningsCalculator();
        generateReferralQR();
    }
});

// Export functions for global use
window.viewReferralDetails = viewReferralDetails;
window.downloadQRCode = downloadQRCode;
window.calculatePotentialEarnings = calculatePotentialEarnings;
window.closeModal = closeModal;
