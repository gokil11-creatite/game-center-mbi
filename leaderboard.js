// --- 1. IMPOR FIREBASE DAN KONFIGURASI ---

// Import koneksi database (db) dari file konfigurasi
import { db } from './server/firebase_config.js'; 
import { collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- 2. FUNGSI UTAMA ---

/**
 * Mengambil dan menampilkan data leaderboard dari Firebase
 * @param {string} gameId - ID game yang ingin ditampilkan (misal: 'matematika-ninja')
 */
async function fetchLeaderboard(gameId, leaderboardListElement) {
    if (!leaderboardListElement) return;
    leaderboardListElement.innerHTML = '<li>Memuat data peringkat...</li>';
    
    try {
        const q = query(
            collection(db, "leaderboard"),
            where("gameId", "==", gameId),
            orderBy("score", "desc"),
            limit(10)
        );

        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            leaderboardListElement.innerHTML = '<li>Belum ada skor yang dicatat untuk game ini.</li>';
            return;
        }

        leaderboardListElement.innerHTML = ''; // Kosongkan list sebelum diisi
        let rank = 1;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.className = 'leaderboard-item';
            
            listItem.innerHTML = `
                <span class="rank">${rank}.</span>
                <span class="player-id">${data.playerId}</span>
                <span class="score-value">${data.score} Poin</span>
            `;
            leaderboardListElement.appendChild(listItem);
            rank++;
        });

    } catch (error) {
        console.error("Error mengambil leaderboard:", error);
        leaderboardListElement.innerHTML = '<li>Error memuat data peringkat dari server.</li>';
    }
}

// --- 3. EKSEKUSI DAN EVENT LISTENERS (tunggu DOM siap) ---
document.addEventListener('DOMContentLoaded', () => {
    const leaderboardList = document.getElementById('leaderboard-list');
    const gameFilter = document.getElementById('game-filter');

    if (!leaderboardList || !gameFilter) {
        console.warn('Elemen leaderboard tidak ditemukan di DOM.');
        return;
    }

    // Event Listener untuk filter game (saat pemain memilih game lain di dropdown)
    gameFilter.addEventListener('change', (e) => {
        fetchLeaderboard(e.target.value, leaderboardList);
    });

    // Ambil leaderboard default (berdasarkan nilai awal filter)
    fetchLeaderboard(gameFilter.value, leaderboardList);
});
