/**
 * Register Page Authentication - Fixed for Speed
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

// Show/Hide Confirm Password
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

// Email/Password Register
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
        
        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإنشاء...';
        
        try {
            // 1. Create User (Critical Step)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('✅ Account Created:', user.uid);
            
            // 2. Save Data (Non-Blocking / Background Step)
            // لاحظ: حذفنا await هنا لكي لا ينتظر الكود قاعدة البيانات
            setDoc(doc(db, 'users', user.uid), {
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
            }).then(() => {
                console.log("✅ Data saved to Firestore");
            }).catch((err) => {
                console.warn("⚠️ Data save warning (user still created):", err);
            });
            
            showMessage('تم إنشاء الحساب بنجاح!', 'success');
            
            // 3. Redirect Immediately
            setTimeout(() => {
                window.location.replace('dashboard.html');
            }, 500); // 0.5 second delay just to see the success message
            
        } catch (error) {
            console.error('Registration Error:', error);
            
            let errorMessage = 'حدث خطأ غير متوقع';
            
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
                    errorMessage = 'تأكد من اتصالك بالإنترنت';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showMessage(errorMessage, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'إنشاء الحساب';
        }
    });
}

// Google Sign Up
const googleBtn = document.querySelector('.social-btn.google');
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            googleBtn.disabled = true;
            googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Background save
            setDoc(doc(db, 'users', user.uid), {
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
            
            window.location.replace('dashboard.html');
            
        } catch (error) {
            console.error('Google Error:', error);
            showMessage('فشل التسجيل عبر Google', 'error');
            googleBtn.disabled = false;
            googleBtn.innerHTML = '<i class="fab fa-google"></i><span>Google</span>';
        }
    });
}

// Facebook Sign Up
const facebookBtn = document.querySelector('.social-btn.facebook');
if (facebookBtn) {
    facebookBtn.addEventListener('click', async () => {
        try {
            facebookBtn.disabled = true;
            facebookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;
            
            // Background save
            setDoc(doc(db, 'users', user.uid), {
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
            
            window.location.replace('dashboard.html');
            
        } catch (error) {
            console.error('Facebook Error:', error);
            showMessage('فشل التسجيل عبر Facebook', 'error');
            facebookBtn.disabled = false;
            facebookBtn.innerHTML = '<i class="fab fa-facebook"></i><span>Facebook</span>';
        }
    });
}

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
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
    }
    
    setTimeout(() => {
        if(messageDiv) messageDiv.remove();
    }, 5000);
}
