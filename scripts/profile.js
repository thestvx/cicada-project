import { auth, db, doc, getDoc, updateDoc } from './firebase-config.js';

// 1. التحكم في النافذة المنبثقة (Modal)
const modal = document.getElementById('editProfileModal');

window.editProfile = function() {
    if (modal) {
        modal.style.display = 'flex';
        // تعبئة الحقول بالبيانات الحالية
        populateEditForm();
    }
};

window.closeEditModal = function() {
    if (modal) modal.style.display = 'none';
};

// إغلاق عند النقر خارج النافذة
window.onclick = function(e) {
    if (e.target === modal) window.closeEditModal();
};

// متغير لتخزين البيانات الحالية
let currentUserData = {};

// 2. تحميل وعرض البيانات
auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                currentUserData = userDoc.data();
                
                // تحديث واجهة العرض (View)
                updateView(user, currentUserData);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    } else {
        window.location.replace('login.html');
    }
});

function updateView(user, data) {
    setText('profileFullname', data.fullname);
    setText('profileUsername', data.username || '@' + data.email.split('@')[0]);
    setText('profileBio', data.bio || 'لا توجد نبذة');
    setText('infoEmail', data.email);
    setText('infoPhone', data.phone || 'غير محدد');
    setText('infoLocation', data.location || 'غير محدد');
    
    // التاريخ
    if (data.createdAt) {
        const date = new Date(data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt);
        setText('infoJoinDate', date.toLocaleDateString('ar-EG'));
    }

    // الصور
    const avatarUrl = data.photoURL || `https://ui-avatars.com/api/?name=${data.fullname || 'User'}&background=F0B90B&color=fff`;
    setImage('avatarImg', avatarUrl);
    setImage('topbarAvatar', avatarUrl);
    setText('topbarName', data.fullname || 'مستخدم');
}

// دالة لتعبئة فورم التعديل بالبيانات الموجودة
function populateEditForm() {
    const data = currentUserData;
    setValue('editFullname', data.fullname);
    setValue('editUsername', (data.username || '').replace('@', '')); // إزالة @
    setValue('editBio', data.bio);
    setValue('editPhone', data.phone);
    setValue('editLocation', data.location);
}

// 3. معالجة الحفظ (Save Logic)
const editForm = document.getElementById('editProfileForm');

if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) return;

        const saveBtn = editForm.querySelector('button[type="submit"]');
        const originalText = saveBtn.innerHTML;
        
        // تفعيل وضع التحميل
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

        try {
            // تجهيز البيانات الجديدة
            const newData = {
                fullname: document.getElementById('editFullname').value,
                username: '@' + document.getElementById('editUsername').value.replace('@', ''), // إضافة @
                bio: document.getElementById('editBio').value,
                phone: document.getElementById('editPhone').value,
                location: document.getElementById('editLocation').value
            };

            // الحفظ في قاعدة البيانات
            await updateDoc(doc(db, "users", user.uid), newData);
            
            console.log("✅ Profile updated!");
            
            // تحديث الصفحة لرؤية النتائج
            window.location.reload();

        } catch (error) {
            console.error("Save Error:", error);
            alert("حدث خطأ أثناء الحفظ: " + error.message);
            
            // إعادة الزر لوضعه الطبيعي
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    });
}

// دوال مساعدة
function setText(id, text) {
    const el = document.getElementById(id);
    if(el) el.textContent = text || '...';
}
function setValue(id, value) {
    const el = document.getElementById(id);
    if(el) el.value = value || '';
}
function setImage(id, src) {
    const el = document.getElementById(id);
    if(el) el.src = src;
}
