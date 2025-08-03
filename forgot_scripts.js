// لاگ ان فارم کا کوڈ
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        if (username === 'user' && password === '1234') {
            errorMessage.textContent = '';
            alert('کامیابی سے لاگ ان ہو گیا!');
            window.location.href = 'home.html';
        } else {
            errorMessage.textContent = 'غلط یوزر نیم یا پاس ورڈ';
        }
    });
}

// --- نیا کوڈ: پاس ورڈ ری سیٹ فارم کے لیے ---
const resetForm = document.getElementById('reset-form');
if (resetForm) {
    resetForm.addEventListener('submit', function(event) {
        event.preventDefault(); // فارم کو سبمٹ ہونے سے روکیں

        const emailInput = document.getElementById('reset-email');
        const resetMessage = document.getElementById('reset-message');

        // ان پٹ کی جانچ
        if (emailInput.value.trim() === '') {
            resetMessage.textContent = 'براہ کرم اپنا یوزر نیم یا ای میل درج کریں۔';
            resetMessage.style.color = '#e74c3c'; // ایرر کے لیے لال رنگ
        } else {
            // کامیابی کا فرضی پیغام دکھائیں
            resetMessage.textContent = 'اگر یہ اکاؤنٹ موجود ہے تو پاس ورڈ ری سیٹ کی ہدایات بھیج دی گئی ہیں۔';
            resetMessage.style.color = '#27ae60'; // کامیابی کے لیے ہرا رنگ
            
            // 3 سیکنڈ کے بعد صارف کو لاگ ان پیج پر واپس بھیج دیں
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 3000);
        }
    });
}