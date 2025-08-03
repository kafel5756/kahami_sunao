// --- پچھلا سارا کوڈ یہاں موجود ہے ---
// ...

// --- نیا کوڈ: سرچ پیج کے ٹیبز کے لیے ---
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // سب سے پہلے، تمام بٹنوں اور مواد سے active/hidden کلاس ہٹائیں
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));

            // کلک کیے گئے بٹن پر active کلاس لگائیں
            button.classList.add('active');

            // متعلقہ مواد کو دکھائیں
            const targetContentId = button.getAttribute('data-target');
            const targetContent = document.getElementById(targetContentId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
}