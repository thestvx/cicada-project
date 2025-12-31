import { auth, onAuthStateChanged } from './firebase-config.js';

// 1. إنشاء شاشة سوداء تغطي الموقع فوراً لمنع المستخدم من رؤية الصفحة قبل التحقق
const guard = document.createElement('div');
guard.id = 'auth-guard';
guard.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background-color: #0B0E11;
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #F0B90B;
    font-family: sans-serif;
    font-size: 20px;
`;
guard.innerHTML = '<div><i class="fas fa-circle-notch fa-spin"></i> جاري تأكيد الدخول...</div>';
document.body.appendChild(guard);

// 2. التحقق من Firebase
onAuthStateChanged(auth, (user) => {
    if (user) {
        // ✅ المستخدم مسجل: احذف الشاشة السوداء واسمح له بالدخول
        console.log("User Verified:", user.email);
        const guardElement = document.getElementById('auth-guard');
        if (guardElement) guardElement.remove();
    } else {
        // ❌ المستخدم غير مسجل: اطرده إلى صفحة الدخول
        console.log("No User - Redirecting");
        window.location.replace('login.html');
    }
});
