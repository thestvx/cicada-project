import { auth, db, doc, getDoc, updateDoc } from './firebase-config.js';

let currentUserId   = null;
let currentUserData = {};

// تحميل بيانات المستخدم
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.replace('login.html');
        return;
    }

    currentUserId = user.uid;

    try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
            currentUserData = snap.data();
            console.log('🔹 Profile data loaded:', currentUserData);
            updateView(user, currentUserData);
            populateEditForm();
        } else {
            console.warn('No user document found for', user.uid);
        }
    } catch (err) {
        console.error('Profile load error:', err);
    }
});

// تحديث عناصر العرض
function updateView(user, data) {
    setText('profileFullname', data.fullname || 'مستخدم');
    setText('profileUsername', data.username || '@' + (data.email || user.email).split('@')[0]);
    setText('profileBio', data.bio || 'لا توجد نبذة حتى الآن');
    setText('infoEmail', data.email || user.email);
    setText('infoPhone', data.phone || 'غير محدد');
    setText('infoLocation', data.location || 'غير محدد');

    if (data.createdAt) {
        const d = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        setText('infoJoinDate', d.toLocaleDateString('ar-EG'));
    }

    const avatarUrl = data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullname || 'User')}&background=F0B90B&color=fff`;
    setImage('avatarImg', avatarUrl);
    setImage('topbarAvatar', avatarUrl);
    setText('topbarName', data.fullname || 'مستخدم');
}

// تعبئة نموذج التعديل
function populateEditForm() {
    const d = currentUserData || {};
    setValue('editFullname', d.fullname || '');
    setValue('editUsername', (d.username || '').replace('@', ''));
    setValue('editBio', d.bio || '');
    setValue('editPhone', d.phone || '');
    setValue('editLocation', d.location || '');
}

// حفظ التعديلات
const editForm = document.getElementById('editProfileForm');
const saveBtn  = document.getElementById('saveProfileBtn');

if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUserId) return;

        const newData = {
            fullname: getValue('editFullname'),
            username: '@' + getValue('editUsername').replace('@', ''),
            bio:      getValue('editBio'),
            phone:    getValue('editPhone'),
            location: getValue('editLocation')
        };

        const originalText = saveBtn ? saveBtn.innerHTML : '';
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        }

        try {
            await updateDoc(doc(db, 'users', currentUserId), newData);
            console.log('✅ profile updated:', newData);
            window.location.reload();
        } catch (err) {
            console.error('Save error:', err);
            alert('حدث خطأ أثناء الحفظ: ' + err.message);
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalText;
            }
        }
    });
}

// دوال مساعدة
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}
function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}
function setImage(id, src) {
    const el = document.getElementById(id);
    if (el && src) el.src = src;
}
