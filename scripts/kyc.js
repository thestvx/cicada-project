/**
 * KYC (Know Your Customer) Page Script
 * Handles all identity verification functionality
 */

// KYC verification state
let kycData = {
    status: 'not_started', // not_started, pending, approved, rejected
    level: 0, // 0 = not verified, 1 = basic, 2 = advanced
    submittedDate: null,
    approvedDate: null,
    rejectedReason: null,
    documents: {
        idFront: null,
        idBack: null,
        selfie: null,
        proofOfAddress: null
    },
    personalInfo: {
        fullName: '',
        dateOfBirth: '',
        nationality: '',
        idNumber: '',
        idType: 'national_id',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    }
};

// KYC steps
const kycSteps = [
    {
        id: 1,
        title: 'المعلومات الشخصية',
        icon: 'fa-user',
        description: 'أدخل معلوماتك الشخصية الأساسية'
    },
    {
        id: 2,
        title: 'وثائق الهوية',
        icon: 'fa-id-card',
        description: 'قم برفع صور وثيقة الهوية الخاصة بك'
    },
    {
        id: 3,
        title: 'التحقق من الوجه',
        icon: 'fa-camera',
        description: 'التقط صورة سيلفي مع وثيقة الهوية'
    },
    {
        id: 4,
        title: 'إثبات العنوان',
        icon: 'fa-home',
        description: 'قم برفع مستند يثبت عنوان السكن'
    }
];

let currentStep = 1;

/**
 * Initialize KYC page
 */
function initKYCPage() {
    checkKYCStatus();
    renderKYCSteps();
    initStepNavigation();
    initPersonalInfoForm();
    initDocumentUploads();
    initSelfieCapture();
    initAddressProofUpload();
    initKYCSubmission();
}

/**
 * Check KYC status
 */
function checkKYCStatus() {
    const statusContainer = document.getElementById('kycStatusContainer');
    if (!statusContainer) return;

    // Check if already verified
    if (kycData.status === 'approved') {
        showVerifiedStatus();
        return;
    }

    if (kycData.status === 'pending') {
        showPendingStatus();
        return;
    }

    if (kycData.status === 'rejected') {
        showRejectedStatus();
        return;
    }

    // Show verification form
    showVerificationForm();
}

/**
 * Show verified status
 */
