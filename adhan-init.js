document.addEventListener('DOMContentLoaded', async function() {
    console.log("DOM Content Loaded - Initializing Adhan settings...");
    
    try {
        // Initialize DST settings first
        initializeDSTSettings();
        
        // Initialize prayer calculations
        await initializePrayerCalculations();
        
        // Initialize Qari selectors
        initializeQariSelectors();
        
        // Initialize notification settings
        initializeNotificationSettings();
        
        console.log("All Adhan settings initialized successfully");
    } catch (error) {
        console.error("Error during initialization:", error);
        showError("Failed to initialize Adhan settings. Please refresh the page.");
    }
}); 