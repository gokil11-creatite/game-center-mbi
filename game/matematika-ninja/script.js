// --- 1. IMPOR FIREBASE DAN KONFIGURASI ---

// Import koneksi database (db) dari file konfigurasi di luar folder game
import { db } from '../../server/firebase_config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- 2. VARIABEL GLOBAL & ELEMEN HTML ---
// Variabel Kontrol Game
let currentQuestionIndex = 0;
let score = 0;
let timeLimit = 30; // Waktu total game (30 detik)
let gameTimerInterval;
let questionsData = []; // Untuk menyimpan data soal dari JSON
const gameType = "matematika-ninja"; // Penanda untuk Leaderboard

// Variabel Pemain Sementara
const PLAYER_ID = "MBI_TestUser_1"; // Akan diganti dengan Auth/Login nanti

// Elemen DOM (akan diisi saat DOMContentLoaded)
let questionTextElement = null;
let optionsContainer = null;
let scoreDisplay = null;
let timerDisplay = null;
let startButton = null;

// --- 3. PEMUATAN DATA SOAL (questions.json) ---

async function loadQuestions() {
    try {
        // Karena script berada di folder game/matematika-ninja/, ambil JSON relatif dari folder ini
        const response = await fetch('./data/questions.json');
        
        if (!response.ok) {
            throw new Error(`Gagal memuat soal: ${response.statusText}`);
        }
        
        questionsData = await response.json();
        
        // Setelah soal dimuat, siapkan tampilan
        if (questionTextElement) questionTextElement.textContent = 'Soal siap! Tekan START.';
        if (startButton) startButton.style.display = 'block'; 
        console.log(`Berhasil memuat ${questionsData.length} soal.`);
        
    } catch (error) {
        console.error("Error saat memuat soal:", error);
        if (questionTextElement) questionTextElement.textContent = "Gagal memuat data game.";
    }
}

// --- 4. LOGIKA INTI GAME ---

/**
 * Memulai Timer Hitung Mundur Game
 */
function startTimer() {
    if (!timerDisplay) return;
    timerDisplay.textContent = timeLimit;
    gameTimerInterval = setInterval(() => {
        timeLimit--;
        timerDisplay.textContent = timeLimit;
        
        if (timeLimit <= 0) {
            clearInterval(gameTimerInterval);
            endGame();
        }
    }, 1000);
}

/**
 * Menampilkan Soal Saat Ini
 */
function displayQuestion() {
    if (!questionTextElement || !optionsContainer) return;

    if (currentQuestionIndex >= questionsData.length) {
        // Jika soal habis sebelum waktu habis
        endGame();
        return;
    }

    const q = questionsData[currentQuestionIndex];
    questionTextElement.textContent = q.question;
    optionsContainer.innerHTML = ''; // Kosongkan opsi sebelumnya

    q.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option-btn';
        button.addEventListener('click', () => checkAnswer(option, q.correct_answer));
        optionsContainer.appendChild(button);
    });
}

/**
 * Memproses Jawaban Pemain
 */
function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score += 10; // Tambah 10 poin jika benar
        // Tambahkan efek visual 'Benar!' (CSS Class)
    } else {
        score -= 5; // Kurangi 5 poin jika salah
        // Tambahkan efek visual 'Salah!' (CSS Class)
    }
    
    if (scoreDisplay) scoreDisplay.textContent = score;
    currentQuestionIndex++;
    displayQuestion(); // Lanjut ke soal berikutnya
}

/**
 * Menyimpan Skor Akhir ke Firebase Leaderboard
 * @param {number} finalScore - Skor akhir pemain
 */
async function saveScoreToFirebase(finalScore) {
    const coinsEarned = Math.max(0, Math.floor(finalScore / 10) + 5); // Rumus sederhana reward
    
    try {
        await addDoc(collection(db, "leaderboard"), {
            playerId: PLAYER_ID, 
            gameId: gameType,
            score: finalScore,
            coins: coinsEarned,
            createdAt: serverTimestamp() 
        });
        
        alert(`Skor Anda: ${finalScore}. Anda mendapatkan ${coinsEarned} Koin! Skor disimpan ke Leaderboard.`);

    } catch (e) {
        console.error("Error menyimpan skor ke Firebase:", e);
        alert(`Skor: ${finalScore}. Gagal menyimpan ke Leaderboard.`);
    }
}

/**
 * Mengakhiri Game dan Memanggil Penyimpanan Skor
 */
function endGame() {
    saveScoreToFirebase(score); 
    
    // Reset variabel dan UI
    if (questionTextElement) questionTextElement.textContent = 'Game Selesai! Lihat Leaderboard atau tekan START.';
    if (optionsContainer) optionsContainer.innerHTML = '';
    if (startButton) startButton.style.display = 'block';
    
    currentQuestionIndex = 0;
    score = 0;
    timeLimit = 30;
}

/**
 * Fungsi Utama untuk Memulai Game
 */
function startGame() {
    if (startButton) startButton.style.display = 'none';
    score = 0;
    currentQuestionIndex = 0;
    timeLimit = 30;
    if (scoreDisplay) scoreDisplay.textContent = score;
    
    startTimer();
    displayQuestion();
}


// --- 5. EKSEKUSI ---
document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen DOM setelah DOM siap
    questionTextElement = document.getElementById('question-text');
    optionsContainer = document.getElementById('options-container');
    scoreDisplay = document.getElementById('score-display');
    timerDisplay = document.getElementById('timer-display');
    startButton = document.getElementById('start-button');

    // Event Listener saat tombol START diklik (saat elemen sudah pasti ada)
    if (startButton) startButton.addEventListener('click', startGame);

    // Muat soal segera setelah script dijalankan
    loadQuestions();
});
