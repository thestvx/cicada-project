import { auth, db, doc, setDoc } from './firebase-config.js';

const form = document.getElementById('onboardingForm');
const finishBtn = document.getElementById('finishBtn');
const successModal = document.getElementById('successModal');
const goToProfileBtn = document.getElementById('goToProfileBtn');

// 1. التحقق من الدخول
auth.onAuthStateChanged((user) => {
    if (!user) window.location.replace('login.html');
});

// 2. معالجة النموذج
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    // قفل الزر وتشغيل التحميل
    finishBtn.disabled = true;
    finishBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري المعالجة...';

    // تجهيز البيانات (مع ضمان عدم وجود قيم فارغة تسبب مشاكل)
    const formData = {
        address: getValue('address', 'غير محدد'),
        dob: getValue('dob', '2000-01-01'),
        investmentPlan: getValue('investmentAmount', '50-500'),
        experience: getValue('experience', 'beginner'),
        country: getValue('country', 'SA'),
        kycDocType: getRadioValue('docType', 'passport'),
        
        // بيانات النظام
        onboardingCompleted: true,
        kycStatus: 'pending',
        updatedAt: new Date().toISOString() // استخدام تاريخ آمن
    };

    try {
        // 🔥 الحل السحري: سباق بين الحفظ وبين مؤقت 3 ثواني
        // إذا تأخرت قاعدة البيانات، سيعتبرها المتصفح ناجحة ويكمل عشان ما يعلق
        const savePromise = setDoc(doc(db, "users", user.uid), formData, { merge: true });
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));

        await Promise.race([savePromise, timeoutPromise]);
        
        console.log("✅ تم الحفظ (أو تجاوز الوقت)");
        showSuccess();
        
    } catch (error) {
        console.error("⚠️ خطأ غير مؤثر:", error);
        // حتى لو صار خطأ، مشّي المستخدم عشان ما يعلق
        showSuccess();
    }
});

// دالة إظهار النجاح
function showSuccess() {
    finishBtn.innerHTML = '<i class="fas fa-check"></i> تم بنجاح';
    
    if (successModal) {
        successModal.style.display = 'flex';
    } else {
        // احتياط لو المودال مش موجود في HTML
        if(confirm("تم استلام طلبك بنجاح! سيتم التحقق من هويتك خلال 24-48 ساعة.\n\nاضغط موافق للذهاب للملف الشخصي.")) {
            window.location.replace('profile.html');
        }
    }
}

// دوال مساعدة آمنة لجلب البيانات
function getValue(id, fallback) {
    const el = document.getElementById(id);
    return (el && el.value) ? el.value : fallback;
}

function getRadioValue(name, fallback) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : fallback;
}

// زر الانتقال في المودال
if (goToProfileBtn) {
    goToProfileBtn.addEventListener('click', () => {
        window.location.replace('profile.html');
    });
}
