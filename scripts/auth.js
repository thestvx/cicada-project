// ===================================
// Cicada Platform - Auth Scripts
// Login & Register Frontend Logic
// ===================================

// Helper: show alert (top of page)
function showAuthAlert(type = 'success', message = '') {
  const container = document.getElementById('alertContainer');
  if (!container) return;

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };

  container.innerHTML = `
    <div class="alert alert-${type}">
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
    </div>
  `;

  setTimeout(() => {
    const alert = container.querySelector('.alert');
    if (alert) {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      setTimeout(() => alert.remove(), 300);
    }
  }, 4000);
}

// Helper: toggle password visibility
function initPasswordToggles() {
  const toggles = document.querySelectorAll('.password-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;

      const icon = toggle.querySelector('i');
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      }
    });
  });
}

// ===== Login Page Logic =====
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = form.querySelector('#email');
  const passwordInput = form.querySelector('#password');
  const twoFactorInput = form.querySelector('#twoFactorCode');
  const loginBtn = document.getElementById('loginBtn');

  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const twoFactorError = document.getElementById('twoFactorError');

  function setError(input, errorElement, message) {
    if (!input || !errorElement) return;
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }

  function clearError(input, errorElement) {
    if (!input || !errorElement) return;
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).toLowerCase());
  }

  function validateForm() {
    let isValid = true;

    // Email
    clearError(emailInput, emailError);
    if (!emailInput.value.trim()) {
      setError(emailInput, emailError, 'الرجاء إدخال البريد الإلكتروني');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setError(emailInput, emailError, 'صيغة البريد الإلكتروني غير صحيحة');
      isValid = false;
    }

    // Password
    clearError(passwordInput, passwordError);
    if (!passwordInput.value.trim()) {
      setError(passwordInput, passwordError, 'الرجاء إدخال كلمة المرور');
      isValid = false;
    } else if (passwordInput.value.length < 6) {
      setError(passwordInput, passwordError, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      isValid = false;
    }

    // 2FA (اختياري حالياً)
    if (twoFactorInput && twoFactorInput.value) {
      clearError(twoFactorInput, twoFactorError);
      if (!/^[0-9]{6}$/.test(twoFactorInput.value.trim())) {
        setError(twoFactorInput, twoFactorError, 'رمز التحقق يجب أن يكون 6 أرقام');
        isValid = false;
      }
    }

    return isValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // حالة تحميل الزر
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    // محاكاة طلب API
    setTimeout(() => {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;

      // هنا لاحقاً تربط مع Backend حقيقي
      // حالياً نحفظ "حالة تسجيل الدخول" في localStorage فقط
      localStorage.setItem('cicada_isAuthenticated', 'true');
      localStorage.setItem('cicada_userEmail', emailInput.value.trim());

      showAuthAlert('success', 'تم تسجيل الدخول بنجاح! جاري تحويلك للوحة التحكم...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    }, 1200);
  });
}

// ===== Register Page Logic =====
function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const phoneInput = form.querySelector('#phone');
  const passwordInput = form.querySelector('#password');
  const confirmPasswordInput = form.querySelector('#confirmPassword');
  const referralInput = form.querySelector('#referralCode');
  const agreeTermsInput = form.querySelector('#agreeTerms');
  const registerBtn = document.getElementById('registerBtn');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  const strengthBar = document.getElementById('passwordStrengthBar');
  const strengthWrapper = document.getElementById('passwordStrength');
  const strengthText = document.getElementById('passwordStrengthText');

  function setError(input, errorElement, message) {
    if (!input || !errorElement) return;
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }

  function clearError(input, errorElement) {
    if (!input || !errorElement) return;
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    // بسيط: يقبل + وأرقام فقط وطول من 8 إلى 15
    const regex = /^\+?[0-9]{8,15}$/;
    return regex.test(phone);
  }

  function evaluatePasswordStrength(password) {
    if (!strengthBar || !strengthWrapper || !strengthText) return;

    strengthWrapper.classList.add('show');
    strengthText.classList.add('show');

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    strengthBar.className = 'password-strength-bar';
    strengthText.className = 'password-strength-text show';

    if (score <= 1) {
      strengthBar.classList.add('weak');
      strengthText.classList.add('weak');
      strengthText.textContent = 'ضعيفة';
    } else if (score === 2 || score === 3) {
      strengthBar.classList.add('medium');
      strengthText.classList.add('medium');
      strengthText.textContent = 'متوسطة';
    } else {
      strengthBar.classList.add('strong');
      strengthText.classList.add('strong');
      strengthText.textContent = 'قوية';
    }
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const value = passwordInput.value;
      if (!value) {
        if (strengthWrapper) strengthWrapper.classList.remove('show');
        if (strengthText) strengthText.classList.remove('show');
        return;
      }
      evaluatePasswordStrength(value);
    });
  }

  function validateForm() {
    let isValid = true;

    // Name
    clearError(nameInput, nameError);
    if (!nameInput.value.trim()) {
      setError(nameInput, nameError, 'الرجاء إدخال الاسم الكامل');
      isValid = false;
    } else if (nameInput.value.trim().length < 3) {
      setError(nameInput, nameError, 'الاسم يجب أن يكون 3 أحرف على الأقل');
      isValid = false;
    }

    // Email
    clearError(emailInput, emailError);
    if (!emailInput.value.trim()) {
      setError(emailInput, emailError, 'الرجاء إدخال البريد الإلكتروني');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setError(emailInput, emailError, 'صيغة البريد الإلكتروني غير صحيحة');
      isValid = false;
    }

    // Phone
    clearError(phoneInput, phoneError);
    if (!phoneInput.value.trim()) {
      setError(phoneInput, phoneError, 'الرجاء إدخال رقم الهاتف');
      isValid = false;
    } else if (!validatePhone(phoneInput.value.trim())) {
      setError(phoneInput, phoneError, 'صيغة رقم الهاتف غير صحيحة');
      isValid = false;
    }

    // Password
    clearError(passwordInput, passwordError);
    if (!passwordInput.value.trim()) {
      setError(passwordInput, passwordError, 'الرجاء إدخال كلمة المرور');
      isValid = false;
    } else if (passwordInput.value.length < 8) {
      setError(passwordInput, passwordError, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      isValid = false;
    }

    // Confirm Password
    clearError(confirmPasswordInput, confirmPasswordError);
    if (!confirmPasswordInput.value.trim()) {
      setError(confirmPasswordInput, confirmPasswordError, 'الرجاء تأكيد كلمة المرور');
      isValid = false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
      setError(confirmPasswordInput, confirmPasswordError, 'كلمتا المرور غير متطابقتين');
      isValid = false;
    }

    // Terms
    if (!agreeTermsInput.checked) {
      showAuthAlert('warning', 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية');
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    registerBtn.classList.add('loading');
    registerBtn.disabled = true;

    // محاكاة تسجيل مستخدم جديد
    setTimeout(() => {
      registerBtn.classList.remove('loading');
      registerBtn.disabled = false;

      // حفظ بيانات بسيطة في localStorage (مجرد مثال مؤقت)
      const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        referral: referralInput.value.trim() || null,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('cicada_user', JSON.stringify(userData));
      localStorage.setItem('cicada_isAuthenticated', 'true');

      showAuthAlert('success', 'تم إنشاء الحساب بنجاح! جاري تحويلك للوحة التحكم...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    }, 1500);
  });
}

// ===== Global Auth Helpers =====
function isAuthenticated() {
  return localStorage.getItem('cicada_isAuthenticated') === 'true';
}

function logoutUser(redirectToLogin = true) {
  localStorage.removeItem('cicada_isAuthenticated');
  localStorage.removeItem('cicada_user');
  localStorage.removeItem('cicada_userEmail');

  if (redirectToLogin) {
    window.location.href = 'login.html';
  }
}

// حماية صفحات لوحة التحكم (يتم استدعاؤها من dashboard.js أو من داخل كل صفحة Dashboard)
function protectPage() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLoginForm();
  initRegisterForm();

  // زر تسجيل الخروج إن وجد
  const logoutBtns = document.querySelectorAll('[data-logout="true"]');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser(true);
    });
  });
});

// إتاحة بعض الدوال للاستخدام من ملفات أخرى
window.CicadaAuth = {
  isAuthenticated,
  logoutUser,
  protectPage,
  showAuthAlert,
};
