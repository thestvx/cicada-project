/**
 * Profile Page Script
 * Handles all profile management functionality
 */

// User profile data
let userProfile = {
    id: 'USR123456',
    fullName: 'أحمد محمد السيد',
    email: 'ahmed@example.com',
    phone: '+213 555 123 456',
    country: 'الجزائر',
    city: 'الوادي',
    address: 'شارع الاستقلال، حي النور',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    joinDate: '2025-01-15',
    avatar: null,
    verified: true,
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    language: 'ar',
    timezone: 'Africa/Algiers',
    currency: 'USD'
};

// Security settings
let securitySettings = {
    lastPasswordChange: '2025-11-20',
    loginHistory: [
        { date: '2025-12-30 09:15', ip: '197.123.45.67', device: 'Chrome on Windows', location: 'الوادي, الجزائر' },
        { date: '2025-12-29 18:30', ip: '197.123.45.67', device: 'Mobile Safari on iPhone', location: 'الوادي, الجزائر' },
        { date: '2025-12-28 14:20', ip: '197.123.45.68', device: 'Chrome on Android', location: 'الجزائر, الجزائر' }
    ],
    activeSessions: [
        { id: 'sess1', device: 'Chrome on Windows', ip: '197.123.45.67', lastActive: '2025-12-30 09:15', current: true },
        { id: 'sess2', device: 'Mobile Safari on iPhone', ip: '197.123.45.67', lastActive: '2025-12-29 18:30', current: false }
    ]
};

/**
 * Initialize profile page
 */
function initProfilePage() {
    loadProfileData();
    initProfileTabs();
    initProfileForms();
    initAvatarUpload();
    initPasswordChange();
    initTwoFactorAuth();
    initSecuritySettings();
    renderLoginHistory();
    renderActiveSessions();
}

/**
 * Load profile data
 */
function loadProfileData() {
    // Personal Information
    setValue('profileFullName', userProfile.fullName);
    setValue('profileEmail', userProfile.email);
    setValue('profilePhone', userProfile.phone);
    setValue('profileCountry', userProfile.country);
    setValue('profileCity', userProfile.city);
    setValue('profileAddress', userProfile.address);
    setValue('profileDOB', userProfile.dateOfBirth);
    setValue('profileGender', userProfile.gender);

    // Account Information
    setValue('accountId', userProfile.id);
    setValue('accountJoinDate', userProfile.joinDate);
    setValue('accountVerified', userProfile.verified ? 'موثق ✓' : 'غير موثق');

    // Settings
    setChecked('emailNotifications', userProfile.emailNotifications);
    setChecked('smsNotifications', userProfile.smsNotifications);
    setChecked('marketingEmails', userProfile.marketingEmails);
    setValue('language', userProfile.language);
    setValue('timezone', userProfile.timezone);
    setValue('currency', userProfile.currency);

    // Two Factor Status
    updateTwoFactorStatus();

    // Avatar
    if (userProfile.avatar) {
        const avatarImg = document.getElementById('profileAvatar');
        if (avatarImg) avatarImg.src = userProfile.avatar;
    }
}

/**
 * Set input value
 */
function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value;
}

/**
 * Set checkbox checked
 */
function setChecked(id, checked) {
    const element = document.getElementById(id);
    if (element) element.checked = checked;
}

/**
 * Initialize profile tabs
 */
function initProfileTabs() {
    const tabButtons = document.querySelectorAll('.profile-tab-btn');
    const tabPanes = document.querySelectorAll('.profile-tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Update buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panes
            tabPanes.forEach(pane => {
                if (pane.id === tabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Initialize profile forms
 */
function initProfileForms() {
    // Personal Information Form
    const personalForm = document.getElementById('personalInfoForm');
    if (personalForm) {
        personalForm.addEventListener('submit', handlePersonalInfoUpdate);
    }

    // Contact Information Form
    const contactForm = document.getElementById('contactInfoForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactInfoUpdate);
    }

    // Preferences Form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', handlePreferencesUpdate);
    }
}

/**
 * Handle personal info update
 */
function handlePersonalInfoUpdate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Show loading
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

    // Simulate API call
    setTimeout(() => {
        userProfile.fullName = formData.get('fullName');
        userProfile.dateOfBirth = formData.get('dateOfBirth');
        userProfile.gender = formData.get('gender');

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        showAlert('success', 'تم تحديث المعلومات الشخصية بنجاح');
    }, 1500);
}

/**
 * Handle contact info update
 */
function handleContactInfoUpdate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

    setTimeout(() => {
        userProfile.phone = formData.get('phone');
        userProfile.country = formData.get('country');
        userProfile.city = formData.get('city');
        userProfile.address = formData.get('address');

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        showAlert('success', 'تم تحديث معلومات الاتصال بنجاح');
    }, 1500);
}

/**
 * Handle preferences update
 */
function handlePreferencesUpdate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

    setTimeout(() => {
        userProfile.emailNotifications = formData.get('emailNotifications') === 'on';
        userProfile.smsNotifications = formData.get('smsNotifications') === 'on';
        userProfile.marketingEmails = formData.get('marketingEmails') === 'on';
        userProfile.language = formData.get('language');
        userProfile.timezone = formData.get('timezone');
        userProfile.currency = formData.get('currency');

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        showAlert('success', 'تم تحديث الإعدادات بنجاح');
    }, 1500);
}

/**
 * Initialize avatar upload
 */
function initAvatarUpload() {
    const avatarInput = document.getElementById('avatarUpload');
    const uploadBtn = document.getElementById('uploadAvatarBtn');

    if (uploadBtn && avatarInput) {
        uploadBtn.addEventListener('click', () => {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file
            if (!file.type.startsWith('image/')) {
                showAlert('error', 'يرجى اختيار صورة فقط');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showAlert('error', 'حجم الصورة يجب أن يكون أقل من 5MB');
                return;
            }

            // Preview image
            const reader = new FileReader();
            reader.onload = (event) => {
                const avatarImg = document.getElementById('profileAvatar');
                if (avatarImg) {
                    avatarImg.src = event.target.result;
                    userProfile.avatar = event.target.result;
                }

                // Upload to server (simulated)
                uploadAvatar(file);
            };
            reader.readAsDataURL(file);
        });
    }

    // Remove avatar button
    const removeBtn = document.getElementById('removeAvatarBtn');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من حذف الصورة الشخصية؟')) {
                const avatarImg = document.getElementById('profileAvatar');
                if (avatarImg) {
                    avatarImg.src = '../assets/images/default-avatar.png';
                    userProfile.avatar = null;
                }
                showAlert('success', 'تم حذف الصورة الشخصية');
            }
        });
    }
}

