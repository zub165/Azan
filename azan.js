// Ensure AudioContext is defined
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentAudio = null;

// Cache for verified audio files
const verifiedAudioFiles = new Map();
const downloadedAudioFiles = new Map();
const pendingDownloads = new Map();

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
        this.availablePrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        // Initialize audio context
        this.initializeAudioContext();
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
            // Check if this is a data URL (downloaded file)
            if (filePath.startsWith('data:audio/')) {
                console.log(`Verified data URL audio`);
                verifiedAudioFiles.set(filePath, true);
                return true;
            }
            
            // Encode the file path
            const encodedPath = encodeURI(filePath);
            
            // Try HEAD request first
            try {
                console.log(`Verifying audio file: ${encodedPath}`);
                const response = await fetch(encodedPath, { method: 'HEAD' });
                
                if (response.ok) {
                    console.log(`Audio file verified: ${encodedPath}`);
                    verifiedAudioFiles.set(filePath, true);
                    return true;
                }
            } catch (headError) {
                console.warn(`HEAD request failed for ${encodedPath}, trying GET request`);
            }
            
            // Fallback to GET request
            const response = await fetch(encodedPath);
            if (response.ok) {
                console.log(`Audio file verified via GET: ${encodedPath}`);
                verifiedAudioFiles.set(filePath, true);
                return true;
            }
            
            console.warn(`Audio file not found: ${encodedPath}`);
            verifiedAudioFiles.set(filePath, false);
            return false;
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
        
        // First scan predefined Adhans
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
        
        // Now scan the audio/adhans directory for additional Adhans
        await this.scanAdhanDirectory(availableQaris);
        
        return availableQaris;
    }
    
    async scanAdhanDirectory(availableQaris) {
        console.log("Scanning audio/adhans directory for additional Adhan files...");
        
        try {
            // Define the base directory
            const baseDir = 'audio/adhans';
            
            // Scan subdirectories
            const subdirs = ['assabile', 'Local', 'islamcan'];
            const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
            
            for (const subdir of subdirs) {
                // Try to list files in this directory
                try {
                    // For each subdirectory, look for MP3 files
                    const dirPath = `${baseDir}/${subdir}`;
                    
                    // Different handling based on directory structure
                    if (subdir === 'assabile') {
                        // Assabile directory has specific named files
                        const files = [
                            'abdul_basit_adhan.mp3',
                            'mishary_adhan.mp3',
                            'fajr_adhan.mp3',
                            'madina_adhan.mp3',
                            'makkah_adhan.mp3'
                        ];
                        
                        // Check if files exist
                        for (const file of files) {
                            const filePath = `${dirPath}/${file}`;
                            const exists = await this.verifyAudioFile(filePath);
                            
                            if (exists) {
                                // Create a qari ID based on the filename
                                const baseName = file.replace('_adhan.mp3', '');
                                const qariId = `${subdir}-${baseName}`;
                                const qariName = `${subdir.charAt(0).toUpperCase() + subdir.slice(1)} - ${baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/_/g, ' ')}`;
                                
                                // Create files object for all prayers
                                const filesObj = {};
                                for (const prayer of prayers) {
                                    // For fajr_adhan.mp3, use it only for fajr prayer
                                    if (file === 'fajr_adhan.mp3') {
                                        if (prayer === 'fajr') {
                                            filesObj[prayer] = filePath;
                                        } else {
                                            // For other prayers, use mishary_adhan.mp3 as fallback
                                            filesObj[prayer] = `${dirPath}/mishary_adhan.mp3`;
                                        }
                                    } else {
                                        filesObj[prayer] = filePath;
                                    }
                                }
                                
                                // Add to available qaris
                                availableQaris.set(qariId, {
                                    name: qariName,
                                    files: filesObj
                                });
                                console.log(`Added ${qariName} from ${subdir} directory`);
                            }
                        }
                    } else if (subdir === 'Local') {
                        // Local directory has specific named files
                        const files = [
                            'default-azan.mp3',
                            'default-azanfajr.mp3',
                            'azan.mp3',
                            'azan2.mp3',
                            'adhan.mp3'
                        ];
                        
                        // Check if files exist
                        for (const file of files) {
                            const filePath = `${dirPath}/${file}`;
                            const exists = await this.verifyAudioFile(filePath);
                            
                            if (exists) {
                                // Create a qari ID based on the filename
                                const baseName = file.replace('.mp3', '');
                                const qariId = `${subdir}-${baseName}`;
                                const qariName = `${subdir} - ${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
                                
                                // Create files object for all prayers
                                const filesObj = {};
                                for (const prayer of prayers) {
                                    // For default-azanfajr.mp3, use it only for fajr prayer
                                    if (file === 'default-azanfajr.mp3') {
                                        if (prayer === 'fajr') {
                                            filesObj[prayer] = filePath;
                                        } else {
                                            // For other prayers, use default-azan.mp3 as fallback
                                            filesObj[prayer] = `${dirPath}/default-azan.mp3`;
                                        }
                                    } else {
                                        filesObj[prayer] = filePath;
                                    }
                                }
                                
                                // Add to available qaris
                                availableQaris.set(qariId, {
                                    name: qariName,
                                    files: filesObj
                                });
                                console.log(`Added ${qariName} from ${subdir} directory`);
                            }
                        }
                    } else if (subdir === 'islamcan') {
                        // Islamcan directory has numbered files
                        // Group files by prefix (e.g., azan1, azan2, etc.)
                        const fileGroups = {};
                        
                        // Check for azan files from 1 to 21
                        for (let i = 1; i <= 21; i++) {
                            const filePath = `${dirPath}/azan${i}.mp3`;
                            const exists = await this.verifyAudioFile(filePath);
                            
                            if (exists) {
                                // Create a qari ID based on the filename
                                const qariId = `${subdir}-${i}`;
                                const qariName = `${subdir.charAt(0).toUpperCase() + subdir.slice(1)} - Qari ${i}`;
                                
                                // Create files object for all prayers
                                const filesObj = {};
                                for (const prayer of prayers) {
                                    filesObj[prayer] = filePath;
                                }
                                
                                // Add to available qaris
                                availableQaris.set(qariId, {
                                    name: qariName,
                                    files: filesObj
                                });
                                console.log(`Added ${qariName} from ${subdir} directory`);
                            }
                        }
                    }
                } catch (error) {
                    console.warn(`Error scanning ${subdir} directory:`, error);
                }
            }
            
            console.log(`Finished scanning. Found ${availableQaris.size} total Adhan options.`);
        } catch (error) {
            console.error("Error scanning Adhan directory:", error);
        }
    }

    async verifyAudioStructure() {
        console.log("Verifying audio directory structure...");
        const missingFiles = [];
        
        // First check default and local Adhans
        for (const prayer of this.availablePrayers) {
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
        
        // Scan for available Adhans in the audio/adhans directory
        const availableQaris = await this.scanAvailableAdhans();
        console.log(`Found ${availableQaris.size} available Qaris after scanning`);

        for (const prayer of this.availablePrayers) {
            const qariSelect = document.getElementById(`${prayer}QariSelect`);
            const notifSelect = document.getElementById(`${prayer}NotifType`);
            
            if (!qariSelect || !notifSelect) {
                console.warn(`Selectors for ${prayer} not found`);
                continue;
            }

            // Clear existing options
            qariSelect.innerHTML = '';
            console.log(`Populating options for ${prayer} prayer...`);

            // Add available Muazzins from both predefined and scanned sources
            // First add from predefined localAdhans
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
            
            // Then add from dynamically scanned Adhans
            for (const [key, muazzin] of availableQaris.entries()) {
                try {
                    // Skip if this qari is already in the predefined list
                    if (localAdhans[key]) {
                        continue;
                    }
                    
                    const audioPath = muazzin.files[prayer];
                    if (audioPath) {
                        const option = document.createElement('option');
                        option.value = key;
                        option.textContent = muazzin.name;
                        qariSelect.appendChild(option);
                        console.log(`Added scanned ${muazzin.name} to ${prayer} options`);
                    }
                } catch (error) {
                    console.error(`Error adding scanned ${muazzin.name} for ${prayer}:`, error);
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
            
            // Get selected notification type
            const notifTypeSelect = document.getElementById(`${prayer}NotifType`);
            const notifType = notifTypeSelect ? notifTypeSelect.value : 'adhan';
            
            if (notifType === 'beep') {
                return await this.playBeep(prayer);
            }
            
            const qariId = this.getQariForPrayer(prayer);
            if (!qariId) {
                throw new Error(`No Qari selected for ${prayer}`);
            }
            
            // Check local resources first
            const localResource = await this.checkLocalAzanResources(qariId, prayer);
            
            if (localResource.exists) {
                // Use local resource
                console.log(`Using local resource for ${qariId} - ${prayer}`);
                
                // Use the class audio element
                if (localResource.isDataUrl) {
                    // Use data URL directly
                    this.audio.src = localResource.path;
                } else {
                    // Use file path
                    this.audio.src = localResource.path;
                }
                
                // Play the audio
                await this.audio.play();
                console.log(`Playing ${prayer} Adhan from ${qariId}`);
                
                return true;
            } else {
                // Show download option
                console.log(`No local resource found for ${qariId} - ${prayer}, showing download option`);
                
                // Find the prayer container
                const prayerSelector = document.getElementById(`${prayer}QariSelect`);
                if (prayerSelector) {
                    this.showDownloadOption(qariId, prayer, prayerSelector.parentElement);
                }
                
                // Try to use default Adhan as fallback
                console.log("Trying default Adhan as fallback");
                const defaultPath = localAdhans['default'].files[prayer];
                const exists = await this.verifyAudioFile(defaultPath);
                
                if (exists) {
                    this.audio.src = defaultPath;
                    await this.audio.play();
                    console.log(`Playing default ${prayer} Adhan as fallback`);
                    return true;
                } else {
                    throw new Error(`No Adhan audio available for ${prayer}`);
                }
            }
        } catch (error) {
            console.error(`Error playing Adhan for ${prayer}:`, error);
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

    // Check for local Azan resources first
    async checkLocalAzanResources(qariId, prayer) {
        console.log(`Checking local resources for ${qariId} - ${prayer}`);
        
        try {
            // Get the file path for this qari and prayer
            const filePath = this.getAudioPath(qariId, prayer);
            if (!filePath) {
                console.warn(`No file path found for ${qariId} - ${prayer}`);
                return { exists: false, path: null };
            }
            
            // Check if we've already verified this file
            if (verifiedAudioFiles.has(filePath)) {
                return { exists: true, path: filePath };
            }
            
            // Try to verify the local file
            const exists = await this.verifyAudioFile(filePath);
            if (exists) {
                console.log(`Local resource found: ${filePath}`);
                return { exists: true, path: filePath };
            }
            
            // Check if we have a downloaded version
            const localStoragePath = `downloaded_${qariId}_${prayer}`;
            const downloadedData = localStorage.getItem(localStoragePath);
            if (downloadedData) {
                console.log(`Using downloaded resource for ${qariId} - ${prayer}`);
                return { exists: true, path: downloadedData, isDataUrl: true };
            }
            
            console.log(`No local resource found for ${qariId} - ${prayer}`);
            return { exists: false, path: filePath };
        } catch (error) {
            console.error(`Error checking local resources for ${qariId} - ${prayer}:`, error);
            return { exists: false, path: null, error };
        }
    }

    // Function to download Azan audio
    async downloadAzanAudio(qariId, prayer) {
        const downloadKey = `${qariId}_${prayer}`;
        
        // Check if download is already in progress
        if (pendingDownloads.has(downloadKey)) {
            console.log(`Download already in progress for ${qariId} - ${prayer}`);
            return pendingDownloads.get(downloadKey);
        }
        
        // Create a new download promise
        const downloadPromise = new Promise(async (resolve, reject) => {
            try {
                console.log(`Downloading Azan audio for ${qariId} - ${prayer}`);
                
                // Get the file path
                const filePath = this.getAudioPath(qariId, prayer);
                if (!filePath) {
                    throw new Error(`No file path found for ${qariId} - ${prayer}`);
                }
                
                // Fetch the audio file
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Failed to download audio: ${response.status} ${response.statusText}`);
                }
                
                // Convert to blob and then to data URL
                const blob = await response.blob();
                const reader = new FileReader();
                
                reader.onload = function() {
                    const dataUrl = reader.result;
                    
                    // Store in localStorage if not too large (max ~2MB)
                    if (dataUrl.length < 2000000) {
                        try {
                            const localStoragePath = `downloaded_${qariId}_${prayer}`;
                            localStorage.setItem(localStoragePath, dataUrl);
                            downloadedAudioFiles.set(downloadKey, dataUrl);
                            console.log(`Saved downloaded audio for ${qariId} - ${prayer}`);
                        } catch (storageError) {
                            console.warn(`Could not save to localStorage: ${storageError.message}`);
                        }
                    }
                    
                    // Remove from pending downloads
                    pendingDownloads.delete(downloadKey);
                    
                    // Resolve with the data URL
                    resolve({ success: true, dataUrl });
                };
                
                reader.onerror = function() {
                    pendingDownloads.delete(downloadKey);
                    reject(new Error('Failed to convert audio to data URL'));
                };
                
                reader.readAsDataURL(blob);
                
            } catch (error) {
                pendingDownloads.delete(downloadKey);
                console.error(`Error downloading audio for ${qariId} - ${prayer}:`, error);
                reject(error);
            }
        });
        
        // Store the promise
        pendingDownloads.set(downloadKey, downloadPromise);
        
        return downloadPromise;
    }

    // Show download option UI
    showDownloadOption(qariId, prayer, targetElement) {
        // Create download button if it doesn't exist
        const buttonId = `download-${qariId}-${prayer}`;
        let downloadButton = document.getElementById(buttonId);
        
        if (!downloadButton) {
            downloadButton = document.createElement('button');
            downloadButton.id = buttonId;
            downloadButton.className = 'download-azan-btn';
            downloadButton.innerHTML = '<span class="material-icons">cloud_download</span> Download';
            downloadButton.style.cssText = `
                background: #2196F3;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                margin: 5px 0;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                font-size: 0.9em;
            `;
            
            // Add click handler
            const self = this;
            downloadButton.addEventListener('click', async function() {
                try {
                    // Update button state
                    downloadButton.disabled = true;
                    downloadButton.innerHTML = '<span class="material-icons">downloading</span> Downloading...';
                    
                    // Download the audio
                    const result = await self.downloadAzanAudio(qariId, prayer);
                    
                    if (result.success) {
                        // Update button
                        downloadButton.innerHTML = '<span class="material-icons">check_circle</span> Downloaded';
                        downloadButton.style.background = '#4CAF50';
                        
                        // Remove button after a delay
                        setTimeout(() => {
                            downloadButton.remove();
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Download failed:', error);
                    downloadButton.innerHTML = '<span class="material-icons">error</span> Failed';
                    downloadButton.style.background = '#F44336';
                    
                    // Reset after delay
                    setTimeout(() => {
                        downloadButton.disabled = false;
                        downloadButton.innerHTML = '<span class="material-icons">cloud_download</span> Retry';
                    }, 3000);
                }
            });
            
            // Add to target element
            if (targetElement) {
                targetElement.appendChild(downloadButton);
            } else {
                // Find the prayer container using standard selectors
                const prayerContainers = document.querySelectorAll('.prayer-muazzin h3');
                let prayerContainer = null;
                
                // Find the container with the matching prayer name
                for (const container of prayerContainers) {
                    if (container.textContent.toLowerCase().includes(prayer.toLowerCase())) {
                        prayerContainer = container;
                        break;
                    }
                }
                
                if (prayerContainer) {
                    prayerContainer.parentElement.appendChild(downloadButton);
                } else {
                    // Fallback - add to body
                    document.body.appendChild(downloadButton);
                }
            }
        }
        
        return downloadButton;
    }
    
    // Helper method to get audio path for a qari and prayer
    getAudioPath(qariId, prayer) {
        // Check if qari exists
        if (!localAdhans[qariId]) {
            console.warn(`Qari ${qariId} not found`);
            return null;
        }
        
        // Get the audio path
        return localAdhans[qariId].files[prayer] || null;
    }
    
    // Helper method to get selected qari for a prayer
    getQariForPrayer(prayer) {
        const selectedQari = localStorage.getItem(`${prayer}Qari`);
        if (!selectedQari || !localAdhans[selectedQari]) {
            console.warn(`No valid Muazzin selected for ${prayer}, using default`);
            return 'default';
        }
        return selectedQari;
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
