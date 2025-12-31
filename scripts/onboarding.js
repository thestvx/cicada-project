import { auth, db, doc, updateDoc, serverTimestamp } from './firebase-config.js';

const form = document.getElementById('onboardingForm');
const finishBtn = document.getElementById('finishBtn');

auth.onAuthStateChanged((user) => {
    if (!user) window.location.href = 'login.html';
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    finishBtn.disabled = true;
    finishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

    // جمع البيانات
    const data = {
        address: document.getElementById('address').value,
        dob: document.getElementById('dob').value,
        investmentPlan: document.getElementById('investmentAmount').value,
        experience: document.getElementById('experience').value,
        country: document.getElementById('country').value,
        kycDocType: document.querySelector('input[name="docType"]:checked').value,
        onboardingCompleted: true, // علامة مهمة جداً
        kycStatus: 'pending', // حالة التوثيق
        updatedAt: serverTimestamp()
    };

    // ملاحظة: رفع الصور يحتاج Firebase Storage، لكن للتبسيط الآن سنحفظ البيانات النصية فقط
    // وسنعتبر الصور مرفوعة (Placeholder Logic)
    
    try {
        await updateDoc(doc(db, "users", user.uid), data);
        
        alert('تم إرسال بياناتك بنجاح! حسابك الآن قيد المراجعة.');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error("Error:", error);
        alert("حدث خطأ في الحفظ، حاول مرة أخرى.");
        finishBtn.disabled = false;
        finishBtn.innerHTML = 'إكمال التسجيل';
    }
});
