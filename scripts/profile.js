/**
 * Profile Page Logic - Connected to Firebase
 */

import { auth, db, doc, getDoc, updateDoc } from './firebase-config.js';

// عناصر الصفحة التي سنغير محتواها
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

// تحميل البيانات عند فتح الصفحة
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log("📥 Loading profile for:", user.email);
        
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                
                // 1. تحديث النصوص في الصفحة
                if (elements.fullname) elements.fullname.textContent = data.fullname || 'مستخدم جديد';
                if (elements.email) elements.email.textContent = data.email;
                if (elements.phone) elements.phone.textContent = data.phone || 'غير محدد';
                if (elements.bio) elements.bio.textContent = data.bio || 'مستثمر جديد في Cicada';
                if (elements.location) elements.location.textContent = data.location || 'غير محدد';
                
                // اسم المستخدم (نصنعه من الإيميل إذا لم يكن موجوداً)
                const username = data.username || '@' + data.email.split('@')[0];
                if (elements.username) elements.username.textContent = username;

                // تاريخ الانضمام
                if (data.createdAt && elements.joinDate) {
                    const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                    elements.joinDate.textContent = date.toLocaleDateString('ar-EG');
                }

                // معرف المستخدم (User ID)
                if (elements.userId) elements.userId.textContent = '#' + user.uid.slice(0, 8).toUpperCase();

                // الصورة الرمزية
                const avatarUrl = data.photoURL || `https://ui-avatars.com/api/?name=${data.fullname || 'User'}&background=F0B90B&color=fff`;
                if (elements.avatar) elements.avatar.src = avatarUrl;
                if (elements.topbarAvatar) elements.topbarAvatar.src = avatarUrl;
                if (elements.topbarName) elements.topbarName.textContent = data.fullname || 'مستخدم';

                // 2. تحديث قيم الـ Modal (نافذة التعديل) لتكون جاهزة
                document.querySelector('#editProfileForm input[value="أحمد محمد علي"]')?.setAttribute('value', data.fullname || '');
                document.querySelector('#editProfileForm input[value="+966 55 1234 567"]')?.setAttribute('value', data.phone || '');
                document.querySelector('#editProfileForm textarea')?.setAttribute('placeholder', data.bio || '');
                document.querySelector('#editProfileForm textarea').value = data.bio || '';
                
            } else {
                console.log("⚠️ No user document found!");
            }
        } catch (error) {
            console.error("❌ Error fetching profile:", error);
        }
    } else {
        // إذا لم يكن مسجلاً، ارجعه لصفحة الدخول
        window.location.href = 'login.html';
    }
});

// ==========================================
// منطق تعديل الملف الشخصي (Modal Logic)
// ==========================================

const modal = document.getElementById('editProfileModal');
const editForm = document.getElementById('editProfileForm');

// فتح النافذة
window.editProfile = () => {
    if (modal) modal.style.display = 'flex';
};

// إغلاق النافذة
window.closeEditModal = () => {
    if (modal) modal.style.display = 'none';
};

// حفظ التغييرات عند ضغط زر "حفظ"
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) return;

        // جمع البيانات الجديدة من الحقول
        // ملاحظة: ستحتاج لتعديل الـ HTML قليلاً لإضافة IDs للحقول، 
        // لكن سأستخدم الـ querySelector العام كحل سريع الآن
        const inputs = editForm.querySelectorAll('input, textarea');
        const newFullname = inputs[0].value; // أول حقل (الاسم)
        const newUsername = inputs[1].value; // ثاني حقل (اسم المستخدم)
        const newBio = inputs[2].value;      // ثالث حقل (النبذة)
        const newPhone = inputs[3].value;    // رابع حقل (الهاتف)
        const newLocation = inputs[4].value; // خامس حقل (الموقع)

        const saveBtn = editForm.querySelector('button[type="submit"]');
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

        try {
            // تحديث في Firestore
            await updateDoc(doc(db, "users", user.uid), {
                fullname: newFullname,
                username: newUsername,
                bio: newBio,
                phone: newPhone,
                location: newLocation
            });

            // تحديث الصفحة فوراً (Reload) لرؤية التغييرات
            window.location.reload();
            
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("حدث خطأ أثناء الحفظ");
            saveBtn.innerHTML = 'حفظ التغييرات';
        }
    });
}
