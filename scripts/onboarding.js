import { auth, db, doc, setDoc, serverTimestamp } from './firebase-config.js';

const form = document.getElementById('onboardingForm');
const finishBtn = document.getElementById('finishBtn');

// 1. التأكد من تسجيل الدخول
auth.onAuthStateChanged((user) => {
    if (!user) window.location.replace('login.html');
});

// 2. معالجة النموذج عند الضغط على "إكمال"
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // منع تحديث الصفحة التقليدي
    
    console.log("🚀 زر الحفظ تم ضغطه!");

    const user = auth.currentUser;
    if (!user) {
        alert("يبدو أنك لست مسجلاً للدخول!");
        return;
    }

    // تغيير شكل الزر للتحميل
    finishBtn.disabled = true;
    finishBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري الحفظ...';

    try {
        // جمع البيانات النصية فقط (آمن جداً)
        // نستخدم القيم الافتراضية || '' لتجنب أي خطأ في القراءة
        const address = document.getElementById('address')?.value || '';
        const dob = document.getElementById('dob')?.value || '';
        const investmentPlan = document.getElementById('investmentAmount')?.value || '50-500';
        const experience = document.getElementById('experience')?.value || 'beginner';
        const country = document.getElementById('country')?.value || 'SA';
        
        // التعامل الآمن مع الراديو (Radio Buttons)
        const selectedDoc = document.querySelector('input[name="docType"]:checked');
        const kycDocType = selectedDoc ? selectedDoc.value : 'passport';

        console.log("📦 البيانات التي سيتم حفظها:", { address, country, kycDocType });

        // تجهيز كائن البيانات
        const formData = {
            address: address,
            dob: dob,
            investmentPlan: investmentPlan,
            experience: experience,
            country: country,
            kycDocType: kycDocType,
            
            // المفاتيح المهمة للنظام
            onboardingCompleted: true,
            kycStatus: 'pending',
            updatedAt: serverTimestamp()
        };

        // الحفظ في قاعدة البيانات
        // نستخدم merge: true لنحافظ على الإيميل والاسم الموجودين مسبقاً
        await setDoc(doc(db, "users", user.uid), formData, { merge: true });
        
        console.log("✅ تم الحفظ بنجاح!");
        
        alert('تم إكمال ملفك بنجاح! جاري توجيهك لصفحة البروفايل...');
        
        // التوجيه لصفحة البروفايل
        window.location.replace('profile.html');
        
    } catch (error) {
        console.error("❌ حدث خطأ أثناء الحفظ:", error);
        alert("حدث خطأ غير متوقع: " + error.message);
        
        // إعادة الزر لوضعه الطبيعي عند الخطأ
        finishBtn.disabled = false;
        finishBtn.innerHTML = 'إكمال وإرسال';
    }
});
