// Verify Adhan library availability
async function verifyAdhan() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 5;
        
        const checkAdhan = () => {
            if (typeof Adhan !== 'undefined') {
                console.log("✓ Adhan library verified");
                resolve();
            } else if (attempts < maxAttempts) {
                attempts++;
                console.log(`Waiting for Adhan library... attempt ${attempts}`);
                setTimeout(checkAdhan, 1000);
            } else {
                reject(new Error('Adhan library not available after multiple attempts'));
            }
        };
        
        checkAdhan();
    });
}

// Initialize all prayer-related functionality
async function initializePrayerSystem() {
    try {
        // First verify Adhan is available
        await verifyAdhan();
        
        // Initialize calculation method
        if (!localStorage.getItem('calculationMethod')) {
            localStorage.setItem('calculationMethod', 'MuslimWorldLeague');
            console.log("Set default calculation method: MuslimWorldLeague");
        }

        // Initialize madhab
        if (!localStorage.getItem('madhab')) {
            localStorage.setItem('madhab', 'Shafi');
            console.log("Set default madhab: Shafi");
        }

        // Initialize Qari selection
        if (!localStorage.getItem('selectedQari')) {
            localStorage.setItem('selectedQari', 'mishary-rashid');
            console.log("Set default Qari: mishary-rashid");
        }

        // Start prayer calculations
        await calculatePrayerTimes();
        
        // Set up periodic updates
        setInterval(calculatePrayerTimes, 60000); // Update every minute
        
        console.log("✓ Prayer system initialized successfully");

    } catch (error) {
        console.error("Error initializing prayer system:", error);
        document.getElementById('locationDetails').innerHTML = 
            `<span class="error">Error: ${error.message}. Please refresh the page or try using a local version of Adhan.js</span>`;
            
        // Try API fallback
        console.log("Attempting API fallback...");
        await fallbackToAPI();
    }
}

// DOM Ready handler with Adhan verification
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Initialize AzanPlayer first
        if (window.AzanPlayer) {
            window.azanPlayer = new window.AzanPlayer();
            await window.azanPlayer.initializeQariSelectors();
        }

        // Then initialize prayer calculations
        await initializePrayerSystem();
        
    } catch (error) {
        console.error("Initialization error:", error);
        // Show error in UI
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p>Error loading prayer calculation system: ${error.message}</p>
            <p>Please ensure Adhan.js is properly loaded or try refreshing the page.</p>
        `;
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
}); 