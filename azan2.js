// Azan audio files for different Qaris and prayer times
const qaris = {
    "Abdul Basit": {
        id: "abdul-basit",
        fajr: './audio/adhans/abdul-basit/fajr.mp3',
        other: './audio/adhans/abdul-basit/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/abdul-basit/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/abdul-basit/normal.mp3'
        }
    },
    "Al-Minshawi": {
        id: "minshawi",
        fajr: './audio/adhans/al-minshawi/fajr.mp3',
        other: './audio/adhans/al-minshawi/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/minshawi/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/minshawi/normal.mp3'
        }
    },
    "Al-Ghamdi": {
        id: "ghamdi",
        fajr: './audio/adhans/al-ghamdi/fajr.mp3',
        other: './audio/adhans/al-ghamdi/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/ghamdi/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/ghamdi/normal.mp3'
        }
    },
    "Al-Hussary": {
        id: "hussary",
        fajr: './audio/adhans/al-hussary/fajr.mp3',
        other: './audio/adhans/al-hussary/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/hussary/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/hussary/normal.mp3'
        }
    },
    "Mishary Rashid": {
        id: "mishary",
        fajr: './audio/adhans/mishary-rashid/fajr.mp3',
        other: './audio/adhans/mishary-rashid/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/mishary-rashid/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/mishary-rashid/normal.mp3'
        }
    },
    "Ali Ahmad Mulla": {
        id: "mulla",
        fajr: './audio/adhans/ali-ahmad-mulla/fajr.mp3',
        other: './audio/adhans/ali-ahmad-mulla/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/mulla/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/mulla/normal.mp3'
        }
    },
    "Muhammad Al-Muaiqly": {
        id: "muaiqly",
        fajr: './audio/adhans/muaiqly/fajr.mp3',
        other: './audio/adhans/muaiqly/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/muaiqly/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/muaiqly/normal.mp3'
        }
    },
    "Masjid Al-Haram": {
        id: "makkah",
        fajr: './audio/adhans/makkah/fajr.mp3',
        other: './audio/adhans/makkah/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/makkah/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/makkah/normal.mp3'
        }
    },
    "Masjid An-Nabawi": {
        id: "madina",
        fajr: './audio/adhans/madina/fajr.mp3',
        other: './audio/adhans/madina/normal.mp3',
        backup: {
            fajr: 'https://cdn.islamic.network/adhans/madina/fajr.mp3',
            other: 'https://cdn.islamic.network/adhans/madina/normal.mp3'
        }
    },
    "Yusuf Islam": {
        id: "yusuf",
        fajr: 'https://cdn.islamic.network/adhans/yusuf/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/yusuf/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Yusuf-Islam/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Yusuf-Islam/128/azan2.mp3'
        }
    },
    "Sheikh Essam": {
        id: "essam",
        fajr: 'https://cdn.islamic.network/adhans/essam/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/essam/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Sheikh-Essam-Bukhari/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Sheikh-Essam-Bukhari/128/azan2.mp3'
        }
    },
    "Ibrahim Al-Arkani": {
        id: "arkani",
        fajr: 'https://cdn.islamic.network/adhans/arkani/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/arkani/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Ibrahim-Al-Arkani/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Ibrahim-Al-Arkani/128/azan2.mp3'
        }
    },
    "Abdul Rahman Al-Sudais": {
        id: "sudais",
        fajr: 'https://cdn.islamic.network/adhans/sudais/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/sudais/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdul-Rahman-As-Sudais/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdul-Rahman-As-Sudais/128/azan2.mp3'
        }
    },
    "Nasser Al-Qatami": {
        id: "qatami",
        fajr: 'https://cdn.islamic.network/adhans/qatami/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/qatami/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Nasser-Al-Qatami/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Nasser-Al-Qatami/128/azan2.mp3'
        }
    },
    "Abdullah Al-Matrood": {
        id: "matrood",
        fajr: 'https://cdn.islamic.network/adhans/matrood/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/matrood/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdullah-Al-Matrood/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdullah-Al-Matrood/128/azan2.mp3'
        }
    },
    "Abdullah Al-Johany": {
        id: "johany",
        fajr: 'https://cdn.islamic.network/adhans/johany/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/johany/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdullah-Al-Johany/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdullah-Al-Johany/128/azan2.mp3'
        }
    }
};

// Global variables
let currentQari = localStorage.getItem('selectedQari') || "Mishary Rashid";
let scheduledAzans = [];
let audioContext = null;
let currentAudio = null;

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const BACKUP_AUDIO_SOURCES = {
    DEFAULT_AZAN: "./audio/adhans/default-azan.mp3",
    BEEP: "./audio/adhans/beep.mp3",
    CDN_BASE: "https://cdn.islamic.network/adhans/",
    GITHUB_BASE: "https://raw.githubusercontent.com/islamic-network/azan-files/master/"
};

async function fetchWithFallback(primaryUrl, backupUrl) {
    const sources = [
        { url: primaryUrl, useProxy: false },
        { url: BACKUP_AUDIO_SOURCES.DEFAULT_AZAN, useProxy: false },
        { url: backupUrl, useProxy: false },
        { url: primaryUrl, useProxy: true },
        { url: backupUrl, useProxy: true }
    ];

    let lastError = null;

    for (const source of sources) {
        try {
            const url = source.useProxy ? CORS_PROXY + source.url : source.url;
            console.log("Trying audio source:", url);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength === 0) throw new Error("Empty audio file");
            
            console.log("Successfully loaded audio from:", url);
            return arrayBuffer;
        } catch (error) {
            console.log(`Failed to load audio from ${source.url}:`, error);
            lastError = error;
            continue;
        }
    }

    // If all sources fail, try the default azan as last resort
    try {
        console.log("All sources failed, using default azan");
        const response = await fetch(BACKUP_AUDIO_SOURCES.DEFAULT_AZAN);
        if (!response.ok) throw new Error('Default azan not found');
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) throw new Error("Empty audio file");
        return arrayBuffer;
    } catch (error) {
        console.error("Failed to load default azan:", error);
        throw new Error(`All audio sources failed. Last error: ${lastError.message}`);
    }
}

