// ===================================
// VARIABEL GLOBAL & DOM ELEMENTS
// ===================================
let userCoins = parseInt(localStorage.getItem('userCoins')) || 1000;
let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 0; // Mulai dari level 0, akan menjadi 1 saat game dimulai
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

const questionImage = document.getElementById('question-image');
const answerInput = document.getElementById('answer-input');
const checkButton = document.getElementById('check-button');
const clueButton = document.getElementById('clue-button');
const levelDisplay = document.getElementById('level-display');
const userCoinsDisplay = document.getElementById('user-coins');
const userPointsDisplay = document.getElementById('user-points');
const clueText = document.getElementById('clue-text');

// ===================================
// 1. DATA LEVEL SOAL (Level 1-20)
// ===================================
const levelsData = [
  // Level 1: Soal Gambar
  {
    answer: "hayo siapa nama ku?",
    // KOREKSI PATH ABSOLUT: Menggunakan spasi dan dimulai dari root (/)
    image: "/games/tebak gambar/assets/img/level01.jpg", 
    clue: "alifirdaus",
    reward: 30 // Koin yang didapat
  },
  // Level 2
  {
    answer: "siapakah nama ku2?",
    image: "/games/tebak gambar/assets/img/level02.jpg", 
    clue: "carsim",
    reward: 30
  },
  // Level 3
  {
    answer: "coba tebak nama ku?",
    image: "/games/tebak gambar/assets/img/level03.jpg", 
    clue: "bambang",
    reward: 70
  },
  // Level 4
  {
    answer: "nama ku siapa ya?",
    image: "/games/tebak gambar/assets/img/level04.jpg", 
    clue: "hariyana",
    reward: 70
  },
  // Level 5
  {
    answer: "ayo tebak nama ku?",
    image: "/games/tebak gambar/assets/img/level05.jpg", 
    clue: "andi",
    reward: 100
  },
  // Level 6
  {
    answer: "pasti kamu gak tau nama ku?",
    image: "/games/tebak gambar/assets/img/level06.jpg", 
    clue: "wisnu",
    reward: 100
  },
  // Level 7
  {
    answer: "tebaklah nama ku?",
    image: "/games/tebak gambar/assets/img/level07.jpg", 
    clue: "awang",
    reward: 150
  },
  // Level 8
  {
    answer: "tebaklah nama ku?",
    image: "/games/tebak gambar/assets/img/level08.jpg", 
    clue: "wisnu",
    reward: 150
  },
  // Level 9
  {
    answer: "siapakah aku?",
    image: "/games/tebak gambar/assets/img/level09.jpg", 
    clue: "wiro",
    reward: 200
  },
  // Level 10
  {
    answer: "siapaku siapa?",
    image: "/games/tebak gambar/assets/img/level10.png", 
    clue: "m.wandi",
    reward: 200
  },
  // Level 11
  {
    answer: "siapakah namaku?",
    image: "/games/tebak gambar/assets/img/level11.png", 
    clue: "soni",
    reward: 250
  },
  // Level 12
  {
    answer: "coba tebak namaku?",
    image: "/games/tebak gambar/assets/img/level12.png", 
    clue: "asman",
    reward: 250
  },
  // Level 13
  {
    answer: "ayo tebak aku?",
    image: "/games/tebak gambar/assets/img/level13.png", 
    clue: "bundas",
    reward: 300
  },
  // Level 14
  {
    answer: "tebak aku dong?",
    image: "/games/tebak gambar/assets/img/level14.png", 
    clue: "misnan",
    reward: 300
  },
  // Level 15
  {
    answer: "masih kenal kah dengan ku?",
    image: "/games/tebak gambar/assets/img/level15.png", 
    clue: "dodo",
    reward: 350
  },
  // Level 16
  {
    answer: "tebak aku lagi?",
    image: "/games/tebak gambar/assets/img/level16.png", 
    clue: "sutri",
    reward: 350
  },
  // Level 17
  {
    answer: "siapa ya aku?",
    image: "/games/tebak gambar/assets/img/level17.jpg", 
    clue: "supat",
    reward: 400
  },
  // Level 18
  {
    answer: "coba tebak siapa aku?",
    image: "/games/tebak gambar/assets/img/level18.jpg", 
    clue: "cinta",
    reward: 400
  },
  // Level 19
  {
    answer: "masih aku juga?",
    image: "/games/tebak gambar/assets/img/level19.jpg", 
    clue: "gibran",
    reward: 450
  },
  // Level 20
  {
    answer: "ini terakhir lho?",
    image: "/games/tebak gambar/assets/img/level20.jpg", 
    clue: "joko",
    reward: 450
  }
];

