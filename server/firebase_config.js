// --- 1. IMPOR MODUL FIREBASE ---

// Mengimpor modul-modul Firebase yang diperlukan dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// Catatan: Kami menggunakan versi 9.6.1 karena kompatibilitas impor modul browser yang sederhana.

// --- 2. KONFIGURASI PROYEK ANDA ---

// Data konfigurasi unik untuk proyek Firebase Anda (deny-b292c)
const firebaseConfig = {
    apiKey: "AIzaSyBu-xUnlIIOLQe1bD4C6ywXrMVzi6KFm6Q",
    authDomain: "deny-b292c.firebaseapp.com",
    projectId: "deny-b292c",
    storageBucket: "deny-b292c.firebasestorage.app",
    messagingSenderId: "764638273940",
    appId: "1:764638273940:web:db43e380a605170c086f81",
    measurementId: "G-P5L9P9WGPW"
};

// --- 3. INISIALISASI DAN EKSPOR ---

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore (Database)
// Objek 'db' ini yang akan diimpor dan digunakan oleh script.js, leaderboard.js, dll.
export const db = getFirestore(app);

console.log("Firebase Database Terkoneksi dengan proyek 'deny-b292c'.");
