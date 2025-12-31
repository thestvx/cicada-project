/**
 * Profile Page JavaScript
 */

// Edit Cover
function editCover() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            alert('تم اختيار صورة الغلاف. سيتم رفعها...');
        }
    };
    input.click();
}

// Edit Avatar
function editAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('avatarImg').src = event.target.result;
            };
            reader.readAsDataURL(file);
            alert('تم تحديث الصورة الشخصية');
        }
    };
    input.click();
}

// Edit Profile
function editProfile() {
    document.getElementById('editProfileModal').style.display = 'flex';
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

// Edit Personal Info
function editPersonalInfo() {
    editProfile();
}

// Enable 2FA
function enable2FA() {
    alert('سيتم فتح نافذة تفعيل المصادقة الثنائية');
}

// Change Password
function changePassword() {
    alert('سيتم فتح نافذة تغيير كلمة المرور');
}

// View Login History
function viewLoginHistory() {
    alert('سيتم عرض سجل الدخول');
}

// Manage Devices
function manageDevices() {
    alert('سيتم عرض الأجهزة المتصلة');
}

// Submit Edit Profile Form
document.getElementById('editProfileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('تم حفظ التغييرات بنجاح! ✅');
        closeEditModal();
        submitBtn.innerHTML = 'حفظ التغييرات';
        submitBtn.disabled = false;
    }, 1500);
});

// Mobile Menu
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Close modal on overlay click
document.getElementById('editProfileModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'editProfileModal') {
        closeEditModal();
    }
});
