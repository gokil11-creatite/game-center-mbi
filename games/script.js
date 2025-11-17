// ===============================================
// 1. DATA LEVEL SOAL (Level 1-20)
// ===============================================
const levelsData = [
    // Level 1: Soal Gambar 
    { 
        answer: "MAUNGBODAS", 
        image: "assets/img/level1.png", 
        clue: "Ini adalah julukan atau nama lain dari harimau putih yang gagah.",
        reward: 100 // Koin yang didapat
    },
    // Level 2
    { 
        answer: "INDONESIAKU", 
        image: "assets/img/level2.png", 
        clue: "Tanah air tempat MBI berdiri.",
        reward: 120
    },
    // Level 3
    { 
        answer: "GAMECENTER", 
        image: "assets/img/level3.png", 
        clue: "Tempat berkumpulnya semua permainan ini.",
        reward: 140
    },
    // Level 4
    { 
        answer: "TEBAKGAMBAR", 
        image: "assets/img/level4.png", 
        clue: "Nama permainan yang sedang Anda mainkan.",
        reward: 160
    },
    // Level 5
    { 
        answer: "KUMPULKOIN", 
        image: "assets/img/level5.png", 
        clue: "Tujuan utama Anda setelah memenangkan level.",
        reward: 180
    },
    // Level 6
    { answer: "JUARASATU", image: "assets/img/level6.png", clue: "Gelar yang diharapkan MBI.", reward: 200 },
    // Level 7
    { answer: "SAYASANGAR", image: "assets/img/level7.png", clue: "Perasaan saat menyelesaikan semua level.", reward: 220 },
    // Level 8
    { answer: "HARIMAUPUTIH", image: "assets/img/level8.png", clue: "Maskot MBI.", reward: 240 },
    // Level 9
    { answer: "GOKILABIS", image: "assets/img/level9.png", clue: "Kata slang untuk sangat keren.", reward: 260 },
    // Level 10
    { answer: "TANTANGAN", image: "assets/img/level10.png", clue: "Apa yang Anda hadapi di setiap level.", reward: 280 },
    // Level 11
    { answer: "BELAJAR", image: "assets/img/level11.png", clue: "Apa yang Anda lakukan saat gagal.", reward: 300 },
    // Level 12
    { answer: "BERMAIN", image: "assets/img/level12.png", clue: "Aktivitas Anda saat ini.", reward: 320 },
    // Level 13
    { answer: "KEBERUNTUNGAN", image: "assets/img/level13.png", clue: "Kadang diperlukan dalam game.", reward: 340 },
    // Level 14
    { answer: "MANTAPJIWA", image: "assets/img/level14.png", clue: "Ungkapan rasa senang.", reward: 360 },
    // Level 15
    { answer: "KREATIF", image: "assets/img/level15.png", clue: "Pikiran yang dibutuhkan untuk game ini.", reward: 380 },
    // Level 16
    { answer: "PEMENANG", image: "assets/img/level16.png", clue: "Siapa Anda jika berhasil.", reward: 400 },
    // Level 17
    { answer: "KERJAKERAS", image: "assets/img/level17.png", clue: "Kunci sukses di segala bidang.", reward: 420 },
    // Level 18
    { answer: "SEMANGAT45", image: "assets/img/level18.png", clue: "Slogan perjuangan Indonesia.", reward: 440 },
    // Level 19
    { answer: "LUARBIASA", image: "assets/img/level19.png", clue: "Kata pujian tingkat tinggi.", reward: 460 },
    // Level 20
    { answer: "GRANDPRIZE", image: "assets/img/level20.png", clue: "Hadiah besar di akhir permainan.", reward: 500 }
];

// ===============================================
// 2. ELEMEN DOM DAN VARIABEL GAME
// ===============================================
let currentLevel = parseInt(localStorage.getItem('tgLevel')) || 1;
const CLUE_COST = 50; // Biaya bantuan: 50 Koin

const imageDisplay = document.getElementById('question-image');
const answerInput = document.getElementById('answer-input');
const checkButton = document.getElementById('check-button');
const clueButton = document.getElementById('clue-button');
const clueText = document.getElementById('clue-text');
const messageDisplay = document.getElementById('message');
const levelDisplay = document.getElementById('level-display');

// ===============================================
// 3. SOUND EFFECTS (AUDIO ELEMENTS)
// ===============================================

// Lokasi file audio harus ada di games/tebak-gambar/assets/sound/
const soundBGM = new Audio('assets/sound/bgm.mp3');
soundBGM.loop = true; // Backsound akan berulang
soundBGM.volume = 0.5; // Set volume BGM sedikit lebih rendah

