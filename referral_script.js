// --- پچھلا لاگ ان اور ری سیٹ والا کوڈ یہاں موجود ہے ---
// ...

// --- نیا کوڈ: ریفرل پیج کے لیے ---
const referralPage = document.getElementById('referral-code-form');

if (referralPage) {
    // 1. صارف کا منفرد ریفرل کوڈ اور لنک بنانا
    const userReferralLinkSpan = document.getElementById('user-referral-link');
    const userReferralCode = 'Abc12Xyz'; // یہ سرور سے آنا چاہیے، ابھی فرضی ہے
    const userReferralLink = `https://app.kahanisunao.com/ref/${userReferralCode}`;
    userReferralLinkSpan.textContent = userReferralLink;

    // 2. دوست کا کوڈ جمع کرانے والا فارم
    const referralForm = document.getElementById('referral-code-form');
    const referralMessage = document.getElementById('referral-message');
    referralForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const friendCode = document.getElementById('friend-code').value;
        if (friendCode.trim() !== '') {
            referralMessage.textContent = 'کامیابی! آپ کو 50 پوائنٹس مل گئے ہیں۔';
            referralMessage.style.color = '#27ae60';
            document.getElementById('friend-code').value = '';
        } else {
            referralMessage.textContent = 'براہ کرم کوڈ درج کریں۔';
            referralMessage.style.color = '#e74c3c';
        }
    });

    // 3. لنک کاپی کرنے والا بٹن
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copy-message');
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(userReferralLink).then(function() {
            copyMessage.textContent = 'لنک کاپی ہو گیا!';
            setTimeout(() => { copyMessage.textContent = ''; }, 2000);
        });
    });

    // 4. سوشل میڈیا شیئر بٹن
    const shareText = encodeURIComponent(`کہانی سناؤ ایپ میں شامل ہوں اور زبردست کہانیاں سنیں۔ میرے ریفرل کوڈ ${userReferralCode} کا استعمال کریں یا اس لنک پر کلک کریں: ${userReferralLink}`);
    
    document.getElementById('whatsapp-share').href = `https://api.whatsapp.com/send?text=${shareText}`;
    document.getElementById('facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(userReferralLink)}`;
    document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=${shareText}`;
}