const AzanPlayer = {
    initAudioContext() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log("AudioContext initialized");
            }
            
            if (audioContext.state === "suspended") {
                audioContext.resume().then(() => console.log("AudioContext resumed"));
            }
        } catch (error) {
            console.error("Error initializing AudioContext:", error);
            throw new Error("Failed to initialize audio system");
        }
    },

    async preloadAudio(url, backupUrl) {
        try {
            this.initAudioContext();
            console.log("Preloading audio from:", url);
            
            const arrayBuffer = await fetchWithFallback(url, backupUrl);
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Validate audio buffer
            if (!audioBuffer || audioBuffer.duration === 0) {
                throw new Error("Invalid audio data");
            }
            
            return audioBuffer;
        } catch (error) {
            console.error("Error preloading audio:", error);
            throw error;
        }
    },

    async playAzan(qariName, type = "other") {
        try {
            this.initAudioContext();
            
            // Stop any currently playing audio
            if (currentAudio) {
                currentAudio.stop();
                currentAudio.disconnect();
                currentAudio = null;
            }

            const qari = qaris[qariName];
            if (!qari) throw new Error(`Invalid Qari: ${qariName}`);

            const primaryUrl = type === "fajr" ? qari.fajr : qari.other;
            const backupUrl = type === "fajr" ? qari.backup.fajr : qari.backup.other;

            console.log("Playing Azan from:", primaryUrl);
            console.log("Backup URL:", backupUrl);

            // Create audio nodes
            const audioBuffer = await this.preloadAudio(primaryUrl, backupUrl);
            const source = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();

            // Connect nodes
            source.buffer = audioBuffer;
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Fade in
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.5);

            currentAudio = source;

            // Play beep sound before Azan
            await this.playBeep();

            source.start(0);

            return new Promise((resolve) => {
                source.onended = () => {
                    // Fade out
                    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
                    setTimeout(() => {
                        source.disconnect();
                        gainNode.disconnect();
                        currentAudio = null;
                        resolve();
                    }, 500);
                };
            });
        } catch (error) {
            console.error("Error playing Azan:", error);
            alert("Failed to play Azan. Using backup audio source...");
            
            // Try playing default Azan as last resort
            try {
                const response = await fetch(BACKUP_AUDIO_SOURCES.DEFAULT_AZAN);
                if (!response.ok) throw new Error('Local default azan not found');
                
                const arrayBuffer = await response.arrayBuffer();
                const defaultBuffer = await audioContext.decodeAudioData(arrayBuffer);
                const source = audioContext.createBufferSource();
                source.buffer = defaultBuffer;
                source.connect(audioContext.destination);
                source.start(0);
                return new Promise(resolve => source.onended = resolve);
            } catch (fallbackError) {
                console.error("Backup audio also failed:", fallbackError);
                alert("All audio sources failed. Please check your internet connection.");
                throw error;
            }
        }
    },

    async playBeep() {
        try {
            const response = await fetch(BACKUP_AUDIO_SOURCES.BEEP);
            if (!response.ok) throw new Error('Local beep sound not found');
            
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            const beepSource = audioContext.createBufferSource();
            beepSource.buffer = audioBuffer;
            beepSource.connect(audioContext.destination);
            beepSource.start(0);
            return new Promise(resolve => beepSource.onended = resolve);
        } catch (error) {
            console.log("Failed to play beep sound:", error);
            // Continue without beep if it fails
        }
    },

    async changeQari(qariName) {
        try {
            const qari = qaris[qariName];
            if (!qari) throw new Error(`Invalid Qari: ${qariName}`);

            await Promise.all([
                this.preloadAudio(qari.other, qari.backup.other),
                this.preloadAudio(qari.fajr, qari.backup.fajr)
            ]);

            currentQari = qariName;
            localStorage.setItem("selectedQari", qariName);
            console.log("Successfully preloaded audio for:", qariName);
        } catch (error) {
            console.error("Error preloading audio for new Qari:", error);
            alert(`Failed to load audio for ${qariName}. Please try another Qari.`);
            throw error;
        }
    },

    // Request notification permissions
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            console.log("Notification permission:", permission);
            return permission === "granted";
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            return false;
        }
    },

    // Show Azan notification
    showAzanNotification(prayerName) {
        if (Notification.permission === "granted") {
            const notification = new Notification("Prayer Time", {
                body: `It's time for ${prayerName} prayer`,
                icon: "https://cdn.islamic.network/icons/prayer.png",
                silent: true // Don't play notification sound as we'll play Azan
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    }
};

// Initialize audio context on user interaction
document.addEventListener("click", () => {
    try {
        AzanPlayer.initAudioContext();
    } catch (error) {
        console.error("Error initializing audio context:", error);
    }
}, { once: true });

// Clean up audio resources when page is unloaded
window.addEventListener("beforeunload", () => {
    if (currentAudio) {
        currentAudio.stop();
        currentAudio.disconnect();
    }
    if (audioContext) {
        audioContext.close();
    }
});

window.AzanPlayer = AzanPlayer;
window.AzanPlayer.qaris = qaris; 