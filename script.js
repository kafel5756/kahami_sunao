// --- ہوم پیج پر موڈل کو کنٹرول کرنے کا اسکرپٹ ---
const mainRecordBtn = document.querySelector('.record-btn');
const recordModal = document.getElementById('recordModal');
const closeModalBtn = document.getElementById('closeModalBtn');

if (mainRecordBtn) {
    mainRecordBtn.addEventListener('click', () => {
        // پہلے چیک کریں کہ مائیک کی اجازت ہے یا نہیں
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                // اگر اجازت مل گئی تو موڈل دکھائیں
                recordModal.classList.add('active');
                stream.getTracks().forEach(track => track.stop()); // اجازت لے کر فوراً مائیک بند کر دیں
            })
            .catch(err => {
                // اگر اجازت نہیں ملی تو صارف کو بتائیں
                alert('ریکارڈنگ کے لیے مائیک کی اجازت درکار ہے۔ براہ کرم اپنے براؤزر کی سیٹنگز میں اجازت دیں۔');
                console.error("Mic permission denied:", err);
            });
    });
}

if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        recordModal.classList.remove('active');
        // یہاں موڈل ری سیٹ کرنے کا فنکشن بھی کال کر سکتے ہیں
        if(typeof resetRecordingModal === 'function') {
            resetRecordingModal(); 
        }
    });
}

// موڈل کے باہر کلک کرنے پر اسے بند کرنا
if(recordModal) {
    recordModal.addEventListener('click', (e) => {
        if(e.target === recordModal) {
            recordModal.classList.remove('active');
            if(typeof resetRecordingModal === 'function') {
                resetRecordingModal();
            }
        }
    });
}
// --- ہوم پیج پر موڈل کو کنٹرول کرنے کا اسکرپٹ ---
const mainRecordBtn = document.querySelector('.record-btn');
const recordModal = document.getElementById('recordModal');
const closeModalBtn = document.getElementById('closeModalBtn');

if (mainRecordBtn) {
    mainRecordBtn.addEventListener('click', () => {
        recordModal.classList.add('active');
    });
}

if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        recordModal.classList.remove('active');
        // یہاں موڈل ری سیٹ کرنے کا فنکشن بھی کال کر سکتے ہیں
        resetRecordingModal(); 
    });
}
// موڈل کے باہر کلک کرنے پر اسے بند کرنا
if(recordModal) {
    recordModal.addEventListener('click', (e) => {
        if(e.target === recordModal) {
            recordModal.classList.remove('active');
            resetRecordingModal();
        }
    });
}
// ========================================
// موڈل کے اندر آڈیو ریکارڈنگ کا نیا اسکرپٹ (Firebase کے ساتھ)
// ========================================

