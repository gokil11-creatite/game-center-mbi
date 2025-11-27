// --- 1. IMPOR FIREBASE DAN KONFIGURASI ---

// Impor koneksi database dan fungsi Firestore yang diperlukan
// Pastikan path ke firebase_config.js sudah benar.
import { db } from './server/firebase_config.js'; 
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


// --- 2. VARIABEL GLOBAL & ELEMEN HTML ---

let userPoints = 0; 
let userCoins = 0; 
let isSoundOn = true; 
const PLAYER_ID = "MBI_TestUser_1"; // ID Pemain sementara (Ganti dengan Auth/Login nanti)
const userDocRef = doc(db, "users", PLAYER_ID); // Referensi ke dokumen pemain di Firestore

// Elemen HTML
const coinCountElement = document.getElementById('coin-count');
const pointCountElement = document.getElementById('point-count');
const soundToggleButton = document.getElementById('sound-toggle-btn');
const adRewardButton = document.getElementById('ad-reward-btn');
const gameCards = document.querySelectorAll('.game-card');


// --- 3. FUNGSI FIREBASE (I/O Database) ---

/**
 * Memperbarui tampilan Poin dan Koin di halaman
 */
function updateStatsDisplay() {
    coinCountElement.textContent = userCoins;
    pointCountElement.textContent = userPoints;
}

/**
 * Memuat Poin dan Koin dari Firebase saat landing page dimuat
 */
async function loadUserData() {
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            userCoins = data.coins || 0; 
            userPoints = data.points || 0;
            updateStatsDisplay();
            console.log("Data pemain dimuat dari Firebase.");
        } else {
            // Jika user baru, buat data awal di Firebase (500 Poin, 100 Koin)
            await updateUserData(500, 100); 
            console.log("Pemain baru, data awal dibuat di Firebase.");
        }
    } catch (e) {
        console.error("Error memuat data Firebase:", e);
    }
}

/**
 * Menyimpan Poin dan Koin ke Firebase
 */
async function updateUserData(newPoints, newCoins) {
    try {
        await updateDoc(userDocRef, {
            points: newPoints,
            coins: newCoins
        }, { merge: true }); 
        userPoints = newPoints;
        userCoins = newCoins;
        updateStatsDisplay();
    } catch (e) {
        console.error("Error menyimpan data Firebase:", e);
    }
}


// --- 4. LOGIKA TOMBOL UTILITY ---

/**
 * Mengalihkan status suara (Sound On/Off)
 */
function toggleSound() {
    isSoundOn = !isSoundOn; 
    soundToggleButton.textContent = isSoundOn ? '' : '';
    console.log('Sound:', isSoundOn ? 'ON' : 'OFF');
    // Logika memutar/menghentikan musik latar diletakkan di sini
}

/**
 * Simulasi Tonton Iklan (Reward Ad)
 */
async function watchRewardAd() {
    adRewardButton.disabled = true; // Nonaktifkan tombol saat proses
    adRewardButton.textContent = 'Memuat Iklan...';
    
    // Simulasi jeda 3 detik untuk iklan
    setTimeout(async () => {
        const rewardAmount = 10;
        
        // Update Koin secara permanen di Firebase
        await updateUserData(userPoints, userCoins + rewardAmount); 
        
        alert(`Selamat! Anda mendapatkan ${rewardAmount} Koin.`);
        adRewardButton.textContent = 'Tonton Iklan (Dapatkan Koin)';
        adRewardButton.disabled = false;
    }, 3000); 
}


// --- 5. LOGIKA NAVIGASI GAME CARD ---

/**
 * Fungsi Navigasi: Mengarahkan pemain ke folder game yang dipilih
 */
function navigateToGame(matematika-ninja) {
    if (isSoundOn) {
        // Tambahkan kode untuk memutar sound effect klik di sini
    }
    const repoName = "game-center-mbi";
    // Mengalihkan ke file HTML yang berada di sub-folder game/
    window.location.href = `game-center-mbi/games/matematika-ninja/matematika-ninja.html`;
    console.log(`Mengalihkan ke game: (matematika-ninja`);
}


// --- 6. EKSEKUSI (Saat Halaman Dimuat) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // A. Muat data Poin/Koin dari Firebase
    loadUserData();

    // B. Setup Event Listener untuk Tombol Utilitas
    soundToggleButton.addEventListener('click', toggleSound);
    adRewardButton.addEventListener('click', watchRewardAd);
    
    // C. Setup Event Listener untuk Game Cards
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            // Mengambil ID Game dari ID Card (misal: 'card-matematika-ninja' menjadi 'matematika-ninja')
            const gameId = card.id.replace('card-', ''); 
            navigateToGame(gameId);
        });
    });

});
