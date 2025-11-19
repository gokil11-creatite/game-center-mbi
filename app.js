// URL: app.js

// Konstanta
const COIN_REWARD_AD = 50;

// Variabel State (Poin dan Koin)
// Kita gunakan localStorage agar poin tidak hilang saat browser ditutup
let userPoints = parseInt(localStorage.getItem('mbi_points')) || 0;
let userCoins = parseInt(localStorage.getItem('mbi_coins')) || 0;

// --- Fungsi untuk Memperbarui Tampilan ---
function updateScoreDisplay() {
    // Ambil elemen HTML yang menampilkan skor
    const pointDisplay = document.querySelector('.score-item:nth-child(1) .score-value');
    const coinDisplay = document.querySelector('.score-item:nth-child(2) .score-value');
    
    // Perbarui teks dengan nilai terbaru
    if (pointDisplay) {
        pointDisplay.textContent = userPoints;
    }
    if (coinDisplay) {
        coinDisplay.textContent = userCoins;
    }
}

// --- Fungsi Handler Tombol Tonton Iklan ---
function handleAdWatch(event) {
    event.preventDefault(); // Mencegah tautan (a) pindah halaman

    // 1. Tambahkan Koin
    userCoins += COIN_REWARD_AD;
    
    // 2. Simpan ke Local Storage
    localStorage.setItem('mbi_coins', userCoins);
    
    // 3. Perbarui Tampilan
    updateScoreDisplay();

    // 4. Beri Feedback ke User (menggantikan alert() yang dilarang)
    displayMessage(`Selamat! Anda mendapatkan ${COIN_REWARD_AD} Koin baru. Total Koin Anda: ${userCoins}`);
}

// --- Fungsi untuk Menampilkan Pesan Feedback (Custom Modal) ---
function displayMessage(message) {
    // Cek apakah modal sudah ada
    let modal = document.getElementById('custom-modal');
    
    if (!modal) {
        // Jika belum ada, buat elemen modal
        modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <p id="modal-text"></p>
                <button class="modal-ok-button">OK</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Tambahkan event listener untuk menutup modal
        modal.querySelector('.close-button').onclick = () => modal.style.display = 'none';
        modal.querySelector('.modal-ok-button').onclick = () => modal.style.display = 'none';
        
        // Klik di luar modal juga menutupnya
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // Atur pesan dan tampilkan modal
    document.getElementById('modal-text').textContent = message;
    modal.style.display = 'flex';
}


// --- Inisialisasi Aplikasi ---
function initApp() {
    // 1. Perbarui tampilan skor saat aplikasi dimuat
    updateScoreDisplay();

    // 2. Tambahkan Event Listener ke Tombol 'Tonton Iklan'
    const adButton = document.querySelector('.ad-button');
    if (adButton) {
        adButton.addEventListener('click', handleAdWatch);
    }
    
    // 3. Tambahkan styling untuk Custom Modal (karena ini file JS)
    // Dalam proyek nyata, ini seharusnya ada di style.css
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .custom-modal {
                display: none; 
                position: fixed; 
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto; 
                background-color: rgba(0,0,0,0.7); 
                justify-content: center;
                align-items: center;
            }
            .modal-content {
                background-color: #333;
                margin: auto;
                padding: 30px;
                border: 1px solid #888;
                width: 80%;
                max-width: 400px;
                border-radius: 10px;
                text-align: center;
                position: relative;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
            }
            .close-button {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                position: absolute;
                top: 10px;
                right: 15px;
                cursor: pointer;
            }
            .close-button:hover,
            .close-button:focus {
                color: white;
                text-decoration: none;
                cursor: pointer;
            }
            #modal-text {
                margin-bottom: 20px;
                font-size: 16px;
                color: white;
            }
            .modal-ok-button {
                background-color: #ffd700;
                color: black;
                border: none;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 5px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
}

// Jalankan fungsi inisialisasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', initApp);
```
eof

### 🔗 Langkah Selanjutnya (Kaitkan dengan `index.html`)

Agar `app.js` ini berjalan, Anda harus menghubungkannya ke `index.html` yang sudah Anda salin.

Silakan buka file **`index.html`** Anda, dan tambahkan baris ini tepat sebelum tag penutup `</body>`:

```html
    <!-- ... konten body ... -->
    
    <!-- PENTING: Tautan ke file JavaScript Anda -->
    <script src="app.js"></script> 
</body>
</html>
