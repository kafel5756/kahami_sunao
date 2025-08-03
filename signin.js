// اس بات کو یقینی بناتا ہے کہ یہ کوڈ صرف لاگ ان پیج پر چلے
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        // فارم کو خودکار طور پر سبمٹ ہونے سے روکیں
        event.preventDefault();

        // ان پٹ فیلڈز سے ویلیوز حاصل کریں
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        // --- لاگ ان کی جانچ ---
        // ابھی کے لیے، ہم ایک فرضی یوزر نیم اور پاس ورڈ استعمال کر رہے ہیں۔
        // اصلی ایپ میں یہ ڈیٹا سرور سے چیک کیا جائے گا۔
        if (username === 'user' && password === '1234') {
            // اگر لاگ ان کامیاب ہو
            errorMessage.textContent = ''; // ایرر پیغام صاف کریں
            alert('کامیابی سے لاگ ان ہو گیا!'); // صارف کو پیغام دکھائیں
            window.location.href = 'home.html'; // ہوم پیج پر بھیج دیں
        } else {
            // اگر لاگ ان ناکام ہو
            errorMessage.textContent = 'غلط یوزر نیم یا پاس ورڈ';
        }
    });
}