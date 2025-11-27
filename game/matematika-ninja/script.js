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

// Mendapatkan elemen HTML
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button'); 


// --- 3. PEMUATAN DATA SOAL (questions.json) ---

async function loadQuestions() {
    try {
        // Menggunakan Fetch API untuk mengambil file JSON dari sub-folder 'data'
        const response = await fetch('games/matematika-ninja/data/questions.json');
        
        if (!response.ok) {
            throw new Error(`Gagal memuat soal: ${response.statusText}`);
        }
        
        questionsData = await response.json();
        
        // Setelah soal dimuat, siapkan tampilan
        questionTextElement.textContent = 'Soal siap! Tekan START.';
        startButton.style.display = 'block'; 
        console.log(`Berhasil memuat ${questionsData.length} soal.`);
        
    } catch (error) {
        console.error("Error saat memuat soal:", error);
        questionTextElement.textContent = "Gagal memuat data game.";
    }
}


// --- 4. LOGIKA INTI GAME ---

/**
 * Memulai Timer Hitung Mundur Game
 */
function startTimer() {
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
    
    scoreDisplay.textContent = score;
    currentQuestionIndex++;
    displayQuestion(); // Lanjut ke soal berikutnya
}

/**
 * Menyimpan Skor Akhir ke Firebase Leaderboard
 * @param {number} finalScore - Skor akhir pemain
 */
async function saveScoreToFirebase(finalScore) {
    const coinsEarned = Math.floor(finalScore / 10) + 5; // Rumus sederhana reward
    
    try {
        await addDoc(collection(db, "leaderboard"), {
            playerId: PLAYER_ID, 
            gameId: gameType,
            score: finalScore,
            coins: coinsEarned,
            createdAt: serverTimestamp() 
        });
        
        // Catatan: Logika update koin pemain di collection 'users' harus diimplementasikan secara terpisah di file script.js landing page.
        
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
    questionTextElement.textContent = 'Game Selesai! Lihat Leaderboard atau tekan START.';
    optionsContainer.innerHTML = '';
    startButton.style.display = 'block';
    
    currentQuestionIndex = 0;
    score = 0;
    timeLimit = 30;
}

/**
 * Fungsi Utama untuk Memulai Game
 */
function startGame() {
    startButton.style.display = 'none';
    score = 0;
    currentQuestionIndex = 0;
    timeLimit = 30;
    scoreDisplay.textContent = score;
    
    startTimer();
    displayQuestion();
}


// --- 5. EKSEKUSI ---

// Event Listener saat tombol START diklik
startButton.addEventListener('click', startGame);

// Muat soal segera setelah script dijalankan
document.addEventListener('DOMContentLoaded', loadQuestions);