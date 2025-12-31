/**
 * Auth Guard - Protects Pages & Enforces Onboarding
 */

import { auth, onAuthStateChanged, db, doc, getDoc } from './firebase-config.js';

// 1. Create Loading Screen (Black Overlay)
const guard = document.createElement('div');
guard.id = 'auth-guard';
guard.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background-color: #0B0E11; z-index: 999999;
    display: flex; justify-content: center; align-items: center;
    color: #F0B90B; font-family: sans-serif; font-size: 1.2rem;
`;
guard.innerHTML = '<div><i class="fas fa-circle-notch fa-spin"></i> جاري التحقق...</div>';
document.body.appendChild(guard);

// 2. Check Auth Status
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ User Authenticated:", user.email);

        // Check if user completed onboarding
        try {
            const userSnap = await getDoc(doc(db, "users", user.uid));
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const isPageOnboarding = window.location.href.includes('onboarding.html');
                
                // إذا لم يكمل التسجيل وهو ليس في صفحة الـ onboarding -> اطرده للـ onboarding
                if (!userData.onboardingCompleted && !isPageOnboarding) {
                    console.warn("⚠️ Onboarding not complete. Redirecting...");
                    window.location.replace('onboarding.html');
                    return;
                }
                
                // إذا أكمل التسجيل وهو يحاول دخول صفحة onboarding -> اطرده للداشبورد
                if (userData.onboardingCompleted && isPageOnboarding) {
                    window.location.replace('dashboard.html');
                    return;
                }
            }
            
            // Allow Access (Remove Guard)
            const guardElement = document.getElementById('auth-guard');
            if (guardElement) guardElement.remove();

        } catch (error) {
            console.error("Auth Guard Error:", error);
            // In case of error, maybe allow access or show error
            const guardElement = document.getElementById('auth-guard');
            if (guardElement) guardElement.remove();
        }

    } else {
        // Not logged in -> Redirect to Login
        console.log("❌ No User - Redirecting to Login");
        window.location.replace('login.html');
    }
});
