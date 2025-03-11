// Global state
let adhanLoadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 3;
const LOAD_RETRY_DELAY = 1000; // 1 second

// Enhanced Adhan verification
async function verifyAdhan() {
    return new Promise((resolve, reject) => {
        const checkAdhan = () => {
            if (typeof Adhan !== 'undefined') {
                console.log("✓ Adhan.js loaded successfully");
                resolve(true);
                return;
            }

            adhanLoadAttempts++;
            console.log(`Checking Adhan.js availability (attempt ${adhanLoadAttempts}/${MAX_LOAD_ATTEMPTS})`);

            if (adhanLoadAttempts >= MAX_LOAD_ATTEMPTS) {
                console.error("× Adhan.js failed to load after maximum attempts");
                reject(new Error("Adhan.js not available"));
                return;
            }

            // Try loading from CDN first, then fallback to local
            if (adhanLoadAttempts === 2) {
                console.log("Attempting to load local Adhan.js...");
                loadLocalAdhan();
            }

            setTimeout(checkAdhan, LOAD_RETRY_DELAY);
        };

        checkAdhan();
    });
}

// Load local Adhan.js
function loadLocalAdhan() {
    const script = document.createElement('script');
    script.src = 'js/adhan.js';
    script.async = true;
    script.onerror = () => console.error("Failed to load local Adhan.js");
    document.body.appendChild(script);
}

// Initialize prayer system with enhanced error handling
async function initializePrayerSystem() {
    try {
        // Verify Adhan.js availability
        await verifyAdhan();

        // Initialize calculation method with fallback
        if (!localStorage.getItem('calculationMethod')) {
            localStorage.setItem('calculationMethod', 'MuslimWorldLeague');
            console.log("Set default calculation method: MuslimWorldLeague");
        }

        // Initialize madhab with fallback
        if (!localStorage.getItem('madhab')) {
            localStorage.setItem('madhab', 'Shafi');
            console.log("Set default madhab: Shafi");
        }

        // Initialize DST settings
        await initializeDSTSettings();

        // Start prayer calculations
        await calculatePrayerTimes();
        
        console.log("✓ Prayer system initialized successfully");
        return true;

    } catch (error) {
        console.error("Error initializing prayer system:", error);
        showError(`Prayer system initialization failed: ${error.message}`);
        
        // Attempt API fallback
        console.log("Attempting API fallback...");
        return await fallbackToAPI();
    }
}

// Enhanced error display
function showError(message, duration = 10000) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ff5252;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageText.style.margin = '0 0 10px 0';

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0 5px;
    `;
    closeButton.onclick = () => errorDiv.remove();

    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry';
    retryButton.style.cssText = `
        background: white;
        color: #ff5252;
        border: none;
        padding: 5px 15px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
    `;
    retryButton.onclick = async () => {
        errorDiv.remove();
        await initializePrayerSystem();
    };

    errorDiv.appendChild(closeButton);
    errorDiv.appendChild(messageText);
    errorDiv.appendChild(retryButton);
    document.body.appendChild(errorDiv);

    if (duration > 0) {
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                errorDiv.remove();
            }
        }, duration);
    }
}

// Helper function to safely call AzanPlayer methods
async function initializeQariSelectors() {
    console.log("Attempting to initialize Qari selectors...");
    
    // Check if AzanPlayer is available
    if (window.AzanPlayer && typeof window.AzanPlayer.initializeQariSelectors === 'function') {
        console.log("AzanPlayer found, calling initializeQariSelectors method");
        return await window.AzanPlayer.initializeQariSelectors();
    } else {
        console.warn("AzanPlayer not available yet, waiting...");
        
        // Wait for AzanPlayer to be available
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 10;
            const checkInterval = setInterval(() => {
                attempts++;
                
                if (window.AzanPlayer && typeof window.AzanPlayer.initializeQariSelectors === 'function') {
                    clearInterval(checkInterval);
                    console.log("AzanPlayer found after waiting, calling initializeQariSelectors method");
                    window.AzanPlayer.initializeQariSelectors()
                        .then(resolve)
                        .catch(reject);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    const error = new Error("AzanPlayer not available after maximum attempts");
                    console.error(error);
                    reject(error);
                } else {
                    console.log(`Waiting for AzanPlayer... attempt ${attempts}/${maxAttempts}`);
                }
            }, 1000);
        });
    }
}

// Initialize notification settings
function initializeNotificationSettings() {
    // Check if notification permission is already granted
    if (Notification.permission === "granted") {
        console.log("Notification permission already granted");
        document.getElementById('notificationBanner')?.classList.remove('show');
    } else if (Notification.permission !== "denied") {
        // Show notification banner if permission is not denied
        document.getElementById('notificationBanner')?.classList.add('show');
    }
}

// DOM Ready handler with enhanced initialization
document.addEventListener('DOMContentLoaded', async function() {
    console.log("DOM Content Loaded - Initializing Adhan settings...");
    
    try {
        // Initialize DST settings first
        await initializeDSTSettings();
        
        // Initialize prayer system
        await initializePrayerSystem();
        
        // Initialize Qari selectors
        await initializeQariSelectors();
        
        // Initialize notification settings
        initializeNotificationSettings();
        
        console.log("✓ All Adhan settings initialized successfully");
    } catch (error) {
        console.error("Error during initialization:", error);
        showError("Failed to initialize Adhan settings. Please refresh the page.");
    }
}); 