const soundClick = new Audio('assets/sound/sfx-click.mp3');
const soundBenar = new Audio('assets/sound/sound-benar.mp3');
const soundSalah = new Audio('assets/sound/sound-salah.mp3');
const soundBantuan = new Audio('assets/sound/sound-bantuan.mp3');
const soundLanjut = new Audio('assets/sound/sound-lanjut.mp3');

// Dua Sound Efek Koin BARU
const soundGetCoin = new Audio('assets/sound/sound-get-coin.mp3'); 
const soundSpendCoin = new Audio('assets/sound/sound-spend-coin.mp3');

function playSound(audioElement) {
    audioElement.currentTime = 0; // Reset ke awal sebelum play
    audioElement.play().catch(e => console.log("Sound play failed:", e));
}

// ===============================================
// 4. FUNGSI INTI GAME
// ===============================================

function loadLevel(level) {
    if (level > levelsData.length) {
        // SEMUA LEVEL SELESAI
        levelDisplay.textContent = `Level: TAMAT`;
        messageDisplay.textContent = "SELAMAT! Anda telah menyelesaikan semua level! 🎉";
        messageDisplay.className = 'message correct';
        imageDisplay.src = "assets/img/tamat.png"; // Perlu gambar TAMAT.png
        answerInput.style.display = 'none';
        checkButton.style.display = 'none';
        clueButton.style.display = 'none';
        playSound(soundLanjut); // Gunakan sound lanjut sebagai penutup
        return;
    }

    const data = levelsData[level - 1];
    
    // Reset Tampilan
    levelDisplay.textContent = `Level: ${level}`;
    imageDisplay.src = data.image;
    answerInput.value = '';
    messageDisplay.textContent = '';
    messageDisplay.className = 'message';
    clueText.style.display = 'none';
    clueText.textContent = '';
    
    // Update clue cost display 
    document.getElementById('clue-cost').textContent = `Bantuan: ${CLUE_COST} Koin 💰`;
}

function checkAnswer() {
    playSound(soundClick); // Mainkan sound klik

    const inputAnswer = answerInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const correctAnswer = levelsData[currentLevel - 1].answer;
    const reward = levelsData[currentLevel - 1].reward;

    if (inputAnswer === correctAnswer) {
        // JAWABAN BENAR
        playSound(soundBenar);
        playSound(soundGetCoin); // <--- Sound Mendapatkan Koin BARU
        messageDisplay.textContent = `BENAR! Anda mendapatkan ${reward} Koin!`;
        messageDisplay.className = 'message correct';

        // Panggil fungsi addCoins dari app.js (di root)
        if (typeof addCoins === 'function') {
            addCoins(reward); 
        }

        // Siapkan untuk Level Selanjutnya
        setTimeout(() => {
            currentLevel++;
            localStorage.setItem('tgLevel', currentLevel);
            playSound(soundLanjut);
            loadLevel(currentLevel);
        }, 2000);

    } else {
        // JAWABAN SALAH
        playSound(soundSalah);
        messageDisplay.textContent = 'SALAH! Coba lagi atau gunakan bantuan.';
        messageDisplay.className = 'message wrong';
    }
}

function useClue() {
    playSound(soundClick); // Mainkan sound klik

    // Panggil fungsi spendCoins dari app.js (di root)
    if (typeof spendCoins === 'function' && spendCoins(CLUE_COST)) {
        // Berhasil memotong koin
        playSound(soundSpendCoin); // <--- Sound Menggunakan Koin BARU
        const clue = levelsData[currentLevel - 1].clue;
        clueText.textContent = `PETUNJUK: ${clue}`;
        clueText.style.display = 'block';
        messageDisplay.textContent = `Anda menggunakan ${CLUE_COST} Koin untuk petunjuk ini.`;
        messageDisplay.className = 'message';

    } else {
        // Gagal (Koin tidak cukup)
        messageDisplay.textContent = 'Koin tidak cukup untuk bantuan!';
        messageDisplay.className = 'message wrong';
    }
}

// ===============================================
// 5. EVENT LISTENERS & INISIALISASI
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    loadLevel(currentLevel);

    checkButton.addEventListener('click', checkAnswer);
    clueButton.addEventListener('click', useClue);

    // Memungkinkan Cek Jawaban dengan tombol Enter pada input
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Mulai Backsound saat interaksi pertama
    document.body.addEventListener('click', () => {
        if (soundBGM.paused) {
            soundBGM.play().catch(e => console.log("BGM play failed:", e));
        }
    }, { once: true });
});
