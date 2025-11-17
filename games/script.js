// ===============================================
// 1. DATA LEVEL SOAL (Level 1-20)
// ===============================================
const levelsData = [
    // Level 1: Soal Gambar 
    { 
        answer: "hayo siapa nama ku?", 
        image: "/assets/img/level01.jpg", 
        clue: "alifirdaus.",
        reward: 30 // Koin yang didapat
    },
    // Level 2
    { 
        answer: "siapakah nama ku?", 
        image: "assets/img/leve02.jpg", 
        clue: "carsim.",
        reward: 30
    },
    // Level 3
    { 
        answer: "coba tebak nama ku?", 
        image: "assets/img/leve03.jpg", 
        clue: "bambang.",
        reward: 70
    },
    // Level 4
    { 
        answer: "nama ku siapa ya?", 
        image: "assets/img/leve04.jpg", 
        clue: "hariyana.",
        reward: 70
    },
    // Level 5
    { 
        answer: "ayo tebak nama ku?", 
        image: "assets/img/level05.jpg", 
        clue: "andi.",
        reward: 100
    },
    // Level 6
    { answer: "pasti kamu gak tau nama ku?", image: "assets/img/leve06.jpg", clue: "madsari", reward: 150 },
    // Level 7
    { answer: "tebaklah nama ku?", image: "assets/img/leve07.jpg", clue: "awad.", reward: 70 },
    // Level 8
    { answer: "tebaklah nama ku?", image: "assets/img/leve08.jpg", clue: "wisnaver", reward: 50 },
    // Level 9
    { answer: "siapakah aku?", image: "assets/img/leve09.jpg", clue: "wiro", reward: 50 },
    // Level 10
    { answer: "aku siapa?", image: "assets/img/level10.png", clue: "m.wandi.", reward: 80 },
    // Level 11
    { answer: "siapakah namaku?", image: "assets/img/level11.png", clue: "sonitilil", reward: 100 },
    // Level 12
    { answer: "coba tebak namaku?", image: "assets/img/level12.png", clue: "amelia.", reward: 200 },
    // Level 13
    { answer: "ayo tebak aku?", image: "assets/img/level13.png", clue: "bunda nuril", reward: 70 },
    // Level 14
    { answer: "tebak aku dong?", image: "assets/img/level14.png", clue: "misni", reward: 100 },
    // Level 15
    { answer: "masih kenal kah dengan ku?", image: "assets/img/level15.png", clue: "risna", reward: 70 },
    // Level 16
    { answer: "dari manakah asalku", image: "assets/img/level16.png", clue: "tasikmalaysa.", reward: 50 },
    // Level 17
    { answer: "coba tebak aku dari mana?", image: "assets/img/level17.png", clue: "subang.", reward: 50 },
    // Level 18
    { answer: "tau kah asal ku?", image: "assets/img/level18.png", clue: "jawabarat.", reward: 100 },
    // Level 19
    { answer: "aku istri siapa?", image: "assets/img/level19.png", clue: "andi.", reward: 100 },
    // Level 20
    { answer: "dari manakah aku?", image: "assets/img/level20.png", clue: "kuningan.", reward: 100 }
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