function showVerifiedStatus() {
    const container = document.getElementById('kycMainContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="kyc-status-card success">
            <div class="status-icon">
                <i class="fas fa-check-circle fa-5x"></i>
            </div>
            <h2>تم التحقق من هويتك بنجاح!</h2>
            <p>حسابك موثق ويمكنك الآن الوصول إلى جميع الميزات</p>
            <div class="verification-details">
                <div class="detail-item">
                    <span>مستوى التحقق:</span>
                    <strong>المستوى ${kycData.level}</strong>
                </div>
                <div class="detail-item">
                    <span>تاريخ الموافقة:</span>
                    <strong>${kycData.approvedDate || 'غير محدد'}</strong>
                </div>
            </div>
            <div class="verification-badge">
                <i class="fas fa-shield-alt"></i>
                <span>حساب موثق</span>
            </div>
            <a href="dashboard.html" class="btn-primary btn-lg">
                <i class="fas fa-home"></i> العودة إلى لوحة التحكم
            </a>
        </div>
    `;
}

/**
 * Show pending status
 */
function showPendingStatus() {
    const container = document.getElementById('kycMainContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="kyc-status-card pending">
            <div class="status-icon">
                <i class="fas fa-clock fa-5x"></i>
            </div>
            <h2>طلب التحقق قيد المراجعة</h2>
            <p>تم استلام مستنداتك وجاري مراجعتها من قبل فريقنا</p>
            <div class="verification-details">
                <div class="detail-item">
                    <span>تاريخ التقديم:</span>
                    <strong>${kycData.submittedDate || 'غير محدد'}</strong>
                </div>
                <div class="detail-item">
                    <span>وقت المعالجة المتوقع:</span>
                    <strong>24-48 ساعة</strong>
                </div>
            </div>
            <div class="pending-info">
                <i class="fas fa-info-circle"></i>
                <p>سنرسل لك إشعاراً عبر البريد الإلكتروني فور اكتمال المراجعة</p>
            </div>
            <div class="action-buttons">
                <a href="dashboard.html" class="btn-secondary">
                    <i class="fas fa-home"></i> العودة إلى لوحة التحكم
                </a>
                <button onclick="cancelKYCSubmission()" class="btn-danger">
                    <i class="fas fa-times"></i> إلغاء الطلب
                </button>
            </div>
        </div>
    `;
}

/**
 * Show rejected status
 */
function showRejectedStatus() {
    const container = document.getElementById('kycMainContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="kyc-status-card rejected">
            <div class="status-icon">
                <i class="fas fa-times-circle fa-5x"></i>
            </div>
            <h2>تم رفض طلب التحقق</h2>
            <p>للأسف، لم نتمكن من التحقق من هويتك بناءً على المستندات المقدمة</p>
            <div class="rejection-reason">
                <h4>سبب الرفض:</h4>
                <p>${kycData.rejectedReason || 'المستندات المقدمة غير واضحة أو غير صالحة'}</p>
            </div>
            <div class="rejection-help">
                <h4>ماذا تفعل الآن؟</h4>
                <ul>
                    <li>تأكد من وضوح الصور المرفوعة</li>
                    <li>تأكد من صلاحية المستندات</li>
                    <li>تأكد من تطابق المعلومات في جميع المستندات</li>
                    <li>يمكنك إعادة المحاولة بمستندات جديدة</li>
                </ul>
            </div>
            <div class="action-buttons">
                <button onclick="restartKYC()" class="btn-primary btn-lg">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
                <a href="contact.html" class="btn-secondary">
                    <i class="fas fa-headset"></i> تواصل مع الدعم
                </a>
            </div>
        </div>
    `;
}

/**
 * Show verification form
 */
function showVerificationForm() {
    // The form is already in HTML, just show it
    const formContainer = document.getElementById('kycFormContainer');
    if (formContainer) {
        formContainer.style.display = 'block';
    }
}

/**
 * Render KYC steps
 */
function renderKYCSteps() {
    const stepsContainer = document.getElementById('kycStepsContainer');
    if (!stepsContainer) return;

    stepsContainer.innerHTML = kycSteps.map(step => `
        <div class="kyc-step ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''}">
            <div class="step-number">
                ${step.id < currentStep ? '<i class="fas fa-check"></i>' : step.id}
            </div>
            <div class="step-info">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Initialize step navigation
 */
function initStepNavigation() {
    const nextBtns = document.querySelectorAll('.kyc-next-btn');
    const prevBtns = document.querySelectorAll('.kyc-prev-btn');

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                nextStep();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', prevStep);
    });
}

/**
 * Next step
 */
function nextStep() {
    if (currentStep < kycSteps.length) {
        currentStep++;
        updateStepDisplay();
    }
}

/**
 * Previous step
 */
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

/**
 * Update step display
 */
function updateStepDisplay() {
    // Update progress
    renderKYCSteps();

    // Show/hide step panels
    const stepPanels = document.querySelectorAll('.kyc-step-panel');
    stepPanels.forEach((panel, index) => {
        if (index + 1 === currentStep) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Validate current step
 */
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validatePersonalInfo();
        case 2:
            return validateDocuments();
        case 3:
            return validateSelfie();
        case 4:
            return validateAddressProof();
        default:
            return true;
    }
}

/**
 * Initialize personal info form
 */
function initPersonalInfoForm() {
    const form = document.getElementById('kycPersonalInfoForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validatePersonalInfo()) {
            const formData = new FormData(form);
            kycData.personalInfo = {
                fullName: formData.get('fullName'),
                dateOfBirth: formData.get('dateOfBirth'),
                nationality: formData.get('nationality'),
                idNumber: formData.get('idNumber'),
                idType: formData.get('idType'),
                address: formData.get('address'),
                city: formData.get('city'),
                postalCode: formData.get('postalCode'),
                country: formData.get('country')
            };
            nextStep();
        }
    });
}

/**
 * Validate personal info
 */
function validatePersonalInfo() {
    const form = document.getElementById('kycPersonalInfoForm');
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            valid = false;
        } else {
            field.classList.remove('error');
        }
    });

    if (!valid) {
        showAlert('error', 'يرجى ملء جميع الحقول المطلوبة');
    }

    return valid;
}

/**
 * Initialize document uploads
 */
function initDocumentUploads() {
    initFileUpload('idFrontUpload', 'idFrontPreview', 'idFront');
    initFileUpload('idBackUpload', 'idBackPreview', 'idBack');
}

/**
 * Initialize file upload
 */
function initFileUpload(inputId, previewId, documentType) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!input || !preview) return;

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            showAlert('error', 'يرجى اختيار صورة فقط');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showAlert('error', 'حجم الصورة يجب أن يكون أقل من 10MB');
            return;
        }

        // Preview image
        const reader = new FileReader();
        reader.onload = (event) => {
            preview.innerHTML = `
                <img src="${event.target.result}" alt="Preview">
                <button onclick="removeDocument('${documentType}')" class="remove-btn">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.classList.add('has-image');

            // Save to kycData
            kycData.documents[documentType] = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Remove document
 */
function removeDocument(documentType) {
    kycData.documents[documentType] = null;
    
    const preview = document.getElementById(`${documentType}Preview`);
    const input = document.getElementById(`${documentType}Upload`);
    
    if (preview) {
        preview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>اضغط لرفع الصورة</p>';
        preview.classList.remove('has-image');
    }
    
    if (input) {
        input.value = '';
    }
}

/**
 * Validate documents
 */
function validateDocuments() {
    if (!kycData.documents.idFront) {
        showAlert('error', 'يرجى رفع صورة الوجه الأمامي للهوية');
        return false;
    }

    if (!kycData.documents.idBack) {
        showAlert('error', 'يرجى رفع صورة الوجه الخلفي للهوية');
        return false;
    }

    return true;
}

/**
 * Initialize selfie capture
 */
function initSelfieCapture() {
    const captureBtn = document.getElementById('captureSelfieBtn');
    const uploadBtn = document.getElementById('uploadSelfieBtn');
    const selfieInput = document.getElementById('selfieUpload');

    if (captureBtn) {
        captureBtn.addEventListener('click', openCamera);
    }

    if (uploadBtn && selfieInput) {
        uploadBtn.addEventListener('click', () => {
            selfieInput.click();
        });

        selfieInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showAlert('error', 'يرجى اختيار صورة فقط');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = document.getElementById('selfiePreview');
                if (preview) {
                    preview.innerHTML = `
                        <img src="${event.target.result}" alt="Selfie">
                        <button onclick="removeDocument('selfie')" class="remove-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    preview.classList.add('has-image');
                }
                kycData.documents.selfie = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
}

