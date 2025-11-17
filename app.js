// INISIALISASI POIN DAN KOIN (Menggunakan LocalStorage agar data tersimpan)
let userPoints = parseInt(localStorage.getItem('mbiPoints')) || 0;
let userCoins = parseInt(localStorage.getItem('mbiCoins')) || 1000; // Beri 1000 Koin Awal

const pointsDisplay = document.getElementById('user-points');
const coinsDisplay = document.getElementById('user-coins');

function updateStatsDisplay() {
    pointsDisplay.textContent = userPoints;
    coinsDisplay.textContent = userCoins;
}

// FUNGSI UNTUK MENAMBAH POIN/KOIN
function addPoints(amount) {
    userPoints += amount;
    localStorage.setItem('mbiPoints', userPoints);
    updateStatsDisplay();
}

function addCoins(amount) {
    userCoins += amount;
    localStorage.setItem('mbiCoins', userCoins);
    updateStatsDisplay();
}

function spendCoins(amount) {
    if (userCoins >= amount) {
        userCoins -= amount;
        localStorage.setItem('mbiCoins', userCoins);
        updateStatsDisplay();
        return true; // Berhasil menghabiskan koin
    } else {
        alert("Koin Anda tidak cukup!");
        return false; // Gagal
    }
}

// FUNGSI SIMULASI IKLaN (Memberi koin)
function tontonIklan() {
    // Di aplikasi nyata, ini adalah tempat di mana Iklan Video akan dimainkan
    
    // Simulasi: Iklan selesai, dapat 50 Koin
    const reward = 50;
    addCoins(reward);
    
    alert(`Terima kasih sudah menonton iklan! Anda mendapat ${reward} Koin!`);
}

// FUNGSI INTI (Dipanggil saat halaman dimuat)
document.addEventListener('DOMContentLoaded', () => {
    updateStatsDisplay();
    // Di masa depan, di sini Anda bisa menambahkan logika pengecekan login, dll.
});
