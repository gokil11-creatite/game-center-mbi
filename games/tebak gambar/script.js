// ===================================
// VARIABEL GLOBAL & DOM ELEMENTS
// ===================================
// Mengambil data dari Local Storage, jika tidak ada, defaultnya 1000 koin dan level 0
let userCoins = parseInt(localStorage.getItem('userCoins')) || 1000;
let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 0; 
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

// Mengambil elemen-elemen dari HTML
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
  // Level 1
  {
    answer: "alifirdaus",
    image: "/games/tebak gambar/assets/img/level01.jpg", 
    clue: "alifirdaus",
    reward: 30
  },
  // Level 2
  {
    answer: "carsim",
    image: "/games/tebak gambar/assets/img/level02.jpg", 
    clue: "carsim",
    reward: 30
  },
  // Level 3
  {
    answer: "bambang",
    image: "/games/tebak gambar/assets/img/level03.jpg", 
    clue: "bambang",
    reward: 70
  },
  // Level 4
  {
    answer: "heriyana",
    image: "/games/tebak gambar/assets/img/level04.jpg", 
    clue: "heriyana",
    reward: 70
  },
  // Level 5
  {
    answer: "andi",
    image: "/games/tebak gambar/assets/img/level05.jpg", 
    clue: "andi",
    reward: 70
  },
  // Level 6
  {
    answer: "madsari",
    image: "/games/tebak gambar/assets/img/level06.jpg", 
    clue: "madsari",
    reward: 100
  },
  // Level 7
  {
    answer: "awad",
    image: "/games/tebak gambar/assets/img/level07.jpg", 
    clue: "awad",
    reward: 50
  },
  // Level 8
  {
    answer: "wisnaver",
    image: "/games/tebak gambar/assets/img/level08.jpg", 
    clue: "wisnaver",
    reward: 30
  },
  // Level 9
  {
    answer: "wiro",
    image: "/games/tebak gambar/assets/img/level09.jpg", 
    clue: "wiro",
    reward: 30
  },
  // Level 10
  {
    answer: "m.wandi",
    image: "/games/tebak gambar/assets/img/level10.jpg", 
    clue: "m.wandi",
    reward: 80
  },
  // Level 11
  {
    answer: "sonitilil",
    image: "/games/tebak gambar/assets/img/level11.jpg", 
    clue: "sonitilil",
    reward: 80
  },
  // Level 12
  {
    answer: "amelia",
    image: "/games/tebak gambar/assets/img/level12.jpg", 
    clue: "amelia",
    reward: 150
  },
  // Level 13
  {
    answer: "bunda nuril",
    image: "/games/tebak gambar/assets/img/level13.jpg", 
    clue: "bunda nuril",
    reward: 70
  },
  // Level 14
  {
    answer: "misni",
    image: "/games/tebak gambar/assets/img/level14.jpg", 
    clue: "misni",
    reward: 80
  },
  // Level 15
  {
    answer: "risna",
    image: "/games/tebak gambar/assets/img/level15.jpg",
    clue: "risna",
    reward: 40
  },
  // Level 16
  {
    answer: "Tasikmalaya",
    image: "/games/tebak gambar/assets/img/level16.jpg", 
    clue: "Tasikmalaya",
    reward: 30
  },
  // Level 17
  {
    answer: "subang", 
    image: "/games/tebak gambar/assets/img/level17.jpg", 
    clue: "subang",
    reward: 30
  },
  // Level 18
  {
    answer: "jawa barat",
    image: "/games/tebak gambar/assets/img/level18.jpg", 
    clue: "jawa barat",
    reward: 50
  },
  // Level 19
  {
    answer: "23 tahun",
    image: "/games/tebak gambar/assets/img/level19.jpg", 
    clue: "23 tahun",
    reward: 30
  },
  // Level 20
  {
    answer: "kuningan",
    image: "/games/tebak gambar/assets/img/level20.jpg", 
    clue: "kuningan",
    reward: 50
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
  questionImage.src = levelData.image; 
  answerInput.value = ''; // Kosongkan input
  clueText.style.display = 'none'; // Sembunyikan petunjuk
  clueText.textContent = '';
}

function cekJawaban() {
  const levelData = levelsData[currentLevel];
  // Ambil jawaban, hapus spasi, dan jadikan huruf kecil untuk perbandingan yang adil
  const userAnswer = answerInput.value.trim().toLowerCase();
  
  // Jawaban harus Case-Insensitive (tidak peduli huruf besar/kecil)
  const isCorrect = userAnswer === levelData.answer.toLowerCase();

  if (isCorrect) {
    alert(`Jawaban Anda Benar! Anda mendapatkan ${levelData.reward} Koin!`);
    
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


// =================================
