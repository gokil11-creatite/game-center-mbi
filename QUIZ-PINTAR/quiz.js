// Logika Game Kuis Pintar

// Lokasi file data kuis
const QUIZ_DATA_URL = 'data/level-1.json'; 

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Import fungsi global untuk menyimpan skor (dari app.js di root folder)
// Asumsi fungsi saveUserData diekspor dari app.js
// Catatan: Karena ini adalah kuis individual, kita hanya update skor lokal, 
// kemudian kirim hasil akhir ke fungsi global jika diperlukan.

/**
 * Mendapatkan Poin/Koin global dari app.js (Placeholder)
 * Dalam lingkungan Canvas, Anda mungkin perlu memanggil fungsi global
 * atau membaca dari state global. Untuk saat ini, kita akan fokus pada skor kuis.
 */
// import { saveUserData } from '../app.js'; // Harus diuncomment jika app.js diekspor!


// === FUNGSI UTAMA UNTUK MEMUAT DATA KUIS ===
async function loadQuizData() {
    try {
        const response = await fetch(QUIZ_DATA_URL);
        questions = await response.json();
        console.log('Data Kuis berhasil dimuat.');
        if (questions.length > 0) {
            startQuiz();
        } else {
            document.getElementById('question-text').textContent = 'Error: Tidak ada data kuis.';
        }
    } catch (error) {
        console.error('Gagal memuat data kuis:', error);
        document.getElementById('question-text').textContent = 'Gagal memuat kuis. Pastikan file data/level-1.json ada.';
    }
}

// === MEMULAI PERMAINAN KUIS ===
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('current-score').textContent = score;
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';
    showQuestion();
}

// === MENAMPILKAN PERTANYAAN SAAT INI ===
function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = `[${question.kategori}] ${question.pertanyaan}`;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('feedback-message').textContent = '';

    // Membuat tombol untuk setiap pilihan jawaban
    question.pilihan.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        // Panggil checkAnswer dengan referensi tombol dan jawaban
        button.onclick = () => checkAnswer(button, option, question.jawaban_benar, question.poin_reward);
        optionsContainer.appendChild(button);
    });
}

// === MEMERIKSA JAWABAN PEMAIN ===
function checkAnswer(selectedButton, selectedAnswer, correctAnswer, reward) {
    // Non-aktifkan semua tombol setelah memilih
    document.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);

    const feedback = document.getElementById('feedback-message');
    
    if (selectedAnswer === correctAnswer) {
        score += reward;
        document.getElementById('current-score').textContent = score;
        selectedButton.classList.add('correct');
        feedback.textContent = `BENAR! Anda mendapatkan ${reward} Poin.`;
    } else {
        selectedButton.classList.add('wrong');
        feedback.textContent = `SALAH. Jawaban yang benar adalah: ${correctAnswer}.`;
        
        // Tandai jawaban yang benar
        document.querySelectorAll('.option-button').forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    document.getElementById('next-button').style.display = 'block';
}

// === LOGIKA UNTUK LANJUT KE PERTANYAAN BERIKUTNYA ===
document.getElementById('next-button').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

// === MENAMPILKAN HASIL AKHIR KUIS ===
function showResults() {
    document.getElementById('quiz-area').style.display = 'none';
    document.getElementById('final-score').textContent = score;
    document.getElementById('result-screen').style.display = 'block';
    
    // TODO: Di sini, Anda harus memanggil fungsi saveUserData(scoreBaru, koinLama) 
    // yang ada di app.js untuk menyimpan skor total kuis ke Firestore.
    console.log(`Kuis selesai! Panggil fungsi saveUserData dengan skor: ${score}`);
}

// Memuat data saat halaman pertama kali dimuat
loadQuizData();
