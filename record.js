// ========================================
// موڈل کے اندر آڈیو ریکارڈنگ کا نیا اور بہتر اسکرپٹ
// ========================================

// پہلے چیک کریں کہ موڈل موجود ہے
if (document.getElementById('recordModal')) {

    // --- DOM Elements (Modal) ---
    const recordModal = document.getElementById('recordModal');
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
        console.log("مائیک بٹن کلک ہوا!"); // Debugging کے لیے

        if (isRecording) {
            console.log("پہلے سے ریکارڈنگ جاری ہے۔");
            return;
        }

        try {
            console.log("مائیک پرمیشن مانگی جا رہی ہے...");
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("پرمیشن مل گئی، ریکارڈنگ شروع ہو رہی ہے...");

            isRecording = true;
            mediaRecorder = new MediaRecorder(audioStream);
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayer.src = audioUrl;
                updateUIForStopped();
            };

            mediaRecorder.start();
            updateUIForRecording();
            startTimer();

        } catch (error) {
            console.error("مائیک حاصل کرنے میں خرابی:", error);
            if (error.name === "NotAllowedError") {
                alert("آپ نے مائیکروفون کی اجازت نہیں دی۔ براہ کرم اجازت دیں اور دوبارہ کوشش کریں۔");
            } else {
                alert("مائیکروفون تک رسائی ممکن نہیں ہوئی۔ یقینی بنائیں کہ مائیک منسلک ہے۔");
            }
        }
    };

    // 2. Pause/Resume Button
    pauseResumeBtn.onclick = () => {
        if (!mediaRecorder) return;
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
        if (!mediaRecorder) return;
        mediaRecorder.stop();
        audioStream.getTracks().forEach(track => track.stop()); // Mic access stop
        isRecording = false;
        isPaused = false;
        clearInterval(timerInterval);
    };

    // ... (باقی تمام فنکشنز جیسے startTimer, formatTime, UI updates, resetRecordingModal, uploadBtn.onclick یہاں موجود رہیں گے)
    
    // --- Helper Functions ---
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
    
    // --- UI Update Functions ---
    function updateUIForRecording() { /* (پہلے جیسا ہی) */
        recorderUI.classList.add('recording');
        recorderUI.classList.remove('paused');
        micBtn.style.display = 'none';
        controlsContainer.style.display = 'flex';
        recordStatus.textContent = 'ریکارڈنگ جاری ہے...';
        pauseResumeBtn.innerHTML = '<i class="fas fa-pause"></i> توقف';
    }

    function updateUIForPaused() { /* (پہلے جیسا ہی) */
        recorderUI.classList.add('paused');
        recordStatus.textContent = 'ریکارڈنگ روک دی گئی ہے۔';
        pauseResumeBtn.innerHTML = '<i class="fas fa-play"></i> دوبارہ شروع';
    }

    function updateUIForStopped() { /* (پہلے جیسا ہی) */
        recorderUI.style.display = 'none';
        detailsForm.style.display = 'block';
    }
    
    // --- Reset Function (Important!) ---
    function resetRecordingModal() { /* (پہلے جیسا ہی) */
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
    uploadBtn.onclick = () => { /* (پہلے جیسا ہی Firebase والا کوڈ) */
        // ...
    };
}!" );