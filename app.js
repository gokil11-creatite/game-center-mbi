// app.js - Logika utama aplikasi
// File ini bergantung pada inisialisasi Firebase (window.db, window.auth, window.userId)
// yang dilakukan di <script type="module"> pada index.html

const COIN_REWARD_AD = 50;
let userData = { points: 0, coins: 0 };
const scoreDocumentId = 'scores'; 

// Menggunakan variabel global yang diekspos oleh index.html
const getDoc = window.getDoc || function() {};
const setDoc = window.setDoc || function() {};
const updateDoc = window.updateDoc || function() {};
const doc = window.doc || function() {};
const onSnapshot = window.onSnapshot || function() {};
const Tone = window.Tone; // Tone.js sudah dimuat di index.html

const elements = {
    userPoints: document.getElementById('user-points'),
    userCoins: document.getElementById('user-coins'),
    adButton: document.getElementById('ad-btn'),
    startOverlay: document.getElementById('audio-start-overlay'),
    startButton: document.getElementById('start-audio-button'),
    gameCards: document.querySelectorAll('.game-card'),
    leaderboardBtn: document.getElementById('leaderboard-btn'),
    userInfo: document.getElementById('user-info')
};

// --- TONE.JS AUDIO SETUP ---
const buttonSynth = new Tone.PolySynth(Tone.Synth, {
    volume: -15, oscillator: { type: "sine" }, envelope: { attack: 0.005, decay: 0.05, sustain: 0.0, release: 0.05 }
}).toDestination();
function playButtonSound() {
    if (window.isMusicPlaying) buttonSynth.triggerAttackRelease("G5", "16n");
}

const coinSynth = new Tone.MembraneSynth({
    volume: -8, pitchDecay: 0.008, octaves: 2, envelope: { attack: 0.001, decay: 0.2, sustain: 0.05, release: 0.1 }
}).toDestination();
function playGetCoinSound() {
    if (window.isMusicPlaying) coinSynth.triggerAttackRelease(["C6", "E6", "G6"], "32n");
}

const bass = new Tone.Synth({ 
    volume: -12, oscillator: { type: 'sine' }, envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.5 }
}).toDestination();
const melody = new Tone.PolySynth(Tone.Synth, {
    volume: -15, oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 0.5 }
}).toDestination();
const sequence = [
    { time: '0:0', note: 'C3', synth: bass },
    { time: '0:2', note: 'G3', synth: melody },
    { time: '0:3', note: 'E3', synth: melody },
    { time: '1:0', note: 'F3', synth: bass },
    { time: '1:2', note: 'C4', synth: melody },
    { time: '2:0', note: 'G2', synth: bass },
    { time: '2:2', note: 'D4', synth: melody },
    { time: '3:0', note: 'C3', synth: bass },
    { time: '3:2', note: 'G3', synth: melody },
];
const part = new Tone.Part((time, value) => {
    value.synth.triggerAttackRelease(value.note, '4n', time);
}, sequence).start(0);
part.loop = true;
part.loopEnd = '4m'; 

function startGameAndAudio() {
    // Hilangkan Overlay
    elements.startOverlay.style.opacity = 0;
    setTimeout(() => { elements.startOverlay.style.display = 'none'; }, 500);

    // Mulai Tone.js Transport dan Musik
    if (!window.isMusicPlaying) {
        Tone.start(); 
        Tone.Transport.start();
        window.isMusicPlaying = true;
        console.log("Musik latar dimulai.");
    }
}


// --- FIRESTORE HELPERS ---
function getUserDocumentRef() {
    // Memastikan window.db dan window.appId sudah terset
    if (!window.db || !window.appId || !window.userId) return null;
    // Path: /artifacts/{appId}/users/{userId}/gameData/scores
    return doc(window.db, `artifacts/${window.appId}/users/${window.userId}/gameData/${scoreDocumentId}`);
}

// --- UI DAN GAME LOGIC ---

// Fungsi untuk Menampilkan Pesan Feedback (Custom Modal)
function displayMessage(message) {
    const modal = document.getElementById('custom-modal');
    const modalText = document.getElementById('modal-text');
    
    if (!modal || !modalText) return; 

    // Atur pesan dan tampilkan modal
    modalText.textContent = message;
    modal.style.display = 'flex';
}

