import { auth, db, doc, getDoc } from './firebase-config.js';

auth.onAuthStateChanged(async (user) => {
    if (user) {
        // 1. جلب الرصيد
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const balance = userDoc.data().balance || 0;
            document.getElementById('walletBalance').textContent = `$${balance.toFixed(2)}`;
        }

        // 2. هنا سنضيف كود جلب المعاملات (Transactions) لاحقاً
        // حالياً سنعرض رسالة فارغة
        const list = document.getElementById('transactionsList');
        list.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">لا توجد معاملات لعرضها حالياً</div>';
    }
});
