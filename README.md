🎮 MBI GAME CENTER: KOLEKSI KUISStatus Proyek: Sedang Dikembangkan (Fase Awal Implementasi Kuis)Proyek ini adalah Game Center berbasis web yang berfokus pada koleksi permainan kuis edukatif dan menghibur. Game Center ini dirancang untuk dapat diakses oleh komunitas MBI dan pengguna umum.🎯 FOKUS UTAMA PROYEKFokus pengembangan saat ini adalah implementasi 5 judul game kuis inti:QUIZ PINTAR: Kuis Pengetahuan Umum (Trivia) dengan pilihan ganda.Tebak-MBI: Kuis spesifik mengenai singkatan, tokoh, dan sejarah internal MBI.Tebak-kata: Game teka-teki menebak kata dari petunjuk.Tebak-Gambar: Game menebak objek dari visual yang dikaburkan/dipotong.Tebak-Dong: Kuis tentang cerita rakyat, legenda, dan dongeng.⚙️ TEKNOLOGI YANG DIGUNAKANKategoriTeknologiDeskripsiFrontendHTML5, CSS3, JavaScript (ES6+)Struktur, styling, dan logika utama game.StylingCustom CSSDesain yang responsif dan menarik.Data/BackendFirebase FirestoreDigunakan untuk menyimpan data pengguna (Poin, Koin) dan Leaderboard secara persisten.Data KuisJSONFile .json digunakan untuk menyimpan pertanyaan dan jawaban setiap level secara terstruktur.📁 STRUKTUR REPOSITORYStruktur proyek dirancang modular untuk setiap jenis game:.
├── assets/
│   └── images/             # Gambar, logo, dan ikon game
├── QUIZ-PINTAR/            # Folder untuk Game Kuis Pintar
│   ├── data/
│   │   └── level-1.json    # Contoh data kuis (sudah dibuat!)
│   ├── index.html          # Tampilan game QUIZ PINTAR
│   └── quiz.js             # Logika game QUIZ PINTAR
├── Tebak-MBI/              # Folder untuk Game Tebak-MBI
├── Tebak-kata/             # Folder untuk Game Tebak-kata
├── Tebak-Gambar/           # Folder untuk Game Tebak-Gambar
├── Tebak-Dong/             # Folder untuk Game Tebak-Dong
├── index.html              # Landing Page (Menu Utama)
├── app.js                  # Logika Firebase, Poin & Koin Global
├── style.css               # Styling untuk Landing Page
└── README.md               # File ini!
🚀 CARA MENJALANKAN LOKAL (Development)Untuk menjalankan Game Center ini di komputer Anda:Clone Repository:git clone [LINK REPOSITORY ANDA]
cd game-center-mbi
Buka di Browser:Cukup buka file index.html menggunakan browser modern (Chrome, Firefox, dll.).Catatan Penting (Firebase):Karena app.js menggunakan Firebase Firestore, proyek ini dimaksudkan untuk dijalankan di lingkungan yang menyediakan token autentikasi khusus (seperti platform Canvas). Jika Anda menjalankannya secara lokal, Anda mungkin melihat pesan kesalahan di konsol tentang Firebase, tetapi game kuis (setelah kita selesaikan) yang hanya membaca data JSON harus tetap berfungsi.🤝 KONTRIBUSIKami menyambut kontribusi! Jika Anda ingin menambahkan level baru, memperbaiki bug, atau menyarankan fitur baru, silakan buka Issue atau kirimkan Pull Request.© 2025 MBI Game Center