/**
 * Open camera for selfie
 */
function openCamera() {
    showAlert('info', 'سيتم فتح الكاميرا...');
    // In real implementation, you would use navigator.mediaDevices.getUserMedia()
    // For demo purposes, we'll just show the upload option
    document.getElementById('uploadSelfieBtn')?.click();
}

/**
 * Validate selfie
 */
function validateSelfie() {
    if (!kycData.documents.selfie) {
        showAlert('error', 'يرجى التقاط أو رفع صورة سيلفي');
        return false;
    }

    return true;
}

/**
 * Initialize address proof upload
 */
function initAddressProofUpload() {
    initFileUpload('proofOfAddressUpload', 'proofOfAddressPreview', 'proofOfAddress');
}

/**
 * Validate address proof
 */
function validateAddressProof() {
    if (!kycData.documents.proofOfAddress) {
        showAlert('error', 'يرجى رفع إثبات العنوان');
        return false;
    }

    return true;
}

/**
 * Initialize KYC submission
 */
function initKYCSubmission() {
    const submitBtn = document.getElementById('submitKYCBtn');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitKYC);
    }
}

/**
 * Submit KYC
 */
function submitKYC() {
    // Final validation
    if (!validatePersonalInfo() || !validateDocuments() || !validateSelfie() || !validateAddressProof()) {
        showAlert('error', 'يرجى إكمال جميع الخطوات المطلوبة');
        return;
    }

    // Confirm submission
    if (!confirm('هل أنت متأكد من تقديم طلب التحقق؟\n\nيرجى التأكد من صحة جميع المعلومات والمستندات المرفوعة.')) {
        return;
    }

    const submitBtn = document.getElementById('submitKYCBtn');
    const originalText = submitBtn?.innerHTML;
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    }

    // Simulate API call
    setTimeout(() => {
        kycData.status = 'pending';
        kycData.submittedDate = new Date().toISOString().split('T')[0];

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }

        // Show success message
        showSubmissionSuccess();
    }, 3000);
}

/**
 * Show submission success
 */
function showSubmissionSuccess() {
    const modalHTML = `
        <div class="kyc-success-modal">
            <div class="success-icon">
                <i class="fas fa-check-circle fa-4x"></i>
            </div>
            <h2>تم تقديم طلب التحقق بنجاح!</h2>
            <p>شكراً لك على تقديم مستنداتك. سيقوم فريقنا بمراجعتها خلال 24-48 ساعة.</p>
            <div class="next-steps">
                <h4>الخطوات التالية:</h4>
                <ul>
                    <li><i class="fas fa-check"></i> سنرسل لك إشعاراً عبر البريد الإلكتروني</li>
                    <li><i class="fas fa-check"></i> يمكنك متابعة حالة الطلب من لوحة التحكم</li>
                    <li><i class="fas fa-check"></i> في حال وجود أي استفسار، تواصل معنا</li>
                </ul>
            </div>
            <button onclick="goToDashboard()" class="btn-primary btn-lg">
                <i class="fas fa-home"></i> العودة إلى لوحة التحكم
            </button>
        </div>
    `;

    showModal('تم التقديم بنجاح', modalHTML);

    // Refresh page after 3 seconds
    setTimeout(() => {
        location.reload();
    }, 3000);
}

/**
 * Cancel KYC submission
 */
function cancelKYCSubmission() {
    if (confirm('هل أنت متأكد من إلغاء طلب التحقق؟')) {
        kycData.status = 'not_started';
        kycData.submittedDate = null;
        showAlert('info', 'تم إلغاء طلب التحقق');
        location.reload();
    }
}

/**
 * Restart KYC
 */
function restartKYC() {
    kycData.status = 'not_started';
    kycData.rejectedReason = null;
    kycData.documents = {
        idFront: null,
        idBack: null,
        selfie: null,
        proofOfAddress: null
    };
    currentStep = 1;
    location.reload();
}

/**
 * Go to dashboard
 */
function goToDashboard() {
    window.location.href = 'dashboard.html';
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
        <div class="modal-overlay" id="kycModal">
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
    const modal = document.getElementById('kycModal');
    if (modal) modal.remove();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('kyc.html')) {
        initKYCPage();
    }
});

// Export functions for global use
window.removeDocument = removeDocument;
window.cancelKYCSubmission = cancelKYCSubmission;
window.restartKYC = restartKYC;
window.goToDashboard = goToDashboard;
window.closeModal = closeModal;
