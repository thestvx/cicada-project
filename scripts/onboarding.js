import { auth, db, doc, updateDoc, serverTimestamp } from './firebase-config.js';

const form = document.getElementById('onboardingForm');
const finishBtn = document.getElementById('finishBtn');

// تأكد أن المستخدم مسجل دخول
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    // تغيير حالة الزر
    finishBtn.disabled = true;
    finishBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري إرسال البيانات...';

    // جمع البيانات
    const formData = {
        address: document.getElementById('address').value,
        dob: document.getElementById('dob').value,
        investmentPlan: document.getElementById('investmentAmount').value,
        experience: document.getElementById('experience').value,
        country: document.getElementById('country').value,
        kycDocType: document.querySelector('input[name="docType"]:checked').value,
        
        // الحقول المهمة للنظام
        onboardingCompleted: true,
        kycStatus: 'pending', // قيد المراجعة
        updatedAt: serverTimestamp()
    };

    try {
        // تحديث مستند المستخدم في Firestore
        await updateDoc(doc(db, "users", user.uid), formData);
        
        // نجاح
        alert('تم إكمال ملفك بنجاح! جاري توجيهك للمنصة...');
        window.location.replace('dashboard.html');
        
    } catch (error) {
        console.error("Onboarding Error:", error);
        alert("حدث خطأ أثناء الحفظ. الرجاء المحاولة مرة أخرى.");
        finishBtn.disabled = false;
        finishBtn.innerHTML = 'إكمال وإرسال';
    }
});
