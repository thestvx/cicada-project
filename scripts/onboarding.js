import { auth, db, doc, setDoc } from './firebase-config.js';

const form = document.getElementById('onboardingForm');
const finishBtn = document.getElementById('finishBtn');
const successModal = document.getElementById('successModal');
const goToProfileBtn = document.getElementById('goToProfileBtn');

// 1. التأكد من تسجيل الدخول
auth.onAuthStateChanged((user) => {
    if (!user) window.location.replace('login.html');
});

// 2. معالجة النموذج
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    // تغيير حالة الزر لمنع التكرار
    finishBtn.disabled = true;
    finishBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري المعالجة...';

    try {
        // جمع البيانات
        const formData = {
            address: document.getElementById('address')?.value || '',
            dob: document.getElementById('dob')?.value || '',
            investmentPlan: document.getElementById('investmentAmount')?.value || '50-500',
            experience: document.getElementById('experience')?.value || 'beginner',
            country: document.getElementById('country')?.value || 'SA',
            kycDocType: document.querySelector('input[name="docType"]:checked')?.value || 'passport',
            
            // بيانات النظام
            onboardingCompleted: true,
            kycStatus: 'pending',
            updatedAt: new Date().toISOString()
        };

        // الحفظ في قاعدة البيانات
        await setDoc(doc(db, "users", user.uid), formData, { merge: true });
        
        // إخفاء التحميل على الزر
        finishBtn.innerHTML = 'تم الحفظ!';
        
        // 🔥 إظهار النافذة المنبثقة بدلاً من الانتقال المباشر
        if (successModal) {
            successModal.style.display = 'flex';
        } else {
            // حل احتياطي لو النافذة لم تظهر لسبب ما
            alert("تم إرسال البيانات بنجاح! سيتم التحقق خلال 24 ساعة.");
            window.location.replace('profile.html');
        }
        
    } catch (error) {
        console.error("Save Error:", error);
        alert("حدث خطأ: " + error.message);
        finishBtn.disabled = false;
        finishBtn.innerHTML = 'إكمال وإرسال';
    }
});

// 3. زر الانتقال داخل النافذة المنبثقة
if (goToProfileBtn) {
    goToProfileBtn.addEventListener('click', () => {
        window.location.replace('profile.html');
    });
}
