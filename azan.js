// Azan audio files for different Qaris and prayer times
const qaris = {
    "Abdul Basit": {
        id: "abdul-basit",
        fajr: 'https://cdn.islamic.network/adhans/abdul-basit/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/abdul-basit/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdul-Basit-Abdus-Samad/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdul-Basit-Abdus-Samad/128/azan2.mp3'
        }
    },
    "Al-Minshawi": {
        id: "minshawi",
        fajr: 'https://cdn.islamic.network/adhans/minshawi/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/minshawi/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mohammad-al-Minshawi/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mohammad-al-Minshawi/128/azan2.mp3'
        }
    },
    "Al-Ghamdi": {
        id: "ghamdi",
        fajr: 'https://cdn.islamic.network/adhans/ghamdi/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/ghamdi/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Saad-al-Ghamdi/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Saad-al-Ghamdi/128/azan2.mp3'
        }
    },
    "Al-Hussary": {
        id: "hussary",
        fajr: 'https://cdn.islamic.network/adhans/hussary/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/hussary/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mahmoud-Khalil-Al-Hussary/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mahmoud-Khalil-Al-Hussary/128/azan2.mp3'
        }
    },
    "Mishary Rashid": {
        id: "mishary",
        fajr: 'https://cdn.islamic.network/adhans/mishary-rashid/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/mishary-rashid/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mishary-Rashid/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mishary-Rashid/128/azan2.mp3'
        }
    },
    "Ali Ahmad Mulla": {
        id: "mulla",
        fajr: 'https://cdn.islamic.network/adhans/mulla/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/mulla/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Ali-Ahmad-Mulla/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Ali-Ahmad-Mulla/128/azan2.mp3'
        }
    },
    "Muhammad Al-Muaiqly": {
        id: "muaiqly",
        fajr: 'https://cdn.islamic.network/adhans/muaiqly/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/muaiqly/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Muhammad-al-Muaiqly/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Muhammad-al-Muaiqly/128/azan2.mp3'
        }
    },
    "Masjid Al-Haram": {
        id: "makkah",
        fajr: 'https://cdn.islamic.network/adhans/makkah/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/makkah/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Makkah-Live/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Makkah-Live/128/azan2.mp3'
        }
    },
    "Masjid An-Nabawi": {
        id: "madina",
        fajr: 'https://cdn.islamic.network/adhans/madina/fajr.mp3',
        other: 'https://cdn.islamic.network/adhans/madina/normal.mp3',
        backup: {
            fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Madina-Live/128/azan1.mp3',
            other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Madina-Live/128/azan2.mp3'
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

// Azan Player Module
const AzanPlayer = {
    // Initialize audio context on user interaction
    initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log("AudioContext initialized");
        }
    },

    // Load and cache audio for better performance
    async preloadAudio(url, backupUrl) {
        try {
            this.initAudioContext();
            console.log("Preloading audio from:", url);
            
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                return await audioContext.decodeAudioData(arrayBuffer);
            } catch (primaryError) {
                console.log("Primary source failed, trying backup:", backupUrl);
                const backupResponse = await fetch(backupUrl);
                const backupBuffer = await backupResponse.arrayBuffer();
                return await audioContext.decodeAudioData(backupBuffer);
            }
        } catch (error) {
            console.error("Error preloading audio:", error);
            throw error;
        }
    },

    // Play audio with enhanced error handling
    async playAzan(qariName, type = 'other') {
        try {
            this.initAudioContext();
            
            // Stop any currently playing audio
            if (currentAudio) {
                currentAudio.stop();
                currentAudio = null;
            }

            // Get the correct URL based on the qari
            const qari = qaris[qariName];
            if (!qari) {
                throw new Error(`Invalid Qari: ${qariName}`);
            }

            const primaryUrl = type === 'fajr' ? qari.fajr : qari.other;
            const backupUrl = type === 'fajr' ? qari.backup.fajr : qari.backup.other;

            console.log("Playing Azan from:", primaryUrl);
            console.log("Backup URL:", backupUrl);

            const audioBuffer = await this.preloadAudio(primaryUrl, backupUrl);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            
            currentAudio = source;
            source.start(0);

            return new Promise((resolve) => {
                source.onended = () => {
                    currentAudio = null;
                    resolve();
                };
            });
        } catch (error) {
            console.error("Error playing Azan:", error);
            throw error;
        }
    },

    // Change Qari and preload audio
    async changeQari(qariName) {
        try {
            const qari = qaris[qariName];
            if (!qari) {
                throw new Error(`Invalid Qari: ${qariName}`);
            }
            
            // Preload both normal and Fajr Azan
            await Promise.all([
                this.preloadAudio(qari.other, qari.backup.other),
                this.preloadAudio(qari.fajr, qari.backup.fajr)
            ]);
            
            currentQari = qariName;
            localStorage.setItem('selectedQari', qariName);
            console.log("Successfully preloaded audio for:", qariName);
        } catch (error) {
            console.error("Error preloading audio for new Qari:", error);
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
document.addEventListener('click', () => AzanPlayer.initAudioContext(), { once: true });

// Export the module
window.AzanPlayer = AzanPlayer; 