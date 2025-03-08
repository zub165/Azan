// Azan audio files for different Qaris and prayer times
const qaris = {
    "Abdul Basit": {
        id: "abdul-basit",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdul-Basit-Abdus-Samad/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Abdul-Basit-Abdus-Samad/128/azan2.mp3'
    },
    "Al-Minshawi": {
        id: "minshawi",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mohammad-al-Minshawi/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mohammad-al-Minshawi/128/azan2.mp3'
    },
    "Al-Ghamdi": {
        id: "ghamdi",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Saad-al-Ghamdi/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Saad-al-Ghamdi/128/azan2.mp3'
    },
    "Al-Hussary": {
        id: "hussary",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mahmoud-Khalil-Al-Hussary/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mahmoud-Khalil-Al-Hussary/128/azan2.mp3'
    },
    "Mishary Rashid": {
        id: "mishary",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mishary-Rashid/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Mishary-Rashid/128/azan2.mp3'
    },
    "Ali Ahmad Mulla": {
        id: "mulla",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Ali-Ahmad-Mulla/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Ali-Ahmad-Mulla/128/azan2.mp3'
    },
    "Muhammad Al-Muaiqly": {
        id: "muaiqly",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Muhammad-al-Muaiqly/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Muhammad-al-Muaiqly/128/azan2.mp3'
    },
    "Masjid Al-Haram": {
        id: "makkah",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Makkah-Live/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Makkah-Live/128/azan2.mp3'
    },
    "Masjid An-Nabawi": {
        id: "madina",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Madina-Live/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Madina-Live/128/azan2.mp3'
    },
    "Yusuf Islam": {
        id: "yusuf",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Yusuf-Islam/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Yusuf-Islam/128/azan2.mp3'
    },
    "Sheikh Essam": {
        id: "essam",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Sheikh-Essam-Bukhari/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Sheikh-Essam-Bukhari/128/azan2.mp3'
    },
    "Ibrahim Al-Arkani": {
        id: "arkani",
        fajr: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Ibrahim-Al-Arkani/128/azan1.mp3',
        other: 'https://raw.githubusercontent.com/islamic-network/azan-files/master/Ibrahim-Al-Arkani/128/azan2.mp3'
    }
};

let currentQari = localStorage.getItem('selectedQari') || "Abdul Basit";
let scheduledAzans = [];
let audioContext = null;

// Initialize audio context on user interaction
document.addEventListener('click', initializeAudioContext, { once: true });

function initializeAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("Audio context initialized");
    }
}

// Function to get Azan URL based on prayer and current Qari
function getAzanUrl(prayerName) {
    console.log("Getting Azan URL for:", prayerName, "Qari:", currentQari);
    const qari = qaris[currentQari];
    if (!qari) {
        console.error("Invalid Qari selected:", currentQari);
        return null;
    }
    return prayerName === 'fajr' ? qari.fajr : qari.other;
}

// Function to preload audio
async function preloadAudio(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        console.log("Audio preloaded:", url);
        return arrayBuffer;
    } catch (error) {
        console.error("Error preloading audio:", error);
        return null;
    }
}

// Function to play Azan audio
async function playAzan(prayerName) {
    console.log("Playing Azan for:", prayerName);
    
    if (!audioContext) {
        initializeAudioContext();
    }

    const url = getAzanUrl(prayerName);
    if (!url) {
        console.error("No audio URL available for:", prayerName);
        return;
    }

    try {
        const audio = new Audio(url);
        
        // Add event listeners for debugging
        audio.addEventListener('loadstart', () => console.log('Audio loading started'));
        audio.addEventListener('canplay', () => console.log('Audio can play'));
        audio.addEventListener('playing', () => console.log('Audio playing'));
        audio.addEventListener('ended', () => console.log('Audio finished'));
        audio.addEventListener('error', (e) => console.error('Audio error:', e));

        await audio.play();
        
        // Show notification if supported
        if (Notification.permission === "granted") {
            new Notification("Prayer Time", {
                body: `It's time for ${prayerName} prayer (${currentQari})`,
                icon: "/favicon.ico"
            });
        }
    } catch (error) {
        console.error("Error playing Azan:", error);
        alert(`Error playing Azan: ${error.message}`);
    }
}

// Function to schedule Azan for a specific prayer time
function scheduleAzan(prayerName, prayerTime) {
    console.log("Scheduling Azan for:", prayerName, "at:", prayerTime);
    
    const now = new Date();
    const azanTime = new Date(prayerTime);
    
    // If prayer time has passed for today, schedule for tomorrow
    if (azanTime < now) {
        azanTime.setDate(azanTime.getDate() + 1);
    }
    
    const timeUntilAzan = azanTime.getTime() - now.getTime();
    console.log("Time until Azan (ms):", timeUntilAzan);
    
    const azanTimeout = setTimeout(() => {
        playAzan(prayerName);
    }, timeUntilAzan);
    
    scheduledAzans.push({
        prayerName,
        timeout: azanTimeout,
        scheduledTime: azanTime
    });
}

// Function to schedule all Azans for the day
function scheduleAllAzans(prayerTimes) {
    console.log("Scheduling all Azans for:", prayerTimes);
    
    // Clear existing scheduled Azans
    scheduledAzans.forEach(scheduled => {
        clearTimeout(scheduled.timeout);
    });
    scheduledAzans = [];
    
    // Schedule new Azans
    Object.entries(prayerTimes).forEach(([prayerName, time]) => {
        const lowerPrayerName = prayerName.toLowerCase();
        if (lowerPrayerName === 'fajr' || 
            lowerPrayerName === 'dhuhr' || 
            lowerPrayerName === 'asr' || 
            lowerPrayerName === 'maghrib' || 
            lowerPrayerName === 'isha') {
            scheduleAzan(lowerPrayerName, time);
        }
    });
}

// Function to change Qari
function changeQari(qariName) {
    console.log("Changing Qari to:", qariName);
    if (qaris[qariName]) {
        currentQari = qariName;
        localStorage.setItem('selectedQari', qariName);
        // Preload audio for the new Qari
        preloadAudio(qaris[qariName].fajr);
        preloadAudio(qaris[qariName].other);
        return true;
    }
    return false;
}

// Function to get list of available Qaris
function getAvailableQaris() {
    return Object.keys(qaris);
}

// Function to get current Qari
function getCurrentQari() {
    return currentQari;
}

// Request notification permission
function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return;
    }
    
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission:", permission);
        });
    }
}

// Export functions
window.AzanPlayer = {
    scheduleAllAzans,
    requestNotificationPermission,
    changeQari,
    getAvailableQaris,
    getCurrentQari,
    getAzanUrl,
    playAzan
}; 