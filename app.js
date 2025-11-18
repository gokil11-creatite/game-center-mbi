// Global Variables untuk Firebase (WAJIB ADA di Canvas Environment)
// const __app_id = 'your-app-id'; 
// const __firebase_config = '{"apiKey": "...", "authDomain": "...", ...}'; 
// const __initial_auth_token = '...'; 

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    onSnapshot, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Ambil variabel global
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let db;
let auth;
let userId = null;
let userData = {
    points: 0,
    coins: 1000
};
let isAuthReady = false;

// Elemen DOM
const userPointsElement = document.getElementById('user-points');
const userCoinsElement = document.getElementById('user-coins');

// Path Firestore untuk data pribadi pengguna
const getUserDocRef = (uid) => {
    // Penyimpanan data private: /artifacts/{appId}/users/{userId}/data/stats
    return doc(db, 'artifacts', appId, 'users', uid, 'data', 'stats');
};

/**
 * Inisialisasi Firebase dan Autentikasi Pengguna.
 */
async function initializeFirebase() {
    if (!firebaseConfig) {
        console.error("Firebase config tidak ditemukan.");
        return;
    }

    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // 1. Lakukan autentikasi
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            // Jika token kustom tidak ada, login secara anonim
            await signInAnonymously(auth);
        }

        // 2. Set listener perubahan status autentikasi
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                console.log("Pengguna terautentikasi. UID:", userId);
                isAuthReady = true;
                setupDataListener(userId);
            } else {
                console.log("Pengguna belum terautentikasi.");
                // Jika user keluar (seharusnya tidak terjadi di lingkungan Canvas), 
                // kita bisa menggunakan ID anonim untuk penyimpanan lokal sementara.
                userId = crypto.randomUUID(); 
                isAuthReady = true;
                // Tampilkan data default jika tidak terautentikasi ke Firestore
                updateStatsDisplay();
            }
        });

    } catch (error) {
        console.error("Gagal menginisialisasi Firebase atau Autentikasi:", error);
    }
}

/**
 * Mengatur listener real-time untuk data Poin/Koin pengguna.
 */
function setupDataListener(uid) {
    const userDocRef = getUserDocRef(uid);

    // Ambil data sekali, jika tidak ada, buat dokumen baru
    getDoc(userDocRef).then(docSnapshot => {
        if (!docSnapshot.exists()) {
            console.log("Dokumen pengguna tidak ditemukan, membuat dokumen baru.");
            saveUserData(userData.points, userData.coins);
        }
    }).catch(e => console.error("Error cek dokumen:", e));


    // Listener real-time
    onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            // Update data lokal
            userData.points = data.points || 0;
            userData.coins = data.coins || 1000; 
            console.log("Data pengguna diperbarui:", userData);
        } else {
            console.warn("Dokumen stats pengguna tidak ditemukan setelah listener aktif.");
        }
        updateStatsDisplay();
    }, (error) => {
        console.error("Gagal mendengarkan update data Firestore:", error);
    });
}

/**
 * Menyimpan Poin dan Koin ke Firestore.
 * @param {number} points 
 * @param {number} coins 
 */
export async function saveUserData(points, coins) {
    if (!isAuthReady || !db || !userId) {
        console.warn("Firebase atau Autentikasi belum siap untuk menyimpan data.");
        return;
    }
    
    // Update data lokal terlebih dahulu
    userData.points = points;
    userData.coins = coins;
    
    const userDocRef = getUserDocRef(userId);
    try {
        // Menggunakan setDoc dengan merge: true agar tidak menimpa field lain jika ada
        await setDoc(userDocRef, {
            points: points,
            coins: coins
        }, { merge: true });
        console.log("Data Poin/Koin berhasil disimpan.");
    } catch (e) {
        console.error("Error menyimpan data pengguna:", e);
    }
}

/**
 * Memperbarui tampilan Poin dan Koin di UI.
 */
function updateStatsDisplay() {
    userPointsElement.textContent = userData.points;
    userCoinsElement.textContent = userData.coins;
}

/**
 * Fungsi untuk tombol "Tonton Iklan (+50 Koin)"
 * Fungsi ini harus diekspor karena dipanggil dari onclick di index.html.
 */
window.tontonIklan = async function() {
    if (!isAuthReady || !userId) {
        console.warn("Sistem belum siap. Coba lagi.");
        return;
    }

    const newCoins = userData.coins + 50;
    
    // Simpan data baru ke Firestore
    await saveUserData(userData.points, newCoins);
    
    // Tampilkan pesan umpan balik (Gunakan modal UI, bukan alert())
    showFeedbackModal("Iklan berhasil ditonton!", `Anda mendapatkan 50 Koin baru. Total Koin Anda: ${newCoins}.`);
};

/**
 * Fungsi Placeholder untuk Modal Umpan Balik (Mengganti alert())
 */
function showFeedbackModal(title, message) {
    // Karena kita tidak bisa membuat modal UI di sini, 
    // kita akan menggunakan console.log dan sedikit modifikasi DOM sebagai placeholder.
    console.log(`[MODAL] ${title}: ${message}`);
    
    const feedbackDiv = document.createElement('div');
    feedbackDiv.style.cssText = `
        position: fixed; top: 10px; right: 10px; background-color: #007bff; color: white;
        padding: 10px 15px; border-radius: 5px; z-index: 1000; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        animation: fadeinout 4s forwards;
    `;
    feedbackDiv.innerHTML = `<strong>${title}</strong><br>${message}`;
    document.body.appendChild(feedbackDiv);
    
    // Hapus feedback setelah 4 detik
    setTimeout(() => feedbackDiv.remove(), 4000);
}

// Inisialisasi
initializeFirebase();
