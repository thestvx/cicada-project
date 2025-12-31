/**
 * Login Page Authentication
 */

import {
    auth,
    googleProvider,
    facebookProvider,
    signInWithEmailAndPassword,
    signInWithPopup
} from './firebase-config.js';

// Show/Hide Password
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword?.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Email/Password Login
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('تم تسجيل الدخول بنجاح:', user.email);
        
        // Show success message
        showMessage('تم تسجيل الدخول بنجاح! 🎉', 'success');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        
        let errorMessage = 'حدث خطأ في تسجيل الدخول';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'البريد الإلكتروني غير مسجل';
                break;
            case 'auth/wrong-password':
                errorMessage = 'كلمة المرور غير صحيحة';
                break;
            case 'auth/invalid-email':
                errorMessage = 'البريد الإلكتروني غير صالح';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'محاولات كثيرة. حاول مرة أخرى لاحقاً';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'خطأ في الاتصال بالإنترنت';
                break;
            default:
                errorMessage = error.message;
        }
        
        showMessage(errorMessage, 'error');
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
    }
});

// Google Sign In
const googleBtn = document.querySelector('.social-btn.google');
googleBtn?.addEventListener('click', async () => {
    try {
        googleBtn.disabled = true;
        googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاتصال...';
        
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        console.log('تم تسجيل الدخول بواسطة Google:', user.email);
        
        showMessage('تم تسجيل الدخول بنجاح عبر Google! 🎉', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في تسجيل الدخول بواسطة Google:', error);
        
        let errorMessage = 'فشل تسجيل الدخول عبر Google';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'تم إلغاء تسجيل الدخول';
        }
        
        showMessage(errorMessage, 'error');
        
        googleBtn.disabled = false;
        googleBtn.innerHTML = '<i class="fab fa-google"></i><span>تسجيل الدخول بـ Google</span>';
    }
});

// Facebook Sign In
const facebookBtn = document.querySelector('.social-btn.facebook');
facebookBtn?.addEventListener('click', async () => {
    try {
        facebookBtn.disabled = true;
        facebookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاتصال...';
        
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        
        console.log('تم تسجيل الدخول بواسطة Facebook:', user.email);
        
        showMessage('تم تسجيل الدخول بنجاح عبر Facebook! 🎉', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في تسجيل الدخول بواسطة Facebook:', error);
        showMessage('فشل تسجيل الدخول عبر Facebook', 'error');
        
        facebookBtn.disabled = false;
        facebookBtn.innerHTML = '<i class="fab fa-facebook"></i><span>تسجيل الدخول بـ Facebook</span>';
    }
});

// Show Message Function
function showMessage(message, type) {
    // Remove existing messages
    const existingMsg = document.querySelector('.auth-message');
    if (existingMsg) existingMsg.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
