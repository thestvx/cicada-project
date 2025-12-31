/**
 * Investments Page JavaScript
 */

let currentPlan = null;

// Open Investment Modal
function openInvestModal(planType, dailyReturn, minAmount, maxAmount) {
    currentPlan = {
        type: planType,
        dailyReturn: dailyReturn,
        minAmount: minAmount,
        maxAmount: maxAmount
    };
    
    const modal = document.getElementById('investModal');
    const planInfoBox = document.getElementById('planInfoBox');
    const amountHint = document.getElementById('amountHint');
    
    // Plan names
    const planNames = {
        'basic': 'الخطة الأساسية',
        'pro': 'الخطة الاحترافية',
        'vip': 'خطة المؤسسات'
    };
    
    planInfoBox.innerHTML = `
        <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">${planNames[planType]}</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">عائد يومي ${dailyReturn}%</p>
        <div style="display: flex; justify-content: center; gap: 2rem;">
            <div>
                <p style="color: var(--text-muted); font-size: 0.85rem;">الحد الأدنى</p>
                <p style="color: var(--primary); font-weight: 700; font-family: var(--font-mono);">$${minAmount.toLocaleString()}</p>
            </div>
            <div>
                <p style="color: var(--text-muted); font-size: 0.85rem;">الحد الأقصى</p>
                <p style="color: var(--primary); font-weight: 700; font-family: var(--font-mono);">$${maxAmount.toLocaleString()}</p>
            </div>
        </div>
    `;
    
    amountHint.textContent = `المبلغ يجب أن يكون بين $${minAmount} و $${maxAmount}`;
    
    modal.style.display = 'flex';
    
    // Calculate on amount change
    document.getElementById('investAmount').addEventListener('input', calculateReturns);
}

// Close Investment Modal
function closeInvestModal() {
    document.getElementById('investModal').style.display = 'none';
    document.getElementById('investForm').reset();
    document.getElementById('calculationBox').innerHTML = '';
}

// Calculate Returns
function calculateReturns() {
    const amount = parseFloat(document.getElementById('investAmount').value);
    const calculationBox = document.getElementById('calculationBox');
    
    if (!amount || amount < currentPlan.minAmount || amount > currentPlan.maxAmount) {
        calculationBox.innerHTML = '';
        return;
    }
    
    const dailyProfit = amount * (currentPlan.dailyReturn / 100);
    const totalProfit = dailyProfit * 30;
    const totalReturn = amount + totalProfit;
    
    calculationBox.innerHTML = `
        <h4 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem;">التوقعات المالية</h4>
        <div style="display: grid; gap: 1rem;">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">الربح اليومي</span>
                <span style="color: var(--success); font-weight: 700; font-family: var(--font-mono);">$${dailyProfit.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">إجمالي الأرباح (30 يوم)</span>
                <span style="color: var(--success); font-weight: 700; font-family: var(--font-mono);">$${totalProfit.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <span style="color: var(--text-primary); font-weight: 600;">إجمالي العائد</span>
                <span style="color: var(--primary); font-weight: 700; font-size: 1.2rem; font-family: var(--font-mono);">$${totalReturn.toFixed(2)}</span>
            </div>
        </div>
    `;
}

// Submit Investment
document.getElementById('investForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('investAmount').value);
    
    if (amount < currentPlan.minAmount || amount > currentPlan.maxAmount) {
        alert(`المبلغ يجب أن يكون بين $${currentPlan.minAmount} و $${currentPlan.maxAmount}`);
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert('تم تفعيل الاستثمار بنجاح! 🎉');
        closeInvestModal();
        location.reload();
    }, 2000);
});

// View Investment Details
function viewInvestmentDetails(id) {
    alert(`عرض تفاصيل الاستثمار رقم ${id}`);
}

// Mobile Menu
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});