if (document.getElementById('recordModal')) {
    // ... (آپ کے پرانے DOM Elements اور State Variables یہاں رہیں گے) ...
    // ... (micBtn, timerDisplay, mediaRecorder وغیرہ) ...

    // باقی تمام فنکشنز (startTimer, formatTime, UI updates) ویسے ہی رہیں گے

    // صرف Upload Button کے کلک کو تبدیل کرنا ہے
    const uploadBtn = document.getElementById('modalUploadBtn');
    
    uploadBtn.onclick = () => {
        const title = document.getElementById('modalStoryTitle').value;
        const category = document.getElementById('modalStoryCategory').value;

        if (!title || !category) {
            alert('براہ کرم کہانی کا عنوان اور کیٹیگری منتخب کریں۔');
            return;
        }

        if (audioChunks.length === 0) {
            alert('کوئی آڈیو ریکارڈ نہیں ہوئی۔');
            return;
        }

        // 1. UI کو اپ ڈیٹ کریں تاکہ صارف کو پتہ چلے کہ اپ لوڈنگ ہو رہی ہے
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'اپ لوڈ ہو رہا ہے...';

        // 2. آڈیو Blob بنانا
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        
        // 3. فائل کا منفرد نام بنانا
        const storyId = `story_${Date.now()}`;
        const filePath = `audio_stories/${storyId}.mp3`;

        // 4. فائل کو Firebase Storage پر اپ لوڈ کرنا
        const storageRef = storage.ref(filePath);
        const uploadTask = storageRef.put(audioBlob);

        uploadTask.on('state_changed', 
            (snapshot) => {
                // یہاں آپ پروگریس دکھا سکتے ہیں، فی الحال خالی چھوڑ دیں
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                // 5. اگر کوئی خرابی ہو
                console.error("Upload failed:", error);
                alert("اپ لوڈ ناکام ہوگئی۔ براہ کرم دوبارہ کوشش کریں۔");
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'کہانی اپ لوڈ کریں';
            }, 
            () => {
                // 6. جب اپ لوڈ کامیاب ہو جائے
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);

                    // 7. اب کہانی کی تفصیلات Firestore میں محفوظ کریں
                    const storyData = {
                        id: storyId,
                        title: title,
                        category: category,
                        audioUrl: downloadURL,
                        author: "currentUser", // بعد میں ہم اسے اصلی صارف سے بدلیں گے
                        points: 0,
                        likes: 0,
                        commentsCount: 0,
                        listenCount: 0,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp() // موجودہ وقت
                    };

                    db.collection("stories").doc(storyId).set(storyData)
                        .then(() => {
                            // 8. سب کچھ کامیاب!
                            alert("کامیابی! آپ کی کہانی اپ لوڈ ہو گئی ہے۔");
                            recordModal.classList.remove('active');
                            resetRecordingModal(); // موڈل کو ری سیٹ کریں
                            uploadBtn.disabled = false;
                            uploadBtn.textContent = 'کہانی اپ لوڈ کریں';
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                            alert("ڈیٹا بیس میں خرابی ہوئی۔");
                            uploadBtn.disabled = false;
                            uploadBtn.textContent = 'کہانی اپ لوڈ کریں';
                        });
                });
            }
        );
    };
    
    // ... (باقی تمام پرانے فنکشنز جیسے resetRecordingModal یہاں موجود رہیں گے)
}
// Add interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Reward boxes functionality
    document.querySelectorAll('.reward-box').forEach(box => {
        box.addEventListener('click', function() {
            this.style.background = 'rgba(255,255,255,0.5)';
            this.innerHTML = '<i class="fas fa-check"></i><div>Claimed!</div>';
            setTimeout(() => {
                this.style.background = 'rgba(255,255,255,0.2)';
            }, 1000);
        });
    });

    // Play button functionality
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                this.style.background = '#e74c3c';
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                this.style.background = '#9b59b6';
            }
        });
    });

    // Record button functionality
    
    // Category click functionality
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 100);
        });
    });
});
// === لاگ ان فارم کا اپڈیٹ شدہ کوڈ ===
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'user' && password === '1234') {
            // --- نیا کوڈ: صارف کا ڈیٹا لوکل اسٹوریج میں محفوظ کریں ---
            const currentUser = {
                name: 'محمد احمد',
                username: '@ahmad_storyteller',
                avatar: 'https://i.pravatar.cc/150?u=ahmad', // ایک فرضی تصویر کا لنک
                referrals: 12
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // --- نیا کوڈ ختم ---
            
            window.location.href = 'home.html';
        } else {
            // ... ایرر پیغام ...
        }
    });
}

// === لاگ آؤٹ بٹن کا اپڈیٹ شدہ کوڈ ===
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        const confirmLogout = confirm("کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟");
        if (confirmLogout) {
            // --- نیا کوڈ: لوکل اسٹوریج سے ڈیٹا ہٹائیں ---
            localStorage.removeItem('currentUser');
            // --- نیا کوڈ ختم ---
            alert("کامیابی سے لاگ آؤٹ ہو گیا۔");
            window.location.href = 'index.html';
        }
    });
}


