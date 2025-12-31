/**
 * Register Page Authentication - Redirects to Onboarding
 */

import {
    auth,
    db,
    googleProvider,
    facebookProvider,
    createUserWithEmailAndPassword,
    signInWithPopup,
    doc,
    setDoc,
    serverTimestamp
} from './firebase-config.js';

// Show/Hide Password Logic
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const icon = togglePassword.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    });
}

const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener('click', () => {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        const icon = toggleConfirmPassword.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    });
}

// Register Logic
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        
        if (!terms) { showMessage('يجب الموافقة على الشروط', 'error'); return; }
        if (password !== confirmPassword) { showMessage('كلمات المرور غير متطابقة', 'error'); return; }
        if (password.length < 6) { showMessage('كلمة المرور قصيرة جداً', 'error'); return; }
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإنشاء...';
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Save initial data
            setDoc(doc(db, 'users', user.uid), {
                fullname: fullname,
                email: email,
                phone: phone,
                balance: 0,
                invested: 0,
                totalEarnings: 0,
                createdAt: serverTimestamp(),
                verified: false,
                onboardingCompleted: false, // مهم جداً
                level: 'basic'
            });
            
            showMessage('تم إنشاء الحساب بنجاح!', 'success');
            
            // Redirect to ONBOARDING instead of DASHBOARD
            setTimeout(() => {
                window.location.replace('onboarding.html');
            }, 1000);
            
        } catch (error) {
            console.error('Registration Error:', error);
            showMessage(error.message, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'إنشاء الحساب';
        }
    });
}

// Helper Functions
function showMessage(message, type) {
    const existingMsg = document.querySelector('.auth-message');
    if (existingMsg) existingMsg.remove();
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
    const form = document.getElementById('registerForm');
    if (form) form.parentNode.insertBefore(messageDiv, form);
    setTimeout(() => { if(messageDiv) messageDiv.remove(); }, 5000);
}
