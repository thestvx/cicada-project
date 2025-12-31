import { auth, db, doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from './firebase-config.js';

document.querySelectorAll('.invest-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const planName = e.target.dataset.plan;
        const price = parseFloat(e.target.dataset.price);
        const user = auth.currentUser;

        if (!user) return;

        // تأكيد من المستخدم
        if(!confirm(`هل أنت متأكد من استثمار $${price} في ${planName}؟`)) return;

        e.target.disabled = true;
        e.target.innerHTML = 'جاري المعالجة...';

        try {
            // 1. التحقق من الرصيد
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const currentBalance = userSnap.data().balance || 0;

            if (currentBalance < price) {
                alert('عذراً، رصيدك غير كافٍ لهذه الخطة!');
                e.target.disabled = false;
                e.target.innerHTML = `استثمار الآن ($${price})`;
                return;
            }

            // 2. خصم الرصيد
            await updateDoc(userRef, {
                balance: currentBalance - price,
                invested: (userSnap.data().invested || 0) + price
            });

            // 3. تسجيل الاستثمار
            await addDoc(collection(db, "investments"), {
                userId: user.uid,
                plan: planName,
                amount: price,
                startDate: serverTimestamp(),
                status: 'active'
            });

            alert('تم الاستثمار بنجاح! 🎉');
            window.location.href = 'dashboard.html'; // العودة للرئيسية

        } catch (error) {
            console.error(error);
            alert('حدث خطأ، حاول مرة أخرى.');
            e.target.disabled = false;
        }
    });
});