// === نیا کوڈ: جب بھی کوئی صفحہ کھلے تو صارف کا ڈیٹا دکھائیں ===
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // اگر صارف لاگ ان نہیں ہے اور محفوظ صفحہ کھولنے کی کوشش کر رہا ہے تو اسے واپس بھیج دیں
    const protectedPages = ['home.html', 'profile.html', 'referral.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (!user && protectedPages.includes(currentPage)) {
        window.location.href = 'signin.html';
        return; // آگے کا کوڈ نہ چلائیں
    }

    if (user) {
        // ہوم پیج پر ڈیٹا دکھائیں
        const homeAvatar = document.getElementById('home-avatar');
        const homeUsername = document.getElementById('home-username');
        if (homeAvatar && homeUsername) {
            homeAvatar.src = user.avatar;
            homeUsername.textContent = user.name;
        }

        // پروفائل پیج پر ڈیٹا دکھائیں
        const profileAvatar = document.getElementById('profile-avatar');
        const profileName = document.getElementById('profile-name');
        const profileUsername = document.getElementById('profile-username');
        const profileReferralCount = document.getElementById('profile-referral-count');
        if (profileAvatar) {
            profileAvatar.src = user.avatar;
            profileName.textContent = user.name;
            profileUsername.textContent = user.username;
            profileReferralCount.textContent = user.referrals;
        }
    }
});
sendBtn.addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (commentText !== "") {
        // نیا کمنٹ کا ایلیمنٹ بنائیں
        const newComment = document.createElement('div');
        newComment.classList.add('comment-item');
        newComment.innerHTML = `
            <img src="https://i.pravatar.cc/100?u=c" alt="avatar">
            <div class="comment-content">
                <strong>صارف</strong>
                <p>${commentText}</p>
            </div>
        `;
        // لسٹ میں شامل کریں
        commentsList.prepend(newComment);
        
        // ان پٹ کو خالی کریں
        commentInput.value = '';
    }
});



// ========================================
// آڈیو ریکارڈنگ پیج کا اسکرپٹ
// ========================================


    // 2. Pause/Resume Button
    pauseResumeBtn.onclick = () => {
        if (!isPaused) {
            mediaRecorder.pause();
            clearInterval(timerInterval);
            updateUIForPaused();
            isPaused = true;
        } else {
            mediaRecorder.resume();
            startTimer();
            updateUIForRecording(); // back to recording state
            isPaused = false;
        }
    };

    // 3. Stop Button
    stopBtn.onclick = () => {
        mediaRecorder.stop();
        clearInterval(timerInterval);
        isRecording = false;
        isPaused = false;
        updateUIForStopped();
    };

    // 4. Timer Functions
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    }
    
    function formatTime(sec) {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // 5. UI Update Functions
    function updateUIForRecording() {
        recorderUI.classList.add('recording');
        recorderUI.classList.remove('paused');
        micBtn.style.display = 'none'; // Hide main mic button
        controlsContainer.style.display = 'flex';
        recordStatus.textContent = 'ریکارڈنگ جاری ہے...';
        pauseResumeBtn.innerHTML = '<i class="fas fa-pause"></i> توقف';
        tipsBox.style.display = 'block';
        detailsForm.style.display = 'none';
    }

    function updateUIForPaused() {
        recorderUI.classList.add('paused');
        recordStatus.textContent = 'ریکارڈنگ روک دی گئی ہے۔';
        pauseResumeBtn.innerHTML = '<i class="fas fa-play"></i> دوبارہ شروع';
    }

    function updateUIForStopped() {
        recorderUI.classList.remove('recording', 'paused');
        micBtn.style.display = 'block'; // Show main mic button again
        controlsContainer.style.display = 'none';
        recordStatus.textContent = 'ریکارڈنگ مکمل! اب تفصیلات درج کریں۔';
        seconds = 0; // Reset timer
        timerDisplay.textContent = '00:00';
        
        tipsBox.style.display = 'none';
        detailsForm.style.display = 'block';
    }
    
    // 6. Upload Button
    uploadBtn.onclick = () => {
        const title = document.getElementById('storyTitle').value;
        const category = document.getElementById('storyCategory').value;

        if (!title || !category) {
            alert('براہ کرم کہانی کا عنوان اور کیٹیگری منتخب کریں۔');
            return;
        }

        // --- یہاں آپ سرور پر ڈیٹا بھیجنے کا کوڈ لکھیں گے ---
        // For now, just show a success message
        alert('کامیابی!\nآپ کی کہانی کامیابی سے اپ لوڈ ہو گئی ہے۔');
        
        // Reset form for next time
        detailsForm.style.display = 'none';
        document.getElementById('storyTitle').value = '';
        document.getElementById('storyCategory').value = '';
        document.getElementById('storyDescription').value = '';
        recordStatus.textContent = 'ریکارڈنگ شروع کرنے کے لیے مائیک پر ٹیپ کریں';
        tipsBox.style.display = 'block';
    };
}


// ========================================
// موڈل کے اندر آڈیو ریکارڈنگ کا نیا اسکرپٹ
// ========================================