// ===================================
// 2. FUNGSI UTAMA GAME
// ===================================

function muatLevel() {
  // Cek apakah game sudah selesai
  if (currentLevel >= levelsData.length) {
    alert("Selamat! Anda telah menyelesaikan semua level Tebak Gambar MBI!");
    // Atur ulang game atau arahkan ke halaman selesai
    currentLevel = 0; // Mulai lagi dari awal jika ingin
    localStorage.setItem('currentLevel', currentLevel);
    muatLevel();
    return;
  }

  const levelData = levelsData[currentLevel];
  
  // Update tampilan level dan gambar
  levelDisplay.textContent = `Level: ${currentLevel + 1}`;
  questionImage.src = levelData.image; // Menggunakan path yang sudah diperbaiki
  answerInput.value = ''; // Kosongkan input
  clueText.style.display = 'none'; // Sembunyikan petunjuk
  clueText.textContent = '';
}

function cekJawaban() {
  const levelData = levelsData[currentLevel];
  const userAnswer = answerInput.value.trim().toLowerCase();
  
  // Jawaban harus Case-Insensitive (tidak peduli huruf besar/kecil)
  const isCorrect = userAnswer === levelData.answer.toLowerCase();

  if (isCorrect) {
    alert(`Jawaban Benar! Anda mendapatkan ${levelData.reward} Koin!`);
    
    // Beri hadiah
    userCoins += levelData.reward;
    userPoints += 10; // Tambahkan poin untuk leaderboard
    
    // Lanjutkan ke level berikutnya
    currentLevel++;
    
    // Simpan progres
    simpanProgres();
    
    // Muat level baru
    muatLevel();
    
  } else {
    alert("Jawaban Salah. Coba lagi!");
  }
}

function getClue() {
  const levelData = levelsData[currentLevel];
  const clueCost = 50;

  if (userCoins >= clueCost) {
    // Kurangi koin
    userCoins -= clueCost;
    
    // Tampilkan petunjuk
    clueText.textContent = `Petunjuk: Jawaban mengandung kata "${levelData.clue}".`;
    clueText.style.display = 'block';
    
    // Simpan progres
    simpanProgres();
    
  } else {
    alert("Koin tidak cukup! Tonton iklan atau jawab beberapa soal untuk mendapatkan koin.");
  }
}

function simpanProgres() {
  localStorage.setItem('userCoins', userCoins);
  localStorage.setItem('currentLevel', currentLevel);
  localStorage.setItem('userPoints', userPoints);
  
  // Perbarui tampilan di header
  updateHeaderStats();
}

function updateHeaderStats() {
    if (userCoinsDisplay) userCoinsDisplay.textContent = userCoins;
    if (userPointsDisplay) userPointsDisplay.textContent = userPoints;
}


// ===================================
// 3. EVENT LISTENERS & INICIALISASI
// ===================================

// Tombol Cek Jawaban
if (checkButton) {
  checkButton.addEventListener('click', cekJawaban);
}

// Tombol Bantuan
if (clueButton) {
  clueButton.addEventListener('click', getClue);
}

// Enter di input juga bisa untuk cek jawaban
if (answerInput) {
  answerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      cekJawaban();
    }
  });
}

// Muat level pertama saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderStats();
    muatLevel();
});
