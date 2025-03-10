// Ensure AudioContext is defined
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentAudio = null;

// Cache for verified audio files
const verifiedAudioFiles = new Map();

// Define local Adhan configurations
const localAdhans = {
    'abdul-basit': {
        name: 'Abdul Basit',
        files: {
            fajr: 'audio/adhans/abdul-basit/fajr.mp3',
            dhuhr: 'audio/adhans/abdul-basit/normal.mp3',
            asr: 'audio/adhans/abdul-basit/normal.mp3',
            maghrib: 'audio/adhans/abdul-basit/normal.mp3',
            isha: 'audio/adhans/abdul-basit/normal.mp3'
        }
    },
    'assabile-abdul-basit': {
        name: 'Assabile - Abdul Basit',
        files: {
            fajr: 'audio/adhans/assabile/abdul_basit_adhan.mp3',
            dhuhr: 'audio/adhans/assabile/abdul_basit_adhan.mp3',
            asr: 'audio/adhans/assabile/abdul_basit_adhan.mp3',
            maghrib: 'audio/adhans/assabile/abdul_basit_adhan.mp3',
            isha: 'audio/adhans/assabile/abdul_basit_adhan.mp3'
        }
    },
    'assabile-mishary': {
        name: 'Assabile - Mishary Rashid',
        files: {
            fajr: 'audio/adhans/assabile/mishary_adhan.mp3',
            dhuhr: 'audio/adhans/assabile/mishary_adhan.mp3',
            asr: 'audio/adhans/assabile/mishary_adhan.mp3',
            maghrib: 'audio/adhans/assabile/mishary_adhan.mp3',
            isha: 'audio/adhans/assabile/mishary_adhan.mp3'
        }
    },
    'assabile-fajr': {
        name: 'Assabile - Fajr Special',
        files: {
            fajr: 'audio/adhans/assabile/fajr_adhan.mp3',
            dhuhr: 'audio/adhans/assabile/mishary_adhan.mp3',
            asr: 'audio/adhans/assabile/mishary_adhan.mp3',
            maghrib: 'audio/adhans/assabile/mishary_adhan.mp3',
            isha: 'audio/adhans/assabile/mishary_adhan.mp3'
        }
    },
    'assabile-madina': {
        name: 'Assabile - Madina',
        files: {
            fajr: 'audio/adhans/assabile/madina_adhan.mp3',
            dhuhr: 'audio/adhans/assabile/madina_adhan.mp3',
            asr: 'audio/adhans/assabile/madina_adhan.mp3',
            maghrib: 'audio/adhans/assabile/madina_adhan.mp3',
            isha: 'audio/adhans/assabile/madina_adhan.mp3'
        }
    },
    'assabile-makkah': {
        name: 'Assabile - Makkah',
        files: {
            fajr: 'audio/adhans/assabile/makkah_adhan.mp3',
            dhuhr: 'audio/adhans/assabile/makkah_adhan.mp3',
            asr: 'audio/adhans/assabile/makkah_adhan.mp3',
            maghrib: 'audio/adhans/assabile/makkah_adhan.mp3',
            isha: 'audio/adhans/assabile/makkah_adhan.mp3'
        }
    },
    'al-ghamdi': {
        name: 'Al-Ghamdi',
        files: {
            fajr: 'audio/adhans/al-ghamdi/fajr.mp3',
            dhuhr: 'audio/adhans/al-ghamdi/normal.mp3',
            asr: 'audio/adhans/al-ghamdi/normal.mp3',
            maghrib: 'audio/adhans/al-ghamdi/normal.mp3',
            isha: 'audio/adhans/al-ghamdi/normal.mp3'
        }
    },
    'al-hussary': {
        name: 'Al-Hussary',
        files: {
            fajr: 'audio/adhans/al-hussary/fajr.mp3',
            dhuhr: 'audio/adhans/al-hussary/normal.mp3',
            asr: 'audio/adhans/al-hussary/normal.mp3',
            maghrib: 'audio/adhans/al-hussary/normal.mp3',
            isha: 'audio/adhans/al-hussary/normal.mp3'
        }
    },
    'al-minshawi': {
        name: 'Al-Minshawi',
        files: {
            fajr: 'audio/adhans/al-minshawi/fajr.mp3',
            dhuhr: 'audio/adhans/al-minshawi/normal.mp3',
            asr: 'audio/adhans/al-minshawi/normal.mp3',
            maghrib: 'audio/adhans/al-minshawi/normal.mp3',
            isha: 'audio/adhans/al-minshawi/normal.mp3'
        }
    },
    'makkah': {
        name: 'Makkah Adhan',
        files: {
            fajr: 'audio/adhans/makkah/fajr.mp3',
            dhuhr: 'audio/adhans/makkah/normal.mp3',
            asr: 'audio/adhans/makkah/normal.mp3',
            maghrib: 'audio/adhans/makkah/normal.mp3',
            isha: 'audio/adhans/makkah/normal.mp3'
        }
    },
    'madina': {
        name: 'Madina Adhan',
        files: {
            fajr: 'audio/adhans/madina/fajr.mp3',
            dhuhr: 'audio/adhans/madina/normal.mp3',
            asr: 'audio/adhans/madina/normal.mp3',
            maghrib: 'audio/adhans/madina/normal.mp3',
            isha: 'audio/adhans/madina/normal.mp3'
        }
    },
    'mishary-rashid': {
        name: 'Mishary Rashid',
        files: {
            fajr: 'audio/adhans/mishary-rashid/fajr.mp3',
            dhuhr: 'audio/adhans/mishary-rashid/normal.mp3',
            asr: 'audio/adhans/mishary-rashid/normal.mp3',
            maghrib: 'audio/adhans/mishary-rashid/normal.mp3',
            isha: 'audio/adhans/mishary-rashid/normal.mp3'
        }
    },
    'muaiqly': {
        name: 'Muaiqly',
        files: {
            fajr: 'audio/adhans/muaiqly/fajr.mp3',
            dhuhr: 'audio/adhans/muaiqly/normal.mp3',
            asr: 'audio/adhans/muaiqly/normal.mp3',
            maghrib: 'audio/adhans/muaiqly/normal.mp3',
            isha: 'audio/adhans/muaiqly/normal.mp3'
        }
    },
    'local': {
        name: 'Local Adhan',
        files: {
            fajr: 'audio/adhans/Local/default-azanfajr.mp3',
            dhuhr: 'audio/adhans/Local/azan.mp3',
            asr: 'audio/adhans/Local/azan2.mp3',
            maghrib: 'audio/adhans/Local/azan.mp3',
            isha: 'audio/adhans/Local/azan.mp3'
        }
    },
    'default': {
        name: 'Default Adhan',
        files: {
            fajr: 'audio/adhans/Local/default-azanfajr.mp3',
            dhuhr: 'audio/adhans/Local/default-azan.mp3',
            asr: 'audio/adhans/Local/default-azan.mp3',
            maghrib: 'audio/adhans/Local/default-azan.mp3',
            isha: 'audio/adhans/Local/default-azan.mp3'
        }
    },
    'islamcan-1': {
        name: 'IslamCan 1',
        files: {
            fajr: 'audio/adhans/islamcan/azan1.mp3',
            dhuhr: 'audio/adhans/islamcan/azan1.mp3',
            asr: 'audio/adhans/islamcan/azan1.mp3',
            maghrib: 'audio/adhans/islamcan/azan1.mp3',
            isha: 'audio/adhans/islamcan/azan1.mp3'
        }
    },
    'islamcan-2': {
        name: 'IslamCan 2',
        files: {
            fajr: 'audio/adhans/islamcan/azan2.mp3',
            dhuhr: 'audio/adhans/islamcan/azan2.mp3',
            asr: 'audio/adhans/islamcan/azan2.mp3',
            maghrib: 'audio/adhans/islamcan/azan2.mp3',
            isha: 'audio/adhans/islamcan/azan2.mp3'
        }
    },
    'islamcan-3': {
        name: 'IslamCan 3',
        files: {
            fajr: 'audio/adhans/islamcan/azan3.mp3',
            dhuhr: 'audio/adhans/islamcan/azan3.mp3',
            asr: 'audio/adhans/islamcan/azan3.mp3',
            maghrib: 'audio/adhans/islamcan/azan3.mp3',
            isha: 'audio/adhans/islamcan/azan3.mp3'
        }
    },
    'islamcan-4': {
        name: 'IslamCan 4',
        files: {
            fajr: 'audio/adhans/islamcan/azan4.mp3',
            dhuhr: 'audio/adhans/islamcan/azan4.mp3',
            asr: 'audio/adhans/islamcan/azan4.mp3',
            maghrib: 'audio/adhans/islamcan/azan4.mp3',
            isha: 'audio/adhans/islamcan/azan4.mp3'
        }
    },
    'islamcan-5': {
        name: 'IslamCan 5',
        files: {
            fajr: 'audio/adhans/islamcan/azan5.mp3',
            dhuhr: 'audio/adhans/islamcan/azan5.mp3',
            asr: 'audio/adhans/islamcan/azan5.mp3',
            maghrib: 'audio/adhans/islamcan/azan5.mp3',
            isha: 'audio/adhans/islamcan/azan5.mp3'
        }
    },
    'islamcan-6': {
        name: 'IslamCan 6',
        files: {
            fajr: 'audio/adhans/islamcan/azan6.mp3',
            dhuhr: 'audio/adhans/islamcan/azan6.mp3',
            asr: 'audio/adhans/islamcan/azan6.mp3',
            maghrib: 'audio/adhans/islamcan/azan6.mp3',
            isha: 'audio/adhans/islamcan/azan6.mp3'
        }
    },
    'islamcan-7': {
        name: 'IslamCan 7',
        files: {
            fajr: 'audio/adhans/islamcan/azan7.mp3',
            dhuhr: 'audio/adhans/islamcan/azan7.mp3',
            asr: 'audio/adhans/islamcan/azan7.mp3',
            maghrib: 'audio/adhans/islamcan/azan7.mp3',
            isha: 'audio/adhans/islamcan/azan7.mp3'
        }
    },
    'islamcan-8': {
        name: 'IslamCan 8',
        files: {
            fajr: 'audio/adhans/islamcan/azan8.mp3',
            dhuhr: 'audio/adhans/islamcan/azan8.mp3',
            asr: 'audio/adhans/islamcan/azan8.mp3',
            maghrib: 'audio/adhans/islamcan/azan8.mp3',
            isha: 'audio/adhans/islamcan/azan8.mp3'
        }
    },
    'islamcan-9': {
        name: 'IslamCan 9',
        files: {
            fajr: 'audio/adhans/islamcan/azan9.mp3',
            dhuhr: 'audio/adhans/islamcan/azan9.mp3',
            asr: 'audio/adhans/islamcan/azan9.mp3',
            maghrib: 'audio/adhans/islamcan/azan9.mp3',
            isha: 'audio/adhans/islamcan/azan9.mp3'
        }
    },
    'islamcan-10': {
        name: 'IslamCan 10',
        files: {
            fajr: 'audio/adhans/islamcan/azan10.mp3',
            dhuhr: 'audio/adhans/islamcan/azan10.mp3',
            asr: 'audio/adhans/islamcan/azan10.mp3',
            maghrib: 'audio/adhans/islamcan/azan10.mp3',
            isha: 'audio/adhans/islamcan/azan10.mp3'
        }
    },
    'islamcan-11': {
        name: 'IslamCan 11',
        files: {
            fajr: 'audio/adhans/islamcan/azan11.mp3',
            dhuhr: 'audio/adhans/islamcan/azan11.mp3',
            asr: 'audio/adhans/islamcan/azan11.mp3',
            maghrib: 'audio/adhans/islamcan/azan11.mp3',
            isha: 'audio/adhans/islamcan/azan11.mp3'
        }
    },
    'islamcan-12': {
        name: 'IslamCan 12',
        files: {
            fajr: 'audio/adhans/islamcan/azan12.mp3',
            dhuhr: 'audio/adhans/islamcan/azan12.mp3',
            asr: 'audio/adhans/islamcan/azan12.mp3',
            maghrib: 'audio/adhans/islamcan/azan12.mp3',
            isha: 'audio/adhans/islamcan/azan12.mp3'
        }
    },
    'islamcan-13': {
        name: 'IslamCan 13',
        files: {
            fajr: 'audio/adhans/islamcan/azan13.mp3',
            dhuhr: 'audio/adhans/islamcan/azan13.mp3',
            asr: 'audio/adhans/islamcan/azan13.mp3',
            maghrib: 'audio/adhans/islamcan/azan13.mp3',
            isha: 'audio/adhans/islamcan/azan13.mp3'
        }
    },
    'islamcan-14': {
        name: 'IslamCan 14',
        files: {
            fajr: 'audio/adhans/islamcan/azan14.mp3',
            dhuhr: 'audio/adhans/islamcan/azan14.mp3',
            asr: 'audio/adhans/islamcan/azan14.mp3',
            maghrib: 'audio/adhans/islamcan/azan14.mp3',
            isha: 'audio/adhans/islamcan/azan14.mp3'
        }
    },
    'islamcan-15': {
        name: 'IslamCan 15',
        files: {
            fajr: 'audio/adhans/islamcan/azan15.mp3',
            dhuhr: 'audio/adhans/islamcan/azan15.mp3',
            asr: 'audio/adhans/islamcan/azan15.mp3',
            maghrib: 'audio/adhans/islamcan/azan15.mp3',
            isha: 'audio/adhans/islamcan/azan15.mp3'
        }
    },
    'islamcan-16': {
        name: 'IslamCan 16',
        files: {
            fajr: 'audio/adhans/islamcan/azan16.mp3',
            dhuhr: 'audio/adhans/islamcan/azan16.mp3',
            asr: 'audio/adhans/islamcan/azan16.mp3',
            maghrib: 'audio/adhans/islamcan/azan16.mp3',
            isha: 'audio/adhans/islamcan/azan16.mp3'
        }
    },
    'islamcan-17': {
        name: 'IslamCan 17',
        files: {
            fajr: 'audio/adhans/islamcan/azan17.mp3',
            dhuhr: 'audio/adhans/islamcan/azan17.mp3',
            asr: 'audio/adhans/islamcan/azan17.mp3',
            maghrib: 'audio/adhans/islamcan/azan17.mp3',
            isha: 'audio/adhans/islamcan/azan17.mp3'
        }
    },
    'islamcan-18': {
        name: 'IslamCan 18',
        files: {
            fajr: 'audio/adhans/islamcan/azan18.mp3',
            dhuhr: 'audio/adhans/islamcan/azan18.mp3',
            asr: 'audio/adhans/islamcan/azan18.mp3',
            maghrib: 'audio/adhans/islamcan/azan18.mp3',
            isha: 'audio/adhans/islamcan/azan18.mp3'
        }
    },
    'islamcan-19': {
        name: 'IslamCan 19',
        files: {
            fajr: 'audio/adhans/islamcan/azan19.mp3',
            dhuhr: 'audio/adhans/islamcan/azan19.mp3',
            asr: 'audio/adhans/islamcan/azan19.mp3',
            maghrib: 'audio/adhans/islamcan/azan19.mp3',
            isha: 'audio/adhans/islamcan/azan19.mp3'
        }
    },
    'islamcan-20': {
        name: 'IslamCan 20',
        files: {
            fajr: 'audio/adhans/islamcan/azan20.mp3',
            dhuhr: 'audio/adhans/islamcan/azan20.mp3',
            asr: 'audio/adhans/islamcan/azan20.mp3',
            maghrib: 'audio/adhans/islamcan/azan20.mp3',
            isha: 'audio/adhans/islamcan/azan20.mp3'
        }
    },
    'islamcan-21': {
        name: 'IslamCan 21',
        files: {
            fajr: 'audio/adhans/islamcan/azan21.mp3',
            dhuhr: 'audio/adhans/islamcan/azan21.mp3',
            asr: 'audio/adhans/islamcan/azan21.mp3',
            maghrib: 'audio/adhans/islamcan/azan21.mp3',
            isha: 'audio/adhans/islamcan/azan21.mp3'
        }
    },
    'beep': {
        name: 'Beep Sound',
        files: {
            fajr: 'audio/adhans/Local/beep.mp3',
            dhuhr: 'audio/adhans/Local/beep.mp3',
            asr: 'audio/adhans/Local/beep.mp3',
            maghrib: 'audio/adhans/Local/beep.mp3',
            isha: 'audio/adhans/Local/beep.mp3'
        }
    }
};

