// --- Withdraw Page Script ---

// یہ چیک کریں کہ آیا ہم Withdraw پیج پر ہیں تاکہ یہ کوڈ صرف اسی پیج پر چلے
if (document.getElementById('submitWithdrawBtn')) {

    const paymentMethods = document.querySelectorAll('.payment-method');
    const submitBtn = document.getElementById('submitWithdrawBtn');
    let selectedMethod = null;

    // پیمنٹ میتھڈ منتخب کرنے کا فنکشن
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // پہلے سے منتخب کو ہٹائیں
            paymentMethods.forEach(m => m.classList.remove('selected'));
            // نئے پر کلاس لگائیں
            method.classList.add('selected');
            selectedMethod = method.getAttribute('data-method');
            console.log('Selected Method:', selectedMethod);
        });
    });

    // فارم جمع کروانے کا فنکشن
    submitBtn.addEventListener('click', () => {
        const amount = document.getElementById('withdrawAmount').value;
        const accountNumber = document.getElementById('accountNumber').value;
        const accountName = document.getElementById('accountName').value;

        // سادہ سی ویلیڈیشن
        if (amount < 1000) {
            alert('کم سے کم 1000 روپے نکال سکتے ہیں۔');
            return;
        }
        if (!selectedMethod) {
            alert('براہ کرم پیمنٹ کا طریقہ منتخب کریں۔');
            return;
        }
        if (!accountNumber.trim() || !accountName.trim()) {
            alert('براہ کرم اکاؤنٹ کی مکمل تفصیلات درج کریں۔');
            return;
        }
        
        // کامیابی کا پیغام
        alert(`درخواست بھیج دی گئی ہے!\n\nرقم: ${amount} PKR\nطریقہ: ${selectedMethod}\nاکاؤنٹ نمبر: ${accountNumber}\n\nیہ رقم اگلے جمعرات کو بھیجی جائے گی۔`);
        
        // یہاں آپ فارم کو سرور پر بھیجنے کا کوڈ لکھ سکتے ہیں
        // مثال کے طور پر:
        // fetch('/api/withdraw', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ amount, method: selectedMethod, accountNumber, accountName })
        // })
        // .then(response => response.json())
        // .then(data => console.log(data));
    });
}