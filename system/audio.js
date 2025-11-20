
const AudioSystem = {
    cache: {},

    exts: ["mp3", "wav", "ogg"],

    load: function (name, game = null) {
        const cacheKey = game ? `${game}-${name}` : name;
        if (this.cache[cacheKey]) return this.cache[cacheKey];

        let paths = [];

        // 1. Cari di folder game dulu
        if (game) {
            this.exts.forEach(ext => {
                paths.push(`../${game}/assets/sound/${name}.${ext}`);
            });
        }

        // 2. Kalau tidak ada → fallback ke sound global
        this.exts.forEach(ext => {
            paths.push(`../../assets/sound/common/${name}.${ext}`);
        });

        // Coba load satu-satu
        const audio = new Audio();
        audio.preload = "auto";

        for (let p of paths) {
            const test = new Audio();
            test.src = p;
            // otomatis pilih file pertama yang valid
            audio.src = p;
            break;
        }

        this.cache[cacheKey] = audio;
        return audio;
    },

    play: function (name, game = null) {
        const audio = this.load(name, game);
        const clone = audio.cloneNode(); // agar suara bisa overlap
        clone.play();
    },

    playBGM: function (name, game = null) {
        const bgm = this.load(name, game);
        bgm.loop = true;
        bgm.volume = 0.7;
        bgm.play();
        this.cache["bgm-playing"] = bgm;
    },

    stopBGM: function () {
        const bgm = this.cache["bgm-playing"];
        if (bgm) bgm.pause();
    }
};
