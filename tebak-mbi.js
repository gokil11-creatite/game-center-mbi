// URL: tebak-mbi.js

// --- Konfigurasi Game dan Soal ---
const QUESTIONS = [
    {
        id: 1,
        image: "level01.jpg",
        question: "siapakah nama saya?",
        answer: ["alifirdaus"],
        hint: "Diawali huruf a, berarti kemenangan alifirdaus.",
        points: 25,
        coinReward: 5
    },
    {
        id: 2,
        image: "level02.jpg",
        question: "siapakah nama saya?",
        answer: ["carsim"],
        hint: "carsim.",
        points: 20,
        coinReward: 4
    },
    {
        id: 3,
        image: "level03.jpg",
        question: "ketikan nama ku?",
        answer: ["bambang"],
        hint: "bambang.",
        points: 30,
        coinReward: 6
    },
    // Tambahkan lebih banyak pertanyaan di sini!
    {
        id: 4,
        image: "level04.jpg",
        question: "coba sebutkan namaku?",
        answer: ["heriyana"],
        hint: "bang buluk atau rajatebteb/heriyana.",
        points: 20,
        coinReward: 4
    },
    {
        id: 5,
        image: "level05.jpg",
        question: "siapakah aku?",
        answer: ["madsari"],
        hint: "papah uky/madsari.",
        points: 20,
        coinReward: 4
    }
];

// --- Variabel State Game ---
let currentQuestionIndex = parseInt(localStorage.getItem('mbi_game_index')) || 0;
let userPoints = parseInt(localStorage.getItem('mbi_points')) || 0;
let userCoins = parseInt(localStorage.getItem('mbi_coins')) || 0;
const HINT_COST = 10;

// --- Elemen DOM ---
const $image = document.getElementById('game-image');
const $questionText = document.getElementById('question-text');
const $qIndexDisplay = document.getElementById('current-question-index');
const $totalQDisplay = document.getElementById('total-questions');
const $answerInput = document.getElementById('answer-input');
const $checkButton = document.getElementById('check-answer-button');
const $hintButton = document.getElementById('hint-button');
const $nextButton = document.getElementById('next-question-button');
const $feedback = document.getElementById('feedback-message');

// --- Inisialisasi Audio (Minimal untuk Game) ---
const CORRECT_SYNTH = new Tone.Synth().toDestination();
const INCORRECT_SYNTH = new Tone.NoiseSynth().toDestination();

function playCorrectSound() {
    CORRECT_SYNTH.triggerAttackRelease(["C5", "E5", "G5"], "8n");
}

function playIncorrectSound() {
    INCORRECT_SYNTH.envelope.attack = 0.001;
    INCORRECT_SYNTH.triggerAttackRelease("16n");
}

// --- Fungsi Skor dan Tampilan ---

function updateAllDisplays() {
    // Memperbarui Skor di panel kiri
    document.getElementById('current-points').textContent = userPoints;
    document.getElementById('current-coins').textContent = userCoins;
    
    // Menyimpan state terbaru ke Local Storage
    localStorage.setItem('mbi_points', userPoints);
    localStorage.setItem('mbi_coins', userCoins);
    localStorage.setItem('mbi_game_index', currentQuestionIndex);
}

function loadQuestion() {
    // Jika semua soal sudah dijawab
    if (currentQuestionIndex >= QUESTIONS.length) {
        displayMessage("Selamat! Anda telah menyelesaikan semua soal Tebak MBI. Tunggu update soal berikutnya!", true);
        $image.src = 'https://placehold.co/400x200/4cd964/ffffff?text=SELESAI';
        $questionText.textContent = "Semua soal telah dijawab. Anda hebat!";
        $checkButton.classList.add('hidden');
        $hintButton.classList.add('hidden');
        $nextButton.classList.add('hidden');
        return;
    }

    const q = QUESTIONS[currentQuestionIndex];
    
    // Update tampilan
    $qIndexDisplay.textContent = currentQuestionIndex + 1;
    $totalQDisplay.textContent = QUESTIONS.length;
    $image.src = q.image; // Gunakan path gambar yang benar
    $questionText.textContent = q.question;
    $answerInput.value = '';
    $answerInput.disabled = false;
    $checkButton.classList.remove('hidden');
    $hintButton.classList.remove('hidden');
    $nextButton.classList.add('hidden');
    $feedback.textContent = '';
    $feedback.classList.remove('correct', 'incorrect');
    $hintButton.textContent = `Gunakan Petunjuk (-${HINT_COST} Koin)`;

    // Cek apakah hint sudah pernah dipakai untuk soal ini (di dalam storage)
    const hintUsed = localStorage.getItem(`hint_used_${q.id}`) === 'true';
    if (hintUsed) {
        $hintButton.disabled = true;
        $hintButton.textContent = "Petunjuk sudah dipakai";
        $feedback.textContent = `Petunjuk: ${q.hint}`;
    } else {
        $hintButton.disabled = false;
    }
}

