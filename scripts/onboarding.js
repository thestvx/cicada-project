import { auth, db, doc, setDoc, serverTimestamp } from './firebase-config.js'; // غيرنا updateDoc إلى setDoc

const form = document.getElementById('onboardingForm');
const finishBtn = document.getElementById('finishBtn');

// التأكد من تسجيل الدخول
auth.onAuthStateChanged((user) => {
    if (!user) window.location.replace('login.html');
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    // تعطيل الزر لتجنب التكرار
    finishBtn.disabled = true;
    finishBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري الحفظ...';

    // جمع البيانات بدقة
    const formData = {
        address: document.getElementById('address').value || '',
        dob: document.getElementById('dob').value || '',
        investmentPlan: document.getElementById('investmentAmount').value || '50-500',
        experience: document.getElementById('experience').value || 'beginner',
        country: document.getElementById('country').value || 'SA',
        kycDocType: document.querySelector('input[name="docType"]:checked')?.value || 'passport',
        
        // المفاتيح الحاسمة
        onboardingCompleted: true,  // هذا هو المفتاح الذي يبحث عنه الـ Guard
        kycStatus: 'pending',
        updatedAt: serverTimestamp()
    };

    console.log("Saving onboarding data...", formData);

    try {
        // استخدمنا setDoc مع merge بدلاً من updateDoc لضمان الكتابة حتى لو المستند ناقص
        await setDoc(doc(db, "users", user.uid), formData, { merge: true });
        
        console.log("✅ Data saved successfully!");
        
        // توجيه مباشر للصفحة المطلوبة (البروفايل كما طلبت)
        window.location.replace('profile.html');
        
    } catch (error) {
        console.error("❌ Onboarding Save Error:", error);
        alert("حدث خطأ في الحفظ: " + error.message);
        
        // إعادة تفعيل الزر عند الفشل
        finishBtn.disabled = false;
        finishBtn.innerHTML = 'إكمال وإرسال';
    }
});