/**
 * Upload avatar
 */
function uploadAvatar(file) {
    showAlert('info', 'جاري رفع الصورة...');

    // Simulate upload
    setTimeout(() => {
        showAlert('success', 'تم رفع الصورة الشخصية بنجاح');
    }, 2000);
}

/**
 * Initialize password change
 */
function initPasswordChange() {
    const passwordForm = document.getElementById('changePasswordForm');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }

    // Toggle password visibility
    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Handle password change
 */
function handlePasswordChange(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // Validate
    if (newPassword.length < 8) {
        showAlert('error', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('error', 'كلمة المرور الجديدة غير متطابقة');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التغيير...';

    // Simulate API call
    setTimeout(() => {
        securitySettings.lastPasswordChange = new Date().toISOString().split('T')[0];
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        e.target.reset();
        showAlert('success', 'تم تغيير كلمة المرور بنجاح');
    }, 2000);
}

/**
 * Initialize two-factor authentication
 */
function initTwoFactorAuth() {
    const enable2FABtn = document.getElementById('enable2FABtn');
    const disable2FABtn = document.getElementById('disable2FABtn');

    if (enable2FABtn) {
        enable2FABtn.addEventListener('click', show2FASetup);
    }

    if (disable2FABtn) {
        disable2FABtn.addEventListener('click', disable2FA);
    }
}

/**
 * Show 2FA setup modal
 */
function show2FASetup() {
    const secret = 'JBSWY3DPEHPK3PXP'; // Demo secret
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Cicada:${userProfile.email}?secret=${secret}&issuer=Cicada`;

    const modalHTML = `
        <div class="twofa-setup-modal">
            <h3><i class="fas fa-shield-alt"></i> تفعيل المصادقة الثنائية</h3>
            <div class="setup-steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>حمّل تطبيق المصادقة</h4>
                        <p>قم بتحميل Google Authenticator أو Authy على هاتفك المحمول</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>امسح رمز QR</h4>
                        <div class="qr-code">
                            <img src="${qrCodeUrl}" alt="QR Code">
                        </div>
                        <p>أو أدخل الرمز يدوياً: <code>${secret}</code></p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>أدخل رمز التحقق</h4>
                        <input type="text" 
                               id="verify2FACode" 
                               class="form-input" 
                               placeholder="000000"
                               maxlength="6"
                               style="text-align:center; font-size:1.5rem; letter-spacing:0.5rem;">
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button onclick="closeModal()" class="btn-secondary">إلغاء</button>
                <button onclick="verify2FASetup()" class="btn-primary">
                    <i class="fas fa-check"></i> تأكيد التفعيل
                </button>
            </div>
        </div>
    `;

    showModal('تفعيل المصادقة الثنائية', modalHTML);
}

/**
 * Verify 2FA setup
 */
function verify2FASetup() {
    const codeInput = document.getElementById('verify2FACode');
    const code = codeInput?.value;

    if (!code || code.length !== 6) {
        showAlert('error', 'يرجى إدخال رمز التحقق المكون من 6 أرقام');
        return;
    }

    // Simulate verification
    userProfile.twoFactorEnabled = true;
    updateTwoFactorStatus();
    closeModal();
    showAlert('success', 'تم تفعيل المصادقة الثنائية بنجاح');
}

/**
 * Disable 2FA
 */
function disable2FA() {
    if (confirm('هل أنت متأكد من تعطيل المصادقة الثنائية؟ سيقلل هذا من أمان حسابك.')) {
        userProfile.twoFactorEnabled = false;
        updateTwoFactorStatus();
        showAlert('success', 'تم تعطيل المصادقة الثنائية');
    }
}

/**
 * Update two-factor status
 */
function updateTwoFactorStatus() {
    const statusElement = document.getElementById('twoFactorStatus');
    const enable2FABtn = document.getElementById('enable2FABtn');
    const disable2FABtn = document.getElementById('disable2FABtn');

    if (statusElement) {
        statusElement.innerHTML = userProfile.twoFactorEnabled 
            ? '<span class="status-badge success">مفعّل</span>' 
            : '<span class="status-badge warning">غير مفعّل</span>';
    }

    if (enable2FABtn) enable2FABtn.style.display = userProfile.twoFactorEnabled ? 'none' : 'inline-block';
    if (disable2FABtn) disable2FABtn.style.display = userProfile.twoFactorEnabled ? 'inline-block' : 'none';
}

/**
 * Initialize security settings
 */
function initSecuritySettings() {
    // Last password change
    const lastChangeElement = document.getElementById('lastPasswordChange');
    if (lastChangeElement) {
        lastChangeElement.textContent = securitySettings.lastPasswordChange;
    }
}

/**
 * Render login history
 */
function renderLoginHistory() {
    const container = document.getElementById('loginHistoryContainer');
    if (!container) return;

    container.innerHTML = securitySettings.loginHistory.map(login => `
        <div class="login-history-item">
            <div class="login-icon">
                <i class="fas fa-sign-in-alt"></i>
            </div>
            <div class="login-details">
                <div class="login-device">${login.device}</div>
                <div class="login-meta">
                    <span><i class="fas fa-clock"></i> ${login.date}</span>
                    <span><i class="fas fa-network-wired"></i> ${login.ip}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${login.location}</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Render active sessions
 */
function renderActiveSessions() {
    const container = document.getElementById('activeSessionsContainer');
    if (!container) return;

    container.innerHTML = securitySettings.activeSessions.map(session => `
        <div class="session-item ${session.current ? 'current' : ''}">
            <div class="session-icon">
                <i class="fas fa-desktop"></i>
            </div>
            <div class="session-details">
                <div class="session-device">
                    ${session.device}
                    ${session.current ? '<span class="badge">الجهاز الحالي</span>' : ''}
                </div>
                <div class="session-meta">
                    <span><i class="fas fa-network-wired"></i> ${session.ip}</span>
                    <span><i class="fas fa-clock"></i> آخر نشاط: ${session.lastActive}</span>
                </div>
            </div>
            ${!session.current ? `
                <button onclick="terminateSession('${session.id}')" class="btn-danger btn-sm">
                    <i class="fas fa-times"></i> إنهاء
                </button>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Terminate session
 */
function terminateSession(sessionId) {
    if (confirm('هل أنت متأكد من إنهاء هذه الجلسة؟')) {
        securitySettings.activeSessions = securitySettings.activeSessions.filter(s => s.id !== sessionId);
        renderActiveSessions();
        showAlert('success', 'تم إنهاء الجلسة بنجاح');
    }
}

/**
 * Delete account
 */
function deleteAccount() {
    const modalHTML = `
        <div class="delete-account-modal">
            <div class="warning-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>تحذير: حذف الحساب نهائياً</h3>
            <p>هذا الإجراء لا يمكن التراجع عنه. سيتم حذف:</p>
            <ul>
                <li>جميع بياناتك الشخصية</li>
                <li>جميع استثماراتك النشطة</li>
                <li>سجل المعاملات</li>
                <li>الأرباح المعلقة</li>
                <li>روابط الإحالة</li>
            </ul>
            <div class="form-group">
                <label>اكتب "حذف حسابي" للتأكيد:</label>
                <input type="text" id="deleteConfirmText" class="form-input">
            </div>
            <div class="modal-actions">
                <button onclick="closeModal()" class="btn-secondary">إلغاء</button>
                <button onclick="confirmDeleteAccount()" class="btn-danger">
                    <i class="fas fa-trash"></i> حذف الحساب نهائياً
                </button>
            </div>
        </div>
    `;

    showModal('حذف الحساب', modalHTML);
}

/**
 * Confirm delete account
 */
function confirmDeleteAccount() {
    const confirmText = document.getElementById('deleteConfirmText')?.value;
    
    if (confirmText !== 'حذف حسابي') {
        showAlert('error', 'يرجى كتابة "حذف حسابي" للتأكيد');
        return;
    }

    // Simulate account deletion
    showAlert('info', 'جاري حذف الحساب...');
    
    setTimeout(() => {
        closeModal();
        showAlert('success', 'تم حذف الحساب بنجاح. سيتم تحويلك إلى الصفحة الرئيسية.');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }, 2000);
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
        <div class="modal-overlay" id="profileModal" onclick="if(event.target === this) closeModal()">
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
    const modal = document.getElementById('profileModal');
    if (modal) modal.remove();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('profile.html')) {
        initProfilePage();
    }
});

// Export functions for global use
window.verify2FASetup = verify2FASetup;
window.terminateSession = terminateSession;
window.deleteAccount = deleteAccount;
window.confirmDeleteAccount = confirmDeleteAccount;
window.closeModal = closeModal;
