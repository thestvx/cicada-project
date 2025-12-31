import { auth, db, doc, setDoc } from './firebase-config.js'; 
// لاحظ: أزلت serverTimestamp من الاستيراد لتجنب المشاكل

const form = document.getElementById('onboardingForm');
const finishBtn = document.getElementById('finishBtn');

// 1. التأكد من تسجيل الدخول
auth.onAuthStateChanged((user) => {
    if (!user) window.location.replace('login.html');
});

// 2. معالجة النموذج
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log("🚀 بدأنا عملية الحفظ...");

    const user = auth.currentUser;
    if (!user) {
        alert("يرجى تسجيل الدخول أولاً!");
        return;
    }

    // قفل الزر وتشغيل التحميل
    finishBtn.disabled = true;
    finishBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري الحفظ...';

    try {
        // جمع البيانات (مع حماية ضد الحقول الفارغة)
        const formData = {
            address: document.getElementById('address')?.value || '',
            dob: document.getElementById('dob')?.value || '',
            investmentPlan: document.getElementById('investmentAmount')?.value || '50-500',
            experience: document.getElementById('experience')?.value || 'beginner',
            country: document.getElementById('country')?.value || 'SA',
            kycDocType: document.querySelector('input[name="docType"]:checked')?.value || 'passport',
            
            // المفاتيح الأساسية
            onboardingCompleted: true,
            kycStatus: 'pending',
            
            // 🔥 التعديل المهم هنا: استخدام تاريخ الجافاسكريبت العادي بدلاً من Firebase
            updatedAt: new Date().toISOString() 
        };

        console.log("📦 جاري إرسال البيانات لقاعدة البيانات:", formData);

        // الحفظ في Firestore
        await setDoc(doc(db, "users", user.uid), formData, { merge: true });
        
        console.log("✅ تم الحفظ! جاري الانتقال...");
        
        // الانتقال للصفحة التالية
        window.location.replace('profile.html');
        
    } catch (error) {
        // هذا الكود سيعمل فقط إذا حدثت مصيبة في الاتصال
        console.error("❌ الخطأ بالتفصيل:", error);
        alert("فشل الحفظ: " + error.message);
        
        // إعادة الزر للعمل
        finishBtn.disabled = false;
        finishBtn.innerHTML = 'إكمال وإرسال';
    }
});
