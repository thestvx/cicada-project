/**
 * Referral Page JavaScript
 */

// Copy Referral Link
function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    document.execCommand('copy');
    
    const btn = event.target.closest('.btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> تم النسخ!';
    btn.style.background = 'var(--success)';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

// Share to WhatsApp
function shareToWhatsApp() {
    const link = document.getElementById('referralLink').value;
    const text = `انضم إلى Cicada واحصل على أرباح يومية مضمونة!\n${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Share to Telegram
function shareToTelegram() {
    const link = document.getElementById('referralLink').value;
    const text = `انضم إلى Cicada واحصل على أرباح يومية مضمونة!`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Share to Twitter
function shareToTwitter() {
    const link = document.getElementById('referralLink').value;
    const text = `انضم إلى Cicada واحصل على أرباح يومية مضمونة!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
    window.open(url, '_blank');
}

// Share to Facebook
function shareToFacebook() {
    const link = document.getElementById('referralLink').value;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    window.open(url, '_blank');
}

// Share via Email
function shareViaEmail() {
    const link = document.getElementById('referralLink').value;
    const subject = 'انضم إلى Cicada';
    const body = `مرحباً،\n\nأدعوك للانضمام إلى Cicada - منصة الاستثمار الرائدة.\n\nاحصل على أرباح يومية مضمونة من استثماراتك.\n\nسجل الآن: ${link}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
}

// Mobile Menu
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});
