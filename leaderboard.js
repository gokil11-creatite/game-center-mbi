// --- 1. IMPOR FIREBASE DAN KONFIGURASI ---

// Import koneksi database (db) dari file konfigurasi
import { db } from './server/firebase_config.js'; 
import { collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- 2. ELEMEN HTML ---

const leaderboardList = document.getElementById('leaderboard-list');
const gameFilter = document.getElementById('game-filter');


// --- 3. FUNGSI UTAMA ---

/**
 * Mengambil dan menampilkan data leaderboard dari Firebase
 * @param {string} gameId - ID game yang ingin ditampilkan (misal: 'matematika-ninja')
 */
async function fetchLeaderboard(gameId) {
    leaderboardList.innerHTML = '<li>Memuat data peringkat...</li>';
    
    try {
        // Membuat Query ke Firestore:
        // 1. Target: collection 'leaderboard'
        // 2. Filter: where gameId == gameId yang dipilih
        // 3. Urutkan: orderBy score descending (tertinggi di atas)
        // 4. Batas: limit 10 (hanya 10 teratas)
        const q = query(
            collection(db, "leaderboard"),
            where("gameId", "==", gameId),
            orderBy("score", "desc"),
            limit(10)
        );

        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            leaderboardList.innerHTML = '<li>Belum ada skor yang dicatat untuk game ini.</li>';
            return;
        }

        leaderboardList.innerHTML = ''; // Kosongkan list sebelum diisi
        let rank = 1;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.className = 'leaderboard-item';
            
            // Perhatikan bahwa data.playerId saat ini adalah 'MBI_TestUser_1'
            // Nanti akan menampilkan nama asli pemain setelah sistem login/auth dibuat.
            listItem.innerHTML = `
                <span class="rank">${rank}.</span>
                <span class="player-id">${data.playerId}</span>
                <span class="score-value">${data.score} Poin</span>
            `;
            leaderboardList.appendChild(listItem);
            rank++;
        });

    } catch (error) {
        console.error("Error mengambil leaderboard:", error);
        leaderboardList.innerHTML = '<li>Error memuat data peringkat dari server.</li>';
    }
}


// --- 4. EKSEKUSI DAN EVENT LISTENERS ---

// Event Listener untuk filter game (saat pemain memilih game lain di dropdown)
gameFilter.addEventListener('change', (e) => {
    fetchLeaderboard(e.target.value);
});

// Panggil fungsi saat halaman leaderboard dimuat pertama kali
document.addEventListener('DOMContentLoaded', () => {
    // Ambil leaderboard default (berdasarkan nilai awal filter, yaitu matematika-ninja)
    fetchLeaderboard(gameFilter.value); 
});