// Fungsi untuk Memperbarui Tampilan UI dari state userData
function updateScoreDisplay() {
    elements.userPoints.textContent = userData.points.toLocaleString('id-ID');
    elements.userCoins.textContent = userData.coins.toLocaleString('id-ID');
    elements.userInfo.textContent = `ID Pengguna: ${window.userId || 'Anonim'}`;
}

// Listener Firestore untuk Memuat dan Mendengarkan Perubahan Data
function startScoreListener() {
    if (!window.db || !window.userId) {
        return console.error("Firestore belum siap. Menunggu Autentikasi...");
    }
    
    const docRef = getUserDocumentRef();
    if (!docRef) return;
    
    // Listen for changes
    onSnapshot(docRef, async (docSnap) => {
        if (!window.isAuthReady) return; 

        if (docSnap.exists()) {
            // Data ditemukan, perbarui state lokal
            const data = docSnap.data();
            userData.points = data.points || 0;
            userData.coins = data.coins || 0;
            console.log("Data Firestore dimuat/diperbarui:", userData);
        } else {
            // Dokumen belum ada, buat dokumen awal
            console.log("Dokumen skor belum ada. Membuat dokumen awal...");
            const initialData = { points: 0, coins: 100, last_login: new Date() };
            try {
                await setDoc(docRef, initialData);
                userData = initialData; // Update local state immediately
            } catch (e) {
                console.error("Gagal membuat dokumen awal:", e);
            }
        }
        
        // Update UI setelah data dimuat/diperbarui
        updateScoreDisplay();
    }, (error) => {
        console.error("Error mendengarkan dokumen skor:", error);
    });
}

// Fungsi Handler Tombol Tonton Iklan (Diadaptasi ke Firestore)
async function handleAdWatch(event) {
    event.preventDefault(); 
    playButtonSound(); 

    if (!window.userId || !window.db) {
        return displayMessage("Kesalahan: Autentikasi belum selesai. Coba lagi.");
    }

    try {
        const docRef = getUserDocumentRef();
        if (!docRef) return displayMessage("Kesalahan: Referensi dokumen tidak valid.");
        
        // Lakukan update atomik
        await updateDoc(docRef, {
            coins: userData.coins + COIN_REWARD_AD,
            points: userData.points + 5, // Tambah poin kecil juga
        });
        
        // onSnapshot akan secara otomatis memperbarui userData dan UI
        playGetCoinSound(); 
        displayMessage(`Selamat! Anda mendapatkan ${COIN_REWARD_AD} Koin baru. Total Koin Anda sekarang: ${userData.coins + COIN_REWARD_AD}`);

    } catch (error) {
        console.error("Error updating coin:", error);
        displayMessage("Terjadi kesalahan saat menyimpan koin Anda. Coba lagi nanti.");
    }
}

function handleGenericButtonClick(e) {
    e.preventDefault();
    playButtonSound(); 
    
    // Logika Game Card (Simulasi)
    if(e.currentTarget.classList.contains('game-card')) {
        const gameName = e.currentTarget.getAttribute('data-game');
        console.log(`Memulai game: ${gameName}`);
        displayMessage(`Anda akan memulai game: ${gameName.toUpperCase()}`);
    } else if (e.currentTarget.id === 'leaderboard-btn') {
        displayMessage("Fitur Papan Peringkat (Leaderboard) akan segera hadir!");
    }
}


// --- INISIALISASI APLIKASI UTAMA (Dipanggil dari index.html setelah Auth siap) ---
window.initAppLogic = function() {
    
    // 1. Mulai Listener Firestore
    startScoreListener();

    // 2. Tambahkan Event Listener
    elements.adButton.addEventListener('click', handleAdWatch);
    
    // Tambahkan event listener untuk Game Cards dan Leaderboard
    elements.leaderboardBtn.addEventListener('click', handleGenericButtonClick);
    elements.gameCards.forEach(card => {
        card.addEventListener('click', handleGenericButtonClick);
    });
    
    // Tambahkan listener untuk menutup modal
    const modal = document.getElementById('custom-modal');
    modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
    modal.querySelector('.modal-ok-button').onclick = () => modal.style.display = 'none';
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};

// Pasang listener pertama kali hanya pada tombol overlay untuk memulai audio
if (elements.startButton) {
    elements.startButton.addEventListener('click', startGameAndAudio, { once: true });
}