function checkAnswer() {
    const q = QUESTIONS[currentQuestionIndex];
    const userAnswer = $answerInput.value.trim().toUpperCase();
    
    if (q.answer.includes(userAnswer)) {
        // Jawaban Benar
        playCorrectSound();
        $feedback.textContent = `BENAR! Anda mendapatkan ${q.points} Poin dan ${q.coinReward} Koin.`;
        $feedback.classList.remove('incorrect');
        $feedback.classList.add('correct');
        
        userPoints += q.points;
        userCoins += q.coinReward;
        
        // Nonaktifkan input dan tombol cek
        $answerInput.disabled = true;
        $checkButton.classList.add('hidden');
        $hintButton.classList.add('hidden');
        $nextButton.classList.remove('hidden');

        // Reset hint status setelah dijawab benar
        localStorage.removeItem(`hint_used_${q.id}`);
        
    } else {
        // Jawaban Salah
        playIncorrectSound();
        $feedback.textContent = "Jawaban Salah. Coba lagi atau gunakan Petunjuk.";
        $feedback.classList.remove('correct');
        $feedback.classList.add('incorrect');
    }
    
    updateAllDisplays();
}

function useHint() {
    if (userCoins < HINT_COST) {
        displayMessage(`Koin tidak cukup! Anda butuh ${HINT_COST} Koin untuk petunjuk.`);
        return;
    }

    const q = QUESTIONS[currentQuestionIndex];
    
    // Kurangi Koin
    userCoins -= HINT_COST;

    // Tampilkan petunjuk
    $feedback.textContent = `Petunjuk: ${q.hint}`;
    $feedback.classList.remove('correct', 'incorrect');
    
    // Nonaktifkan tombol petunjuk dan simpan status
    $hintButton.disabled = true;
    $hintButton.textContent = "Petunjuk sudah dipakai";
    localStorage.setItem(`hint_used_${q.id}`, 'true');

    updateAllDisplays();
}

function nextQuestion() {
    // Pindah ke soal berikutnya
    currentQuestionIndex++;
    loadQuestion();
    updateAllDisplays();
}

// --- Fungsi Custom Modal (Harus ada di setiap halaman) ---
function displayMessage(message, isFinal = false) {
    let style = document.getElementById('modal-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .custom-modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.7); justify-content: center; align-items: center; }
            .modal-content { background-color: #333; padding: 30px; border-radius: 10px; text-align: center; position: relative; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); width: 80%; max-width: 400px; }
            .close-button { color: #aaa; font-size: 28px; font-weight: bold; position: absolute; top: 10px; right: 15px; cursor: pointer; }
            .modal-ok-button { background-color: ${isFinal ? '#4cd964' : '#ffd700'}; color: black; border: none; padding: 10px 20px; font-size: 16px; margin-top: 15px; cursor: pointer; border-radius: 5px; font-weight: bold; }
            #modal-text { color: white; margin-bottom: 0; }
        `;
        document.head.appendChild(style);
    }
    
    let modal = document.getElementById('custom-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <p id="modal-text"></p>
                <button class="modal-ok-button">OK</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
        modal.querySelector('.modal-ok-button').onclick = () => modal.style.display = 'none';
        window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }
    }

    document.getElementById('modal-text').textContent = message;
    modal.style.display = 'flex';
}

// --- Inisialisasi Aplikasi ---
function initGame() {
    // 1. Tambahkan Event Listeners
    $checkButton.addEventListener('click', checkAnswer);
    $hintButton.addEventListener('click', useHint);
    $nextButton.addEventListener('click', nextQuestion);
    $answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !$checkButton.classList.contains('hidden')) {
            checkAnswer();
        }
    });

    // 2. Muat dan Tampilkan Soal Pertama
    loadQuestion();
    
    // 3. Perbarui tampilan skor awal
    updateAllDisplays();
}

// Jalankan inisialisasi setelah DOM dimuat
document.addEventListener('DOMContentLoaded', () => {
    // PENTING: Untuk memastikan Tone.js terinisialisasi
    if (Tone.context.state !== 'running') {
        Tone.start().then(initGame);
    } else {
        initGame();
    }
});
