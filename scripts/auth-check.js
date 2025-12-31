/**
 * Auth Check with Loading State
 * يحل مشكلة الطرد المفاجئ
 */

import { auth, onAuthStateChanged } from './firebase-config.js';

// إنشاء شاشة تحميل مؤقتة
const loader = document.createElement('div');
loader.id = 'auth-loader';
loader.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: #0B0E11;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #F0B90B;
    font-size: 1.5rem;
    font-family: sans-serif;
`;
loader.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> &nbsp; جاري التحقق...';
document.body.appendChild(loader);

// التحقق من المستخدم
onAuthStateChanged(auth, (user) => {
    const loaderElement = document.getElementById('auth-loader');
    
    if (user) {
        console.log('✅ User confirmed:', user.email);
        // المستخدم مسجل - احفظ بياناته وأخفِ شاشة التحميل
        localStorage.setItem('cicada_user_uid', user.uid);
        if (loaderElement) loaderElement.style.display = 'none';
    } else {
        console.log('❌ No user found, redirecting...');
        // المستخدم غير مسجل - وجهه لصفحة الدخول
        window.location.href = 'login.html';
    }
});
