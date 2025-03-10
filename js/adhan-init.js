// Add verifyAdhan function at the top
async function verifyAdhan() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 5;
        
        const checkAdhan = () => {
            if (typeof Adhan !== 'undefined') {
                console.log("Adhan library verified");
                resolve();
            } else if (attempts < maxAttempts) {
                attempts++;
                console.log(`Waiting for Adhan library... attempt ${attempts}`);
                
                // Try loading local version if CDN version is not available
                if (attempts === 3) {
                    console.log("Attempting to load local Adhan.js...");
                    const localScript = document.createElement('script');
                    localScript.src = 'js/adhan.js';
                    localScript.onerror = () => {
                        console.error("Failed to load local Adhan.js");
                    };
                    document.body.appendChild(localScript);
                }
                
                setTimeout(checkAdhan, 1000);
            } else {
                const error = new Error('Adhan library not available. Please refresh the page or try using a local version of Adhan.js');
                console.error(error);
                showError(error.message);
                reject(error);
            }
        };
        
        checkAdhan();
    });
}

// Add error display function
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #fee;
        color: #c00;
        padding: 1rem;
        margin: 1rem;
        border-radius: 4px;
        border: 1px solid #fcc;
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    errorDiv.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: #c00;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0 0.5rem;
    `;
    closeButton.onclick = () => errorDiv.remove();
    errorDiv.appendChild(closeButton);
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            errorDiv.remove();
        }
    }, 10000);
}

// Ensure Adhan.js is Fully Loaded Before Running Calculations
async function initializePrayerCalculations() {
    try {
        // Try to verify Adhan is available
        await verifyAdhan().catch(error => {
            console.warn("Adhan verification failed:", error);
            throw error;
        });

        console.log("Adhan library verified and ready");
        
        // Initialize calculation method first
        if (!localStorage.getItem('calculationMethod')) {
            localStorage.setItem('calculationMethod', 'MuslimWorldLeague');
            console.log("Set default calculation method: MuslimWorldLeague");
        }
        
        // Then get location and start calculations
        await getLocation();

        // Start periodic updates
        setInterval(calculatePrayerTimes, 60000); // Recalculate every minute
        
        // Initial calculation
        await calculatePrayerTimes();

    } catch (error) {
        console.warn("Error initializing prayer calculations:", error);
        showError("Error initializing prayer calculations. " + error.message);
        // Try fallback to API if Adhan fails
        console.log("Attempting API fallback due to initialization error...");
        await fallbackToAPI();
    }
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