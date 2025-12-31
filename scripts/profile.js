/**
 * Profile Page Logic - Final Fix
 * يعتمد على IDs دقيقة لتجنب البيانات الوهمية
 */

import { auth, db, doc, getDoc, updateDoc } from './firebase-config.js';

// ==========================================
// 1. تعريف الدوال العامة (للمودال)
// ==========================================
const modal = document.getElementById('editProfileModal');

window.editProfile = function() {
    if (modal) modal.style.display = 'flex';
};

window.closeEditModal = function() {
    if (modal) modal.style.display = 'none';
};

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// ==========================================
// 2. تحميل وعرض البيانات
// ==========================================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            // جلب البيانات من Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                
                // --- تعبئة واجهة العرض (View Mode) ---
                
                // 1. الاسم واليوزر
                setText('profileFullname', data.fullname || 'مستخدم');
                setText('profileUsername', data.username || '@' + data.email.split('@')[0]);
                
                // 2. البايو
                setText('profileBio', data.bio || 'لا توجد نبذة تعريفية بعد.');
                
                // 3. المعلومات الشخصية
                setText('infoEmail', data.email); // الإيميل لا يتغير
                setText('infoPhone', data.phone || 'غير محدد');
                setText('infoLocation', data.location || 'غير محدد');
                setText('infoUserId', '#' + user.uid.slice(0, 8).toUpperCase());
                
                // 4. التاريخ
                if (data.createdAt) {
                    const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    setText('infoJoinDate', date.toLocaleDateString('ar-EG'));
                }
                
                // 5. الصورة
                const avatarImg = document.getElementById('avatarImg');
                const topbarAvatar = document.querySelector('.user-avatar'); // في التوب بار
                const avatarUrl = data.photoURL || `https://ui-avatars.com/api/?name=${data.fullname || 'U'}&background=F0B90B&color=fff`;
                
                if (avatarImg) avatarImg.src = avatarUrl;
                if (topbarAvatar) topbarAvatar.src = avatarUrl;

                // 6. الإحصائيات (اختياري)
                setText('statReferrals', data.referralsCount || '0');
                setText('statEarnings', `$${(data.totalEarnings || 0).toFixed(2)}`);


                // --- تعبئة واجهة التعديل (Edit Modal) ---
                setValue('editFullname', data.fullname || '');
                setValue('editUsername', (data.username || '').replace('@', ''));
                setValue('editBio', data.bio || '');
                setValue('editPhone', data.phone || '');
                setValue('editLocation', data.location || '');
            }
        } catch (error) {
            console.error("Profile Load Error:", error);
        }
    }
});

// دالة مساعدة لتحديث النصوص بأمان
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// دالة مساعدة لتحديث الحقول بأمان
function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}


// ==========================================
// 3. حفظ التعديلات
// ==========================================
const editForm = document.getElementById('editProfileForm');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) return;

        const saveBtn = editForm.querySelector('button[type="submit"]');
        const originalText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

        try {
            // جلب القيم من الحقول باستخدام IDs الجديدة
            const newFullname = document.getElementById('editFullname').value;
            const newUsername = document.getElementById('editUsername').value;
            const newBio = document.getElementById('editBio').value;
            const newPhone = document.getElementById('editPhone').value;
            const newLocation = document.getElementById('editLocation').value;

            await updateDoc(doc(db, "users", user.uid), {
                fullname: newFullname,
                username: '@' + newUsername.replace('@', ''), // ضمان وجود @
                bio: newBio,
                phone: newPhone,
                location: newLocation
            });

            window.location.reload(); // تحديث لرؤية النتيجة
            
        } catch (error) {
            console.error("Save Error:", error);
            alert("فشل الحفظ: " + error.message);
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    });
}
