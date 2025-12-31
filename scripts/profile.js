/**
 * Profile Page Logic - Fixed Buttons
 */

import { auth, db, doc, getDoc, updateDoc } from './firebase-config.js';

// ==========================================
// 1. منطق المودال (النافذة المنبثقة) - التعديل المهم هنا
// ==========================================

const modal = document.getElementById('editProfileModal');

// جعل الدوال متاحة لـ HTML (Global Scope)
window.editProfile = function() {
    if (modal) modal.style.display = 'flex';
};

window.closeEditModal = function() {
    if (modal) modal.style.display = 'none';
};

// إغلاق النافذة عند النقر خارج الصندوق الأبيض
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// ==========================================
// 2. تحميل البيانات
// ==========================================

const elements = {
    fullname: document.querySelector('.profile-name-section h2'),
    username: document.querySelector('.profile-username'),
    bio: document.querySelector('.profile-bio'),
    email: document.querySelector('.info-item:nth-child(1) .info-value'),
    phone: document.querySelector('.info-item:nth-child(2) .info-value'),
    location: document.querySelector('.info-item:nth-child(3) .info-value'),
    joinDate: document.querySelector('.info-item:nth-child(4) .info-value'),
    userId: document.querySelector('.info-item:nth-child(5) .info-value'),
    avatar: document.querySelector('#avatarImg'),
    topbarAvatar: document.querySelector('.user-avatar'),
    topbarName: document.querySelector('.user-name')
};

auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                
                // تحديث الواجهة
                if (elements.fullname) elements.fullname.textContent = data.fullname || 'مستخدم';
                if (elements.email) elements.email.textContent = data.email;
                if (elements.phone) elements.phone.textContent = data.phone || 'غير محدد';
                if (elements.bio) elements.bio.textContent = data.bio || 'مستثمر في Cicada';
                if (elements.location) elements.location.textContent = data.location || 'غير محدد';
                
                const username = data.username || '@' + data.email.split('@')[0];
                if (elements.username) elements.username.textContent = username;

                if (data.createdAt && elements.joinDate) {
                    const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    elements.joinDate.textContent = date.toLocaleDateString('ar-EG');
                }

                if (elements.userId) elements.userId.textContent = '#' + user.uid.slice(0, 8).toUpperCase();

                const avatarUrl = data.photoURL || `https://ui-avatars.com/api/?name=${data.fullname || 'User'}&background=F0B90B&color=fff`;
                if (elements.avatar) elements.avatar.src = avatarUrl;
                if (elements.topbarAvatar) elements.topbarAvatar.src = avatarUrl;
                if (elements.topbarName) elements.topbarName.textContent = data.fullname || 'مستخدم';

                // ملء بيانات نموذج التعديل (Modal Inputs)
                const editForm = document.getElementById('editProfileForm');
                if (editForm) {
                    // نفترض ترتيب الحقول حسب الـ HTML الخاص بك
                    const inputs = editForm.querySelectorAll('input');
                    const textarea = editForm.querySelector('textarea');
                    
                    if(inputs[0]) inputs[0].value = data.fullname || ''; // الاسم
                    if(inputs[1]) inputs[1].value = username.replace('@', ''); // اليوزرنيم
                    if(textarea) textarea.value = data.bio || ''; // البايو
                    if(inputs[2]) inputs[2].value = data.phone || ''; // الهاتف
                    if(inputs[3]) inputs[3].value = data.location || ''; // الموقع
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }
});

// ==========================================
// 3. حفظ التعديلات
// ==========================================

const editForm = document.getElementById('editProfileForm');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) return;

        const inputs = editForm.querySelectorAll('input');
        const textarea = editForm.querySelector('textarea');
        const saveBtn = editForm.querySelector('button[type="submit"]');
        const originalBtnText = saveBtn.innerHTML;

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

        try {
            await updateDoc(doc(db, "users", user.uid), {
                fullname: inputs[0].value,
                username: '@' + inputs[1].value.replace('@', ''),
                bio: textarea.value,
                phone: inputs[2].value,
                location: inputs[3].value
            });

            // تحديث الصفحة لرؤية التغييرات
            window.location.reload();
            
        } catch (error) {
            console.error("Error updating:", error);
            alert("حدث خطأ أثناء الحفظ");
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalBtnText;
        }
    });
}