// Azan Player Object
class AzanPlayer {
    constructor() {
        this.audio = new Audio();
        this.currentPrayer = null;
        this.prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    }

    async initAudioContext() {
        if (audioContext.state === "suspended") {
            await audioContext.resume();
            console.log("AudioContext resumed");
        }
    }

    async verifyAudioFile(filePath) {
        // Check cache first
        if (verifiedAudioFiles.has(filePath)) {
            return verifiedAudioFiles.get(filePath);
        }

        try {
            // Ensure the file path is properly encoded
            const encodedPath = filePath.split('/').map(part => encodeURIComponent(part)).join('/');
            console.log(`Verifying audio file: ${encodedPath}`);
            
            // Try HEAD request first
            try {
                const response = await fetch(encodedPath, { 
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                if (response.ok) {
                    console.log(`File verified via HEAD: ${filePath}`);
                    verifiedAudioFiles.set(filePath, true);
                    return true;
                }
            } catch (headError) {
                console.debug(`HEAD request failed for ${filePath}, trying GET request`);
            }

            // If HEAD fails, try GET request
            const response = await fetch(encodedPath, { 
                method: 'GET',
                cache: 'no-cache'
            });
            
            const isValid = response.ok;
            verifiedAudioFiles.set(filePath, isValid);
            
            if (!isValid) {
                console.warn(`Audio file not found: ${filePath}`);
            } else {
                console.log(`File verified via GET: ${filePath}`);
            }
            
            return isValid;
        } catch (error) {
            console.error(`Error verifying audio file ${filePath}:`, error);
            verifiedAudioFiles.set(filePath, false);
            return false;
        }
    }

    async verifyQariFiles(qariId, prayer) {
        const qari = localAdhans[qariId];
        if (!qari) return false;

        const filePath = qari.files[prayer];
        return await this.verifyAudioFile(filePath);
    }

    async loadAudio(filePath) {
        try {
            await this.initAudioContext();
            console.log("Loading audio from:", filePath);
            
            // Verify file exists before attempting to load
            const fileExists = await this.verifyAudioFile(filePath);
            if (!fileExists) {
                throw new Error('Audio file not found');
            }
            
            const response = await fetch(filePath);
            if (!response.ok) throw new Error('Audio file not found');
            
            const arrayBuffer = await response.arrayBuffer();
            return await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error("Error loading audio:", error);
            throw error;
        }
    }

    async updateQariAvailability() {
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        for (const prayer of prayers) {
            const select = document.getElementById(`${prayer}QariSelect`);
            if (!select) continue;

            // Check each option
            for (const option of select.options) {
                const qariId = option.value;
                const isAvailable = await this.verifyQariFiles(qariId, prayer);
                
                // Update option text and style based on availability
                if (!isAvailable) {
                    option.text = `${option.text} (Not Available)`;
                    option.style.color = '#999';
                }
                option.disabled = !isAvailable;
            }

            // If selected option is not available, try to select first available option
            if (select.selectedOptions[0].disabled) {
                for (const option of select.options) {
                    if (!option.disabled) {
                        select.value = option.value;
                        localStorage.setItem(`${prayer}Qari`, option.value);
                        break;
                    }
                }
            }
        }
    }

    async scanAvailableAdhans() {
        const availableQaris = new Map();
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        console.log("Scanning for available Adhan audio files...");
        
        for (const [qariId, qari] of Object.entries(localAdhans)) {
            let allFilesAvailable = true;
            const availableFiles = {};
            
            // Check each prayer time audio file
            for (const prayer of prayers) {
                const filePath = qari.files[prayer];
                const exists = await this.verifyAudioFile(filePath);
                
                if (exists) {
                    availableFiles[prayer] = filePath;
                } else {
                    console.log(`Missing ${prayer} audio for ${qari.name}`);
                    allFilesAvailable = false;
                    break;
                }
            }
            
            if (allFilesAvailable) {
                availableQaris.set(qariId, {
                    name: qari.name,
                    files: availableFiles
                });
                console.log(`Found complete Adhan set for ${qari.name}`);
            }
        }
        
        return availableQaris;
    }

    async verifyAudioStructure() {
        console.log("Verifying audio directory structure...");
        const missingFiles = [];
        
        // First check default and local Adhans
        for (const prayer of this.prayers) {
            const defaultPath = localAdhans['default'].files[prayer];
            const exists = await this.verifyAudioFile(defaultPath);
            if (!exists) {
                missingFiles.push(defaultPath);
            }
        }
        
        // Check beep sound
        const beepPath = 'audio/adhans/Local/beep.mp3';
        const beepExists = await this.verifyAudioFile(beepPath);
        if (!beepExists) {
            missingFiles.push(beepPath);
            console.warn("Beep sound file is missing");
        }
        
        if (missingFiles.length > 0) {
            console.warn("Missing audio files:", missingFiles);
        }
        
        return missingFiles.length === 0;
    }

    async initializeQariSelectors() {
        console.log("Initializing Qari selectors...");
        await this.verifyAudioStructure();

        for (const prayer of this.prayers) {
            const qariSelect = document.getElementById(`${prayer}QariSelect`);
            const notifSelect = document.getElementById(`${prayer}NotifType`);
            
            if (!qariSelect || !notifSelect) {
                console.warn(`Selectors for ${prayer} not found`);
                continue;
            }

            // Clear existing options
            qariSelect.innerHTML = '';
            console.log(`Populating options for ${prayer} prayer...`);

            // Add available Muazzins
            for (const [key, muazzin] of Object.entries(localAdhans)) {
                try {
                    const audioPath = muazzin.files[prayer];
                    console.log(`Checking ${muazzin.name} (${key}) for ${prayer}: ${audioPath}`);
                    const exists = await this.verifyAudioFile(audioPath);
                    console.log(`${muazzin.name} (${key}) for ${prayer}: ${exists ? 'Available' : 'Not found'}`);
                    
                    if (exists) {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = muazzin.name;
                        qariSelect.appendChild(option);
                        console.log(`Added ${muazzin.name} to ${prayer} options`);
                    }
                } catch (error) {
                    console.error(`Error checking ${muazzin.name} for ${prayer}:`, error);
                }
            }

            // Set saved selections or defaults
            const savedQari = localStorage.getItem(`${prayer}Qari`) || 'default';
            const savedNotifType = localStorage.getItem(`${prayer}NotifType`) || 'adhan';

            if (qariSelect.querySelector(`option[value="${savedQari}"]`)) {
                qariSelect.value = savedQari;
                console.log(`Set ${prayer} to saved selection: ${savedQari}`);
            } else if (qariSelect.options.length > 0) {
                qariSelect.value = qariSelect.options[0].value;
                localStorage.setItem(`${prayer}Qari`, qariSelect.value);
                console.log(`Set ${prayer} to first available option: ${qariSelect.value}`);
            }

            notifSelect.value = savedNotifType;
            console.log(`Set ${prayer} notification type to: ${savedNotifType}`);
            
            // Log final number of options
            console.log(`${prayer} has ${qariSelect.options.length} available Muazzins`);
        }
    }

    async playAdhan(prayer) {
        try {
            this.currentPrayer = prayer;
            const notifType = localStorage.getItem(`${prayer}NotifType`) || 'adhan';
            
            if (notifType === 'beep') {
                return this.playBeep(prayer);
            }

            const selectedQari = localStorage.getItem(`${prayer}Qari`);
            if (!selectedQari || !localAdhans[selectedQari]) {
                console.warn(`No Muazzin selected for ${prayer}, using default`);
                localStorage.setItem(`${prayer}Qari`, 'default');
            }

            const qari = localAdhans[selectedQari] || localAdhans['default'];
            const audioPath = qari.files[prayer];

            if (!await this.verifyAudioFile(audioPath)) {
                throw new Error(`Audio file not found: ${audioPath}`);
            }

            console.log(`Playing ${prayer} Adhan from ${qari.name}`);
            this.audio.src = audioPath;
            await this.audio.play();

        } catch (error) {
            console.error(`Error playing ${prayer} Adhan:`, error);
            this.initializeQariSelectors(); // Rescan available options
            throw error;
        }
    }

    async playBeep(prayer) {
        try {
            this.currentPrayer = prayer;
            const beepPath = 'audio/adhans/Local/beep.mp3';

            if (!await this.verifyAudioFile(beepPath)) {
                throw new Error('Beep sound file not found');
            }

            console.log(`Playing beep sound for ${prayer}`);
            this.audio.src = beepPath;
            await this.audio.play();

        } catch (error) {
            console.error(`Error playing beep for ${prayer}:`, error);
            throw error;
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.currentPrayer = null;
        }
    }

    requestNotificationPermission() {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications");
            return;
        }

        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted");
            }
        });
    }
}

// Ensure AudioContext is resumed on user interaction
document.addEventListener("click", () => {
    if (audioContext.state === "suspended") {
        audioContext.resume().then(() => console.log("AudioContext resumed"));
    }
}, { once: true });

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.AzanPlayer = new AzanPlayer();
    window.AzanPlayer.initializeQariSelectors();
});

window.AzanPlayer = AzanPlayer;
window.AzanPlayer.localAdhans = localAdhans;