// پہلے چیک کریں کہ موڈل موجود ہے
if (document.getElementById('recordModal')) {

    // --- DOM Elements (Modal) ---
    const recorderUI = document.getElementById('modalRecorderUI');
    const micBtn = document.getElementById('modalMicBtn');
    const timerDisplay = document.getElementById('modalTimer');
    const recordStatus = document.getElementById('modalRecordStatus');
    const controlsContainer = document.getElementById('modalControls');
    const pauseResumeBtn = document.getElementById('modalPauseResumeBtn');
    const stopBtn = document.getElementById('modalStopBtn');
    const detailsForm = document.getElementById('modalDetailsForm');
    const audioPlayer = document.getElementById('modalAudioPlayer');
    const uploadBtn = document.getElementById('modalUploadBtn');

    // --- State Variables ---
    let mediaRecorder;
    let audioChunks = [];
    let timerInterval;
    let seconds = 0;
    let isRecording = false;
    let isPaused = false;
    let audioStream; 

    // 1. Mic Button Click Handler
    micBtn.onclick = async () => {
        if (!isRecording) {
            try {
                audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(audioStream);
                mediaRecorder.start();
                isRecording = true;
                updateUIForRecording();
                startTimer();

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayer.src = audioUrl;
                    updateUIForStopped();
                };

            } catch (error) {
                console.error("Error accessing microphone:", error);
                recordStatus.textContent = "مائیک تک رسائی ممکن نہیں ہوئی۔";
            }
        }
    };

    // 2. Pause/Resume Button
    pauseResumeBtn.onclick = () => {
        if (!isPaused) {
            mediaRecorder.pause();
            isPaused = true;
            clearInterval(timerInterval);
            updateUIForPaused();
        } else {
            mediaRecorder.resume();
            isPaused = false;
            startTimer();
            updateUIForRecording();
        }
    };

    // 3. Stop Button
    stopBtn.onclick = () => {
        if (isRecording) {
            mediaRecorder.stop();
            audioStream.getTracks().forEach(track => track.stop());
            isRecording = false;
            isPaused = false;
            clearInterval(timerInterval);
        }
    };
    
    // --- UI & Helper Functions ---
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    }
    
    function formatTime(sec) {
        const minutes = Math.floor(sec / 60);
        const seconds_rem = sec % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds_rem.toString().padStart(2, '0')}`;
    }
    
    function updateUIForRecording() {
        recorderUI.classList.add('recording');
        recorderUI.classList.remove('paused');
        micBtn.style.display = 'none';
        controlsContainer.style.display = 'flex';
        recordStatus.textContent = 'ریکارڈنگ جاری ہے...';
        pauseResumeBtn.innerHTML = '<i class="fas fa-pause"></i> توقف';
    }

    function updateUIForPaused() {
        recorderUI.classList.add('paused');
        recordStatus.textContent = 'ریکارڈنگ روک دی گئی ہے۔';
        pauseResumeBtn.innerHTML = '<i class="fas fa-play"></i> دوبارہ شروع';
    }

    function updateUIForStopped() {
        recorderUI.style.display = 'none';
        detailsForm.style.display = 'block';
    }
    
    function resetRecordingModal() {
        if (isRecording) {
            mediaRecorder.stop();
        }
        recorderUI.classList.remove('recording', 'paused');
        micBtn.style.display = 'block';
        controlsContainer.style.display = 'none';
        recorderUI.style.display = 'block';
        detailsForm.style.display = 'none';
        
        seconds = 0;
        clearInterval(timerInterval);
        timerDisplay.textContent = '00:00';
        recordStatus.textContent = 'ریکارڈنگ شروع کرنے کے لیے مائیک پر ٹیپ کریں';
        audioChunks = [];
        audioPlayer.removeAttribute('src');
    }
    
    // Upload Button Logic
    uploadBtn.onclick = () => {
        const title = document.getElementById('modalStoryTitle').value;
        const category = document.getElementById('modalStoryCategory').value;
        if (!title || !category) {
            alert('براہ کرم کہانی کا عنوان اور کیٹیگری منتخب کریں۔');
            return;
        }
        alert('کہانی کامیابی سے اپ لوڈ ہو گئی ہے!');
        recordModal.classList.remove('active');
        resetRecordingModal();
    };

    // Expose reset function globally so it can be called from other scripts
    window.resetRecordingModal = resetRecordingModal;
}