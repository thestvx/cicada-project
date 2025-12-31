import { auth, signOut } from './firebase-config.js';

// 1. تفعيل زر القائمة الجانبية (للموبايل)
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// 2. تفعيل زر تسجيل الخروج (يعمل في كل الصفحات)
const logoutBtn = document.querySelector('.logout'); // نستخدم class بدلاً من id لضمان عمله

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    });
}

// 3. إغلاق القائمة عند النقر خارجها (تحسين تجربة المستخدم)
document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});
