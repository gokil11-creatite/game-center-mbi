// --- 1. IMPORT FIREBASE DAN KONFIGURASI ---

// Pastikan ./server/firebase_config.js mengekspor `db`
import { db } from './server/firebase_config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- 2. VARIABEL GLOBAL & ELEMEN HTML (elemen akan diambil setelah DOM siap) ---

let userPoints = 0;
let userCoins = 0;
let isSoundOn = true;
const PLAYER_ID = "MBI_TestUser_1"; // ID Pemain sementara (Ganti dengan Auth/Login nanti)
const userDocRef = doc(db, "users", PLAYER_ID); // Referensi ke dokumen pemain di Firestore

// Elemen DOM akan di-set pada DOMContentLoaded agar tidak null
let coinCountElement = null;
let pointCountElement = null;
let soundToggleButton = null;
let adRewardButton = null;
let gameCards = null;

// --- 3. FUNGSI FIREBASE (I/O Database) ---

/**
 * Memperbarui tampilan Poin dan Koin di halaman (aman jika elemen belum ada)
 */
function updateStatsDisplay() {
    if (coinCountElement) coinCountElement.textContent = userCoins;
    if (pointCountElement) pointCountElement.textContent = userPoints;
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
 * Menggunakan setDoc dengan merge agar dapat membuat dokumen jika belum ada.
 */
async function updateUserData(newPoints, newCoins) {
    try {
        await setDoc(userDocRef, {
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
    if (soundToggleButton) soundToggleButton.textContent = isSoundOn ? '🔊' : '🔇';
    console.log('Sound:', isSoundOn ? 'ON' : 'OFF');
    // Logika memutar/menghentikan musik latar diletakkan di sini
}

/**
 * Simulasi Tonton Iklan (Reward Ad)
 */
async function watchRewardAd() {
    if (!adRewardButton) return;
    adRewardButton.disabled = true; // Nonaktifkan tombol saat proses
    const originalText = adRewardButton.textContent;
    adRewardButton.textContent = 'Memuat Iklan...';

    // Simulasi jeda 3 detik untuk iklan
    setTimeout(async () => {
        const rewardAmount = 10;

        // Update Koin secara permanen di Firebase
        await updateUserData(userPoints, userCoins + rewardAmount);

        alert(`Selamat! Anda mendapatkan ${rewardAmount} Koin.`);
        adRewardButton.textContent = originalText || 'Tonton Iklan (Dapatkan Koin)';
        adRewardButton.disabled = false;
    }, 3000);
}

// --- 5. LOGIKA NAVIGASI GAME CARD (FIX UNTUK GITHUB PAGES) ---

/**
 * Fungsi Navigasi: Mengarahkan pemain ke folder game yang dipilih
 * Menggunakan jalur relatif agar bekerja pada lokal dan GitHub Pages.
 */
function navigateToGame(gameId) {
    if (!gameId) return;
    if (isSoundOn) {
        // Tambahkan kode untuk memutar sound effect klik di sini
    }

    const safeId = encodeURIComponent(gameId);
    const targetPath = `./game/${safeId}/${safeId}.html`;
    window.location.href = targetPath;

    console.log(`Mengalihkan ke game: ${gameId} -> ${targetPath}`);
}

// --- 6. EKSEKUSI (Saat Halaman Dimuat) ---

document.addEventListener('DOMContentLoaded', () => {

    // Ambil elemen DOM setelah DOM siap
    coinCountElement = document.getElementById('coin-count');
    pointCountElement = document.getElementById('point-count');
    soundToggleButton = document.getElementById('sound-toggle-btn');
    adRewardButton = document.getElementById('ad-reward-btn');
    gameCards = document.querySelectorAll('.game-card');

    // A. Muat data Poin/Koin dari Firebase
    loadUserData();

    // B. Setup Event Listener untuk Tombol Utilitas
    if (soundToggleButton) soundToggleButton.addEventListener('click', toggleSound);
    if (adRewardButton) adRewardButton.addEventListener('click', watchRewardAd);

    // C. Setup Event Listener untuk Game Cards
    if (gameCards && gameCards.length > 0) {
        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.id ? card.id.replace('card-', '') : '';
                navigateToGame(gameId);
            });
        });
    }
});
