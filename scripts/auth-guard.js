/**
 * Auth Guard - Fixed Logic
 */

import { auth, onAuthStateChanged, db, doc, getDoc } from './firebase-config.js';

// Create Overlay
const guard = document.createElement('div');
guard.id = 'auth-guard';
guard.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background-color: #0B0E11; z-index: 999999;
    display: flex; justify-content: center; align-items: center;
    color: #F0B90B; font-family: sans-serif; font-size: 1.2rem;
`;
guard.innerHTML = '<div><i class="fas fa-circle-notch fa-spin"></i> جاري التحقق...</div>';
if (!document.getElementById('auth-guard')) document.body.appendChild(guard);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const currentUrl = window.location.href;
        const isOnboardingPage = currentUrl.includes('onboarding.html');

        try {
            // جلب بيانات المستخدم للتأكد من حالة onboardingCompleted
            const userSnap = await getDoc(doc(db, "users", user.uid));
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const isCompleted = userData.onboardingCompleted === true;

                // الحالة 1: المستخدم لم يكمل التسجيل وهو ليس في صفحة Onboarding
                if (!isCompleted && !isOnboardingPage) {
                    console.warn("⚠️ Redirecting to Onboarding...");
                    window.location.replace('onboarding.html');
                    return;
                }
                
                // الحالة 2: المستخدم أكمل التسجيل ويحاول دخول صفحة Onboarding مرة أخرى
                if (isCompleted && isOnboardingPage) {
                    console.log("✅ Onboarding already done. Redirecting to Profile...");
                    window.location.replace('profile.html'); // تغيير التوجيه للبروفايل كما طلبت
                    return;
                }
            }
            
            // السماح بالدخول (إزالة الشاشة السوداء)
            const guardElement = document.getElementById('auth-guard');
            if (guardElement) guardElement.remove();

        } catch (error) {
            console.error("Auth Guard Error:", error);
            // في حالة الخطأ، نسمح بالدخول لتجنب القفل التام
            const guardElement = document.getElementById('auth-guard');
            if (guardElement) guardElement.remove();
        }

    } else {
        // ليس مسجلاً -> اذهب لصفحة الدخول
        window.location.replace('login.html');
    }
});
