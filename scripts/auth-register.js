/**
 * Register Page Authentication
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

// Show/Hide Confirm Password
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

toggleConfirmPassword?.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    
    const icon = toggleConfirmPassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Email/Password Register
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validation
    if (!terms) {
        showMessage('يجب الموافقة على الشروط والأحكام', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
    
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('تم إنشاء الحساب بنجاح:', user.email);
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            fullname: fullname,
            email: email,
            phone: phone,
            balance: 0,
            invested: 0,
            totalEarnings: 0,
            referralCode: generateReferralCode(),
            createdAt: serverTimestamp(),
            verified: false,
            level: 'basic'
        });
        
        console.log('تم حفظ بيانات المستخدم في Firestore');
        
        showMessage('تم إنشاء الحساب بنجاح! 🎉', 'success');
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('خطأ في إنشاء الحساب:', error);
        
        let errorMessage = 'حدث خطأ في إنشاء الحساب';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                break;
            case 'auth/invalid-email':
                errorMessage = 'البريد الإلكتروني غير صالح';
                break;
            case 'auth/weak-password':
                errorMessage = 'كلمة المرور ضعيفة جداً';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'خطأ في الاتصال بالإنترنت';
                break;
            default:
                errorMessage = error.message;
        }
        
        showMessage(errorMessage, 'error');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> إنشاء حساب';
    }
});

// Google Sign Up
const googleBtn = document.querySelector('.social-btn.google');
googleBtn?.addEventListener('click', async () => {
    try {
        googleBtn.disabled = true;
        googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاتصال...';
        
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        console.log('تم التسجيل بواسطة Google:', user.email);
        
        // Save user data to Firestore (if new user)
        await setDoc(doc(db, 'users', user.uid), {
            fullname: user.displayName || 'مستخدم',
            email: user.email,
            phone: user.phoneNumber || '',
            balance: 0,
            invested: 0,
            totalEarnings: 0,
            referralCode: generateReferralCode(),
            createdAt: serverTimestamp(),
            verified: user.emailVerified,
            level: 'basic',
            photoURL: user.photoURL || ''
        }, { merge: true });
        
        showMessage('تم التسجيل بنجاح عبر Google! 🎉', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في التسجيل بواسطة Google:', error);
        
        let errorMessage = 'فشل التسجيل عبر Google';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'تم إلغاء التسجيل';
        }
        
        showMessage(errorMessage, 'error');
        
        googleBtn.disabled = false;
        googleBtn.innerHTML = '<i class="fab fa-google"></i><span>التسجيل بـ Google</span>';
    }
});

// Facebook Sign Up
const facebookBtn = document.querySelector('.social-btn.facebook');
facebookBtn?.addEventListener('click', async () => {
    try {
        facebookBtn.disabled = true;
        facebookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاتصال...';
        
        const result = await signInWithPopup(auth, facebookProvider);
        const user = result.user;
        
        console.log('تم التسجيل بواسطة Facebook:', user.email);
        
        // Save user data
        await setDoc(doc(db, 'users', user.uid), {
            fullname: user.displayName || 'مستخدم',
            email: user.email,
            phone: user.phoneNumber || '',
            balance: 0,
            invested: 0,
            totalEarnings: 0,
            referralCode: generateReferralCode(),
            createdAt: serverTimestamp(),
            verified: user.emailVerified,
            level: 'basic',
            photoURL: user.photoURL || ''
        }, { merge: true });
        
        showMessage('تم التسجيل بنجاح عبر Facebook! 🎉', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('خطأ في التسجيل بواسطة Facebook:', error);
        showMessage('فشل التسجيل عبر Facebook', 'error');
        
        facebookBtn.disabled = false;
        facebookBtn.innerHTML = '<i class="fab fa-facebook"></i><span>التسجيل بـ Facebook</span>';
    }
});

// Generate Referral Code
function generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Show Message Function
function showMessage(message, type) {
    const existingMsg = document.querySelector('.auth-message');
    if (existingMsg) existingMsg.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    const form = document.getElementById('registerForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
