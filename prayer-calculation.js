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
                setTimeout(checkAdhan, 1000);
            } else {
                reject(new Error('Adhan library not available'));
            }
        };
        
        checkAdhan();
    });
}

// Get user's location
async function getLocation() {
    return new Promise((resolve, reject) => {
        console.log("Getting user location...");
        
        // Check if we already have coordinates
        if (window.latitude && window.longitude) {
            console.log(`Using existing coordinates: ${window.latitude}, ${window.longitude}`);
            resolve({ latitude: window.latitude, longitude: window.longitude });
            return;
        }
        
        // Check if there's a global getLocation function
        if (typeof window.getLocation === 'function') {
            console.log("Using global getLocation function");
            
            // Override the showPosition function temporarily
            const originalShowPosition = window.showPosition;
            window.showPosition = function(position) {
                // Call the original function
                if (originalShowPosition) originalShowPosition(position);
                
                // Store coordinates globally
                window.latitude = position.coords.latitude;
                window.longitude = position.coords.longitude;
                
                // Resolve the promise
                resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                
                // Restore original function
                window.showPosition = originalShowPosition;
            };
            
            // Call the global getLocation function
            window.getLocation();
            
            // Set a timeout in case getLocation fails
            setTimeout(() => {
                // Use default coordinates if getLocation fails
                console.warn("Location request timed out, using default coordinates (Makkah)");
                window.latitude = 21.4225;  // Makkah coordinates as default
                window.longitude = 39.8262;
                resolve({ latitude: window.latitude, longitude: window.longitude });
            }, 10000);
            
            return;
        }
        
        // If no global getLocation, use the Geolocation API directly
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    window.latitude = position.coords.latitude;
                    window.longitude = position.coords.longitude;
                    console.log(`Got coordinates: ${window.latitude}, ${window.longitude}`);
                    resolve({ latitude: window.latitude, longitude: window.longitude });
                },
                (error) => {
                    console.warn("Geolocation error:", error);
                    // Use default coordinates
                    window.latitude = 21.4225;  // Makkah coordinates as default
                    window.longitude = 39.8262;
                    resolve({ latitude: window.latitude, longitude: window.longitude });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            console.warn("Geolocation not supported, using default coordinates (Makkah)");
            window.latitude = 21.4225;  // Makkah coordinates as default
            window.longitude = 39.8262;
            resolve({ latitude: window.latitude, longitude: window.longitude });
        }
    });
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
        // Try fallback to API if Adhan fails
        console.log("Attempting API fallback due to initialization error...");
        await fallbackToAPI();
    }
}

// Enhanced API Fallback System
async function fallbackToAPI() {
    console.log("Falling back to API for prayer times...");
    
    try {
        // Try Aladhan API first
        let times = await tryAladhanAPI();
        
        if (!times) {
            // If Aladhan fails, try PrayTimes API
            times = await tryPrayTimesAPI();
        }
        
        if (!times) {
            throw new Error('Both APIs failed to provide prayer times');
        }

        // Calculate optional prayers
        times.tahajjud = calculateTahajjudTime(times.isha, times.fajr);
        times.suhoor = calculateSuhoorTime(times.fajr);
        times.ishraq = calculateIshraqTime(times.sunrise);

        // Update UI with all prayer times
        updateTimesFromAPI(times);
        
        return times;
    } catch (error) {
        console.error('API fallback failed:', error);
        throw error;
    }
}

async function tryAladhanAPI() {
    try {
        console.log("Attempting Aladhan API...");
        const date = moment().format('DD-MM-YYYY');
        const method = getApiMethodNumber(currentCalculationMethod);
        const school = currentMadhab === 'Hanafi' ? 1 : 0;
        
        console.log(`API Parameters:`, {
            method: method,
            school: school,
            madhab: currentMadhab,
            latitude: window.latitude,
            longitude: window.longitude
        });

        const apiUrl = `https://api.aladhan.com/v1/timings/${date}`;
        const params = new URLSearchParams({
            latitude: window.latitude.toString(),
            longitude: window.longitude.toString(),
            method: method.toString(),
            school: school.toString(),
            adjustment: '1',
            tune: '0,0,0,0,0,0,0,0,0',
            midnightMode: '0',
            timezonestring: Intl.DateTimeFormat().resolvedOptions().timeZone
        });

        const response = await fetch(`${apiUrl}?${params}`);
        if (!response.ok) throw new Error(`Aladhan API: ${response.status}`);

        const data = await response.json();
        if (data.code !== 200 || !data.data?.timings) {
            throw new Error('Invalid Aladhan API response');
        }

        const times = {
            fajr: moment(data.data.timings.Fajr, 'HH:mm'),
            sunrise: moment(data.data.timings.Sunrise, 'HH:mm'),
            dhuhr: moment(data.data.timings.Dhuhr, 'HH:mm'),
            asr: moment(data.data.timings.Asr, 'HH:mm'),
            maghrib: moment(data.data.timings.Maghrib, 'HH:mm'),
            isha: moment(data.data.timings.Isha, 'HH:mm')
        };

        // Validate times before returning
        if (!validatePrayerTimes(times)) {
            throw new Error('Invalid prayer times received from API');
        }

        console.log('Prayer times successfully retrieved from Aladhan API');
        return {
            ...times,
            metadata: {
                source: 'aladhan',
                method: data.data.meta?.method?.name || currentCalculationMethod,
                madhab: currentMadhab
            }
        };

    } catch (error) {
        console.error("Aladhan API failed:", error);
        return null;
    }
}

async function tryPrayTimesAPI() {
    try {
        console.log("Attempting PrayTimes API...");
        const date = new Date();
        const apiUrl = 'https://api.pray.zone/v2/times/today.json';
        const params = new URLSearchParams({
            latitude: window.latitude.toString(),
            longitude: window.longitude.toString(),
            elevation: '0',
            school: currentMadhab.toLowerCase(),
            method: getPrayTimesMethod(currentCalculationMethod)
        });

        const response = await fetch(`${apiUrl}?${params}`);
        if (!response.ok) throw new Error(`PrayTimes API: ${response.status}`);

        const data = await response.json();
        if (!data.results?.datetime?.[0]?.times) {
            throw new Error('Invalid PrayTimes API response');
        }

        const times = data.results.datetime[0].times;
        return {
            fajr: moment(times.Fajr, 'HH:mm'),
            sunrise: moment(times.Sunrise, 'HH:mm'),
            dhuhr: moment(times.Dhuhr, 'HH:mm'),
            asr: moment(times.Asr, 'HH:mm'),
            maghrib: moment(times.Maghrib, 'HH:mm'),
            isha: moment(times.Isha, 'HH:mm'),
            metadata: {
                source: 'praytimes',
                method: data.results?.settings?.method || currentCalculationMethod,
                madhab: data.results?.settings?.school || currentMadhab
            }
        };

    } catch (error) {
        console.error("PrayTimes API failed:", error);
        return null;
    }
}

function updateTimesFromAPI(times) {
    if (!validatePrayerTimes(times)) {
        throw new Error('Invalid prayer times received from API');
    }

    // Calculate optional prayers if not already present
    if (!times.tahajjud) {
        times.tahajjud = calculateTahajjudTime(times.isha, times.fajr);
    }
    if (!times.suhoor) {
        times.suhoor = calculateSuhoorTime(times.fajr);
    }
    if (!times.ishraq) {
        times.ishraq = calculateIshraqTime(times.sunrise);
    }

    // Update current times
    currentPrayerTimes = { ...times };

    // Update UI with all prayer times
    updatePrayerTimesUI(times);

    // Log the source and method used
    console.log(`Prayer times updated from ${times.metadata?.source || 'unknown'} using ${times.metadata?.method || currentCalculationMethod} method`);
    
    return times;
}

// Helper function to map calculation methods to PrayTimes API format
function getPrayTimesMethod(method) {
    const methodMap = {
        'MuslimWorldLeague': 'MWL',
        'Egyptian': 'EGYPT',
        'Karachi': 'KARACHI',
        'UmmAlQura': 'MAKKAH',
        'Dubai': 'DUBAI',
        'MoonsightingCommittee': 'MOON_SIGHTING',
        'NorthAmerica': 'ISNA',
        'Kuwait': 'KUWAIT',
        'Qatar': 'QATAR',
        'Singapore': 'SINGAPORE'
    };
    return methodMap[method] || 'MWL';
}

// Get Calculation Parameters
function getCalculationParameters() {
    try {
        if (typeof Adhan === 'undefined') {
            throw new Error('Adhan library not available');
        }

        let params;
        
        // Get the calculation method
        if (Adhan.CalculationMethod[currentCalculationMethod]) {
            params = Adhan.CalculationMethod[currentCalculationMethod]();
        } else {
            console.warn(`Invalid calculation method: ${currentCalculationMethod}, using default`);
            params = Adhan.CalculationMethod.MuslimWorldLeague();
        }

        // Set madhab for Asr calculation
        params.madhab = currentMadhab === 'Hanafi' ? 
            Adhan.Madhab.Hanafi : 
            Adhan.Madhab.Shafi;
        
        // Set method adjustments
        const method = CALCULATION_METHODS[currentCalculationMethod];
        if (method && method.adjustments) {
            params.methodAdjustments = method.adjustments;
        }

        // Set polar circle resolution
        params.polarCircleResolution = Adhan.PolarCircleResolution.AqrabBalad;
        
        // Set rounding to nearest minute
        params.rounding = true;

        console.log('Calculation parameters:', {
            method: currentCalculationMethod,
            madhab: currentMadhab,
            adjustments: params.methodAdjustments,
            highLatitudeRule: params.highLatitudeRule
        });

        return params;

    } catch (error) {
        console.error('Error setting calculation parameters:', error);
        return null;
    }
}

// Validate Prayer Times
function validatePrayerTimes(times) {
    const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    
    // Check if times object exists
    if (!times || typeof times !== 'object') {
        console.error('Invalid prayer times object');
        return false;
    }

    // Validate existence and validity of each prayer time
    for (const prayer of prayers) {
        if (!times[prayer]) {
            console.error(`Missing time for ${prayer}`);
            return false;
        }
        if (!moment.isMoment(times[prayer])) {
            console.error(`${prayer} time is not a valid moment object`);
            return false;
        }
        if (!times[prayer].isValid()) {
            console.error(`Invalid time format for ${prayer}`);
            return false;
        }
    }

    // Validate prayer sequence
    let previousTime = times[prayers[0]];
    for (let i = 1; i < prayers.length; i++) {
        const currentTime = times[prayers[i]];
        const timeDiff = currentTime.diff(previousTime, 'minutes');
        
        if (timeDiff <= 0) {
            console.error(`Prayer sequence error: ${prayers[i]} (${currentTime.format('HH:mm')}) ` +
                         `should be after ${prayers[i-1]} (${previousTime.format('HH:mm')})`);
            return false;
        }

        // Check for unreasonable time gaps
        if (timeDiff > 720) { // More than 12 hours
            console.error(`Suspicious time gap between ${prayers[i-1]} and ${prayers[i]}: ${timeDiff} minutes`);
            return false;
        }

        previousTime = currentTime;
    }

    // Validate specific prayer time relationships
    const validations = [
        {
            condition: times.dhuhr.hours() < 11 || times.dhuhr.hours() > 13,
            message: 'Dhuhr time should be around noon (11:00-13:00)'
        },
        {
            condition: times.fajr.hours() > 7,
            message: 'Fajr time seems too late (after 7:00)'
        },
        {
            condition: times.isha.hours() < 18,
            message: 'Isha time seems too early (before 18:00)'
        }
    ];

    for (const validation of validations) {
        if (validation.condition) {
            console.error(`Time validation error: ${validation.message}`);
            return false;
        }
    }

    // High latitude specific validations
    if (Math.abs(window.latitude) >= 45) {
        const fajrDhuhr = moment.duration(times.dhuhr.diff(times.fajr)).asHours();
        const dhuhrMaghrib = moment.duration(times.maghrib.diff(times.dhuhr)).asHours();
        const maghribIsha = moment.duration(times.isha.diff(times.maghrib)).asHours();

        const highLatitudeValidations = [
            {
                condition: fajrDhuhr < 1 || fajrDhuhr > 18,
                message: `Invalid Fajr-Dhuhr duration: ${fajrDhuhr.toFixed(1)} hours`
            },
            {
                condition: dhuhrMaghrib < 1 || dhuhrMaghrib > 12,
                message: `Invalid Dhuhr-Maghrib duration: ${dhuhrMaghrib.toFixed(1)} hours`
            },
            {
                condition: maghribIsha < 0.5 || maghribIsha > 6,
                message: `Invalid Maghrib-Isha duration: ${maghribIsha.toFixed(1)} hours`
            }
        ];

        for (const validation of highLatitudeValidations) {
            if (validation.condition) {
                console.error(`High latitude validation error: ${validation.message}`);
                return false;
            }
        }
    }

    return true;
}

// High Latitude Adjustments
function getHighLatitudeRule() {
    if (!window.latitude) return null;

    const lat = Math.abs(window.latitude);
    if (lat >= 65) return Adhan.HighLatitudeRule.SeventhOfTheNight;
    if (lat >= 55) return Adhan.HighLatitudeRule.TwilightAngle;
    if (lat >= 45) return Adhan.HighLatitudeRule.MiddleOfTheNight;
    return null;
}

// Initialize Everything on Page Load
window.onload = async function () {
    console.log("Window fully loaded. Initializing prayer calculations...");
    
    try {
        // Initialize madhab from localStorage or set default
        currentMadhab = localStorage.getItem('madhab') || 'Shafi';
        console.log(`Initialized with madhab: ${currentMadhab}`);

        // Set up madhab radio button event listeners
        document.querySelectorAll('input[name="madhab"]').forEach(input => {
            input.addEventListener('change', async (e) => {
                if (e.target.checked) {
                    await handleMadhabChange(e.target.value);
                }
            });
        });

        // Set initial madhab radio button state
        const madhabInput = document.querySelector(`input[name="madhab"][value="${currentMadhab}"]`);
        if (madhabInput) {
            madhabInput.checked = true;
        }

        // Wait for Adhan to be available
        await verifyAdhan();

        // Set default calculation method if not already set
        if (!localStorage.getItem('calculationMethod')) {
            localStorage.setItem('calculationMethod', 'MuslimWorldLeague');
            console.log("Set default calculation method: MuslimWorldLeague");
        }

        // Set default Qari if not already set
        if (!localStorage.getItem('selectedQari')) {
            localStorage.setItem('selectedQari', 'mishary-rashid');
            console.log("Set default Qari: mishary-rashid");
        }

        // Initialize calculations
        await initializePrayerCalculations();

    } catch (error) {
        console.error("Error during initialization:", error);
        document.getElementById('locationDetails').innerHTML = 
            `<span class="error">Error loading prayer calculation dependencies. Please refresh the page. Error: ${error.message}</span>`;
        
        // Try to recover using API fallback
        if (error.message.includes('Adhan')) {
            console.log("Attempting API fallback due to Adhan load failure...");
            await fallbackToAPI();
        }
    }
};

// Update the main prayer calculation function to handle DST transitions
async function calculatePrayerTimes(retryCount = 3) {
    try {
        if (!window.latitude || !window.longitude) {
            console.error('Location coordinates not available, requesting location...');
            
            // Try to get location again
            try {
                await getLocation();
            } catch (error) {
                console.error("Error getting location:", error);
                // Use default coordinates
                window.latitude = 21.4225;  // Makkah coordinates as default
                window.longitude = 39.8262;
            }
            
            // Check again after attempting to get location
            if (!window.latitude || !window.longitude) {
                throw new Error('Location coordinates still not available after retry');
            }
        }

        // Create coordinates object
        const coordinates = new Adhan.Coordinates(window.latitude, window.longitude);
        const date = new Date();
        
        // Check for DST transition
        const dstAdjustment = getDSTAdjustment(date);
        if (dstAdjustment !== 0) {
            console.log(`DST is in effect with adjustment of ${dstAdjustment} hours`);
        }
        
        // Get calculation parameters based on method
        const params = getCalculationParameters();

        // Handle high latitude adjustments
        if (Math.abs(window.latitude) >= 45) {
            params.highLatitudeRule = getHighLatitudeRule();
            console.log(`Using high latitude rule: ${params.highLatitudeRule}`);
        }

        try {
            // Get timezone with DST awareness
            const timezone = getTimezoneWithDST(date);
            console.log(`Using timezone offset: ${timezone}`);
            
            // Calculate prayer times using Adhan.js
            const prayerTimes = new Adhan.PrayerTimes(coordinates, date, params);
            
            // Format times using moment.js
            const times = {
                fajr: moment(prayerTimes.fajr),
                sunrise: moment(prayerTimes.sunrise),
                dhuhr: moment(prayerTimes.dhuhr),
                asr: moment(prayerTimes.asr),
                maghrib: moment(prayerTimes.maghrib),
                isha: moment(prayerTimes.isha)
            };

            // Validate prayer times
            if (!validatePrayerTimes(times)) {
                throw new Error('Invalid prayer times calculated');
            }

            // Calculate optional prayer times
            times.tahajjud = calculateTahajjudTime(times.isha, times.fajr);
            times.suhoor = calculateSuhoorTime(times.fajr);
            times.ishraq = calculateIshraqTime(times.sunrise);

            // Store times for countdown
            currentPrayerTimes = { ...times };

            // Update UI
            updatePrayerTimesUI(times);
            
            return times;

        } catch (localError) {
            console.error("Local calculation failed:", localError);
            
            // Fallback to Al Adhan API
            return await fallbackToAPI();
        }

    } catch (error) {
        console.error("Error calculating prayer times:", error);
        
        if (retryCount > 0) {
            console.log(`Retrying calculation (${retryCount} attempts left)...`);
            return calculatePrayerTimes(retryCount - 1);
        }
        
        document.getElementById('locationDetails').innerHTML += `<br>Error calculating prayer times: ${error.message}. Please try refreshing the page.`;
        
        // Clear all time displays
        ['tahajjud', 'suhoor', 'fajr', 'sunrise', 'ishraq', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
            const timeElement = document.getElementById(`${prayer}Time`);
            if (timeElement) {
                timeElement.textContent = '--:--';
            }
        });
        
        // Try API fallback as last resort
        return await fallbackToAPI();
    }
}

// Calculate times for a specific date
function calculateTimesForDate(date) {
    console.log("Calculating times with method:", currentCalculationMethod);
    const method = CALCULATION_METHODS[currentCalculationMethod];
    if (!method) {
        console.error("Invalid calculation method:", currentCalculationMethod);
        currentCalculationMethod = 'MuslimWorldLeague';
        localStorage.setItem('calculationMethod', currentCalculationMethod);
        return calculateTimesForDate(date);
    }

    const jDate = julianDate(date);
    const times = {};

    // Calculate solar position
    const solarPosition = calculateSolarPosition(jDate);

    // Calculate base prayer times
    const baseTimes = {
        fajr: calculateFajrTime(date, method.fajrAngle, solarPosition.declination, solarPosition.equationOfTime),
        sunrise: calculateSunrise(date, solarPosition.declination, solarPosition.equationOfTime),
        dhuhr: calculateDhuhr(date, solarPosition.equationOfTime),
        asr: calculateAsr(date, solarPosition.declination, solarPosition.equationOfTime),
        maghrib: calculateMaghrib(date, solarPosition.declination, solarPosition.equationOfTime),
        isha: method.ishaMinutes ? 
            moment(baseTimes.maghrib).add(method.ishaMinutes, 'minutes') :
            calculateIshaTime(date, method.ishaAngle, solarPosition.declination, solarPosition.equationOfTime)
    };

    // Apply method-specific adjustments
    Object.entries(baseTimes).forEach(([prayer, time]) => {
        times[prayer] = calculatePrayerTimeWithAdjustments(time, prayer, method);
    });

    return times;
}

// Enhanced Solar Position Calculations
function calculateSolarPosition(jd) {
    // Julian centuries since J2000.0
    const T = (jd - 2451545.0) / 36525.0;
    
    // Mean elements
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T; // Mean longitude [degrees]
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;  // Mean anomaly [degrees]
    
    // Equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
            + 0.000289 * Math.sin(3 * M * Math.PI / 180);
    
    // Sun's true longitude and true anomaly
    const L = L0 + C;
    
    // Sun's apparent longitude
    const omega = 125.04 - 1934.136 * T;
    const lambda = L - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
    
    // Obliquity of the ecliptic
    const epsilon = 23.43929111 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
    
    // Convert to radians for final calculations
    const lambdaRad = lambda * Math.PI / 180;
    const epsilonRad = epsilon * Math.PI / 180;
    
    // Right ascension and declination
    const alpha = Math.atan2(
        Math.cos(epsilonRad) * Math.sin(lambdaRad),
        Math.cos(lambdaRad)
    ) * 180 / Math.PI;
    
    const delta = Math.asin(
        Math.sin(epsilonRad) * Math.sin(lambdaRad)
    ) * 180 / Math.PI;
    
    // Equation of time components
    const y = Math.tan(epsilonRad/2) * Math.tan(epsilonRad/2);
    const eot = y * Math.sin(2 * L0 * Math.PI / 180) 
              - 2 * (M * Math.PI / 180) 
              + 4 * Math.sin(M * Math.PI / 180) * (1 + y * Math.cos(2 * L0 * Math.PI / 180));
    
    return {
        declination: delta,
        rightAscension: alpha,
        equationOfTime: eot * 4  // Convert to minutes
    };
}

function calculatePrayerTime(h, decl, lat) {
    // Convert angles to radians
    const hRad = h * Math.PI / 180;
    const declRad = decl * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    
    // Calculate hour angle using the provided formula
    const cosH = (Math.sin(hRad) - Math.sin(latRad) * Math.sin(declRad)) / 
                 (Math.cos(latRad) * Math.cos(declRad));
                 
    // Check if prayer time is possible at this latitude
    if (Math.abs(cosH) > 1) {
        throw new Error('Prayer time not possible at this latitude');
    }
    
    // Convert hour angle to hours
    const H = Math.acos(cosH) * 180 / Math.PI / 15;
    
    return H;
}

// Enhanced DST handling with user preferences
let dstHandlingMode = 'auto'; // Default to automatic
let customDstAdjustment = 0;  // Default to no adjustment

// Initialize DST settings
function initializeDSTSettings() {
    console.log("Initializing DST settings...");
    
    // Load saved DST handling preference
    dstHandlingMode = localStorage.getItem('dstHandlingMode') || 'auto';
    customDstAdjustment = parseInt(localStorage.getItem('customDstAdjustment') || '0');
    
    // Set up radio buttons
    const dstRadios = document.querySelectorAll('input[name="dstHandling"]');
    dstRadios.forEach(radio => {
        if (radio.value === dstHandlingMode) {
            radio.checked = true;
        }
        
        radio.addEventListener('change', function() {
            if (this.checked) {
                dstHandlingMode = this.value;
                localStorage.setItem('dstHandlingMode', dstHandlingMode);
                
                // Enable/disable custom adjustment dropdown
                const customAdjustment = document.getElementById('customDstAdjustment');
                if (customAdjustment) {
                    customAdjustment.disabled = (dstHandlingMode !== 'custom');
                }
                
                // Recalculate prayer times with new DST settings
                calculatePrayerTimes().then(() => {
                    console.log("Prayer times recalculated with new DST settings");
                }).catch(error => {
                    console.error("Error recalculating prayer times:", error);
                });
                
                // Update DST status display
                updateDSTStatus();
            }
        });
    });
    
    // Set up custom adjustment dropdown
    const customAdjustment = document.getElementById('customDstAdjustment');
    if (customAdjustment) {
        customAdjustment.value = customDstAdjustment.toString();
        customAdjustment.disabled = (dstHandlingMode !== 'custom');
        
        customAdjustment.addEventListener('change', function() {
            customDstAdjustment = parseInt(this.value);
            localStorage.setItem('customDstAdjustment', customDstAdjustment.toString());
            
            // Recalculate prayer times with new adjustment
            calculatePrayerTimes().then(() => {
                console.log("Prayer times recalculated with new DST adjustment");
            }).catch(error => {
                console.error("Error recalculating prayer times:", error);
            });
        });
    }
    
    // Update DST status display
    updateDSTStatus();
}

// Update DST status display
function updateDSTStatus() {
    const dstStatusElement = document.getElementById('dstStatus');
    const timeZoneInfoElement = document.getElementById('timeZoneInfo');
    
    if (dstStatusElement && timeZoneInfoElement) {
        const date = new Date();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isDST = getDSTAdjustment(date) > 0;
        
        // Update time zone info
        timeZoneInfoElement.textContent = `${timeZone} (UTC${getFormattedTimezoneOffset()})`;
        
        // Update DST status based on mode
        switch (dstHandlingMode) {
            case 'auto':
                dstStatusElement.textContent = isDST ? 
                    "Active (automatically detected)" : 
                    "Inactive (automatically detected)";
                dstStatusElement.style.color = isDST ? "#4CAF50" : "#F44336";
                break;
            case 'always':
                dstStatusElement.textContent = "Always active (manual override)";
                dstStatusElement.style.color = "#4CAF50";
                break;
            case 'never':
                dstStatusElement.textContent = "Always inactive (manual override)";
                dstStatusElement.style.color = "#F44336";
                break;
            case 'custom':
                const adjustment = customDstAdjustment;
                const sign = adjustment > 0 ? "+" : adjustment < 0 ? "-" : "";
                dstStatusElement.textContent = `Custom adjustment: ${sign}${Math.abs(adjustment)} hour(s)`;
                dstStatusElement.style.color = adjustment !== 0 ? "#2196F3" : "#F44336";
                break;
        }
    }
}

// Get formatted timezone offset
function getFormattedTimezoneOffset() {
    const offset = -new Date().getTimezoneOffset() / 60;
    const sign = offset >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offset));
    const minutes = Math.abs(offset % 1) * 60;
    
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Enhanced DST detection with user preferences
function getDSTAdjustment(date) {
    switch (dstHandlingMode) {
        case 'auto':
            // Original automatic detection
            const januaryDate = new Date(date.getFullYear(), 0, 1);
            const currentDate = new Date(date);
            
            const januaryOffset = januaryDate.getTimezoneOffset();
            const currentOffset = currentDate.getTimezoneOffset();
            
            const isDST = currentOffset < januaryOffset;
            return isDST ? (januaryOffset - currentOffset) / 60 : 0;
            
        case 'always':
            // Always use DST (typically +1 hour)
            return 1;
            
        case 'never':
            // Never use DST
            return 0;
            
        case 'custom':
            // Use custom adjustment
            return customDstAdjustment;
            
        default:
            console.warn(`Unknown DST handling mode: ${dstHandlingMode}, defaulting to auto`);
            return getDSTAdjustment(date); // Recursive call with default mode
    }
}

// Update timezone calculation with enhanced DST awareness
function getTimezoneWithDST(date) {
    const standardTimezoneOffset = -new Date().getTimezoneOffset() / 60;
    const dstAdjustment = getDSTAdjustment(date);
    
    console.log(`Timezone calculation: Standard offset: ${standardTimezoneOffset}, DST adjustment: ${dstAdjustment}, Mode: ${dstHandlingMode}`);
    
    // For 'auto' mode, the standard offset already includes DST if applicable
    // For other modes, we need to adjust based on the selected mode
    if (dstHandlingMode === 'auto') {
        return standardTimezoneOffset;
    } else {
        // Get the base timezone without DST
        const baseTimezone = standardTimezoneOffset - (getDSTAdjustment(new Date()) * (dstHandlingMode === 'auto' ? 1 : 0));
        return baseTimezone + dstAdjustment;
    }
}

// Update the prayer time calculation functions
function calculateDhuhr(date, eqt) {
    // Dhuhr time calculation using provided formula with DST awareness
    const timezone = getTimezoneWithDST(date);
    const dhuhrTime = 12 + eqt/60 - window.longitude/15 + timezone;
    
    return moment(date)
        .hours(Math.floor(dhuhrTime))
        .minutes(Math.round((dhuhrTime % 1) * 60));
}

function calculateTimeByAngle(date, angle, isBefore, decl, eqt) {
    try {
        // Get timezone offset with DST awareness
        const timezone = getTimezoneWithDST(date);
        
        // Calculate hour angle
        const H = calculatePrayerTime(angle, decl, window.latitude);
        
        // Convert to local time
        let time = 12 + (isBefore ? -H : H) + eqt/60 - window.longitude/15 + timezone;
        
        // Normalize time to 0-24 range
        time = (time + 24) % 24;
        
        return moment(date)
            .hours(Math.floor(time))
            .minutes(Math.round((time % 1) * 60));
    } catch (error) {
        console.error('Error calculating prayer time:', error);
        throw error;
    }
}

// Enhanced Prayer Time Notification Handler
async function handlePrayerTime(prayer, time) {
    try {
        // Prevent duplicate notifications within the same minute
        const notificationKey = `${prayer}_${time.format('YYYY-MM-DD_HH:mm')}`;
        if (localStorage.getItem(notificationKey)) {
            return;
        }

        // Get current Muazzin selection with fallback chain
        const selectedQari = localStorage.getItem('selectedQari') || 
                           localStorage.getItem('lastWorkingQari') || 
                           'mishary-rashid';
        
        // Determine if it's Fajr time (needs special Azan)
        const isFajr = prayer.toLowerCase() === 'fajr';
        
        // Notify the Azan player to prepare and play the appropriate Azan
        if (window.AzanPlayer) {
            console.log(`Preparing ${prayer} Azan with Qari: ${selectedQari}`);
            try {
                await window.AzanPlayer.playAzan(selectedQari, isFajr);
                // Store last working Qari
                localStorage.setItem('lastWorkingQari', selectedQari);
            } catch (azanError) {
                console.error('Error playing Azan, trying fallback:', azanError);
                // Try fallback Qari
                const fallbackQari = 'mishary-rashid';
                await window.AzanPlayer.playAzan(fallbackQari, isFajr);
            }
        } else {
            console.error('AzanPlayer not initialized');
        }
        
        // Show notification if enabled
        if (Notification.permission === "granted") {
            try {
                const notification = new Notification(`Time for ${prayer}`, {
                    body: `It's time for ${prayer} (${time.format('h:mm A')})\nQari: ${selectedQari}`,
                    icon: '/icons/prayer.png',
                    silent: true // Prevent double sound with Azan
                });

                // Close notification after Azan duration
                setTimeout(() => notification.close(), 60000); // Close after 1 minute
            } catch (notificationError) {
                console.error('Error showing notification:', notificationError);
            }
        }

        // Mark this notification as shown
        localStorage.setItem(notificationKey, 'true');
        // Clean up old notification markers
        cleanupNotificationHistory();

    } catch (error) {
        console.error(`Error handling prayer time for ${prayer}:`, error);
    }
}

// Cleanup old notification history
function cleanupNotificationHistory() {
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('_' + yesterday)) {
            localStorage.removeItem(key);
        }
    }
}

// Enhanced Update Prayer Times UI
function updatePrayerTimesUI(times) {
    const now = moment();
    let nextPrayer = null;
    let nextPrayerTime = null;

    try {
        Object.entries(times).forEach(([prayer, time]) => {
            // Update UI elements
            const timeElement = document.getElementById(`${prayer}Time`);
            if (timeElement) {
                timeElement.textContent = time.format('h:mm A');
                
                // Add countdown for next prayer
                const countdownElement = document.getElementById(`${prayer}Countdown`);
                if (countdownElement) {
                    const diff = time.diff(now, 'minutes');
                    if (diff > 0) {
                        const hours = Math.floor(diff / 60);
                        const minutes = diff % 60;
                        countdownElement.textContent = hours > 0 ? 
                            `${hours}h ${minutes}m remaining` : 
                            `${minutes}m remaining`;
                    } else {
                        countdownElement.textContent = '';
                    }
                }
            }

            // Check if this prayer time has just arrived (within the last minute)
            const diff = time.diff(now, 'seconds');
            if (diff >= 0 && diff <= 60) {
                handlePrayerTime(prayer, time);
            }

            // Track next prayer
            if (time.isAfter(now) && (!nextPrayerTime || time.isBefore(nextPrayerTime))) {
                nextPrayer = prayer;
                nextPrayerTime = time;
            }
        });

        // Update next prayer indicator
        document.querySelectorAll('.prayer-card').forEach(card => {
            card.classList.remove('active');
            if (card.id === `${nextPrayer}Card`) {
                card.classList.add('active');
            }
        });

    } catch (error) {
        console.error('Error updating prayer times UI:', error);
        // Attempt to recover UI
        document.querySelectorAll('.prayer-card').forEach(card => {
            if (!card.querySelector('p').textContent) {
                card.querySelector('p').textContent = '--:--';
            }
        });
    }
}

// Enhanced Prayer Time Calculation Methods with PrayTimes.org parameters
const CALCULATION_METHODS = {
    // Standard Methods
    MuslimWorldLeague: {
        name: 'Muslim World League',
        fajrAngle: 18,
        ishaAngle: 17,
        region: 'Global',
        description: 'Standard method used by the Muslim World League',
        adjustments: {
            fajr: 0,
            sunrise: -1,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0
        }
    },
    Egyptian: {
        name: 'Egyptian General Authority',
        fajrAngle: 19.5,
        ishaAngle: 17.5,
        region: 'Egypt and parts of Africa',
        description: 'Used in Egypt, Sudan, and parts of Africa',
        adjustments: {
            fajr: 0,
            sunrise: -1,
            dhuhr: 1,
            asr: 0,
            maghrib: 1,
            isha: 0
        }
    },
    // Add PrayTimes.org specific methods
    ISNA: {
        name: 'Islamic Society of North America',
        fajrAngle: 15,
        ishaAngle: 15,
        region: 'North America',
        description: 'Used by ISNA in North America',
        adjustments: {
            fajr: 0,
            sunrise: -2,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0
        }
    },
    MWL: {
        name: 'Muslim World League (Alternative)',
        fajrAngle: 18,
        ishaAngle: 17,
        region: 'Europe',
        description: 'Used in Europe, Far East, and parts of America',
        adjustments: {
            fajr: 0,
            sunrise: -1,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0
        }
    },
    Makkah: {
        name: 'Umm Al-Qura University, Makkah',
        fajrAngle: 18.5,
        ishaMinutes: 90,
        region: 'Arabian Peninsula',
        description: 'Used in the Arabian Peninsula',
        adjustments: {
            fajr: 0,
            sunrise: -1,
            dhuhr: 5,
            asr: 0,
            maghrib: 3,
            isha: 0
        }
    },
    Karachi: {
        name: 'University of Islamic Sciences, Karachi',
        fajrAngle: 18,
        ishaAngle: 18,
        region: 'Pakistan, Bangladesh, India',
        description: 'Used in South Asia',
        adjustments: {
            fajr: 0,
            sunrise: -1,
            dhuhr: 1,
            asr: 0,
            maghrib: 0,
            isha: 0
        }
    },
    // Add more regional methods
    Tehran: {
        name: 'Institute of Geophysics, Tehran',
        fajrAngle: 17.7,
        maghribAngle: 4.5,
        ishaAngle: 14,
        region: 'Iran',
        description: 'Used in Iran and some Shi\'a communities',
        adjustments: {
            fajr: 0,
            sunrise: 0,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0
        }
    },
    // Add custom calculation method
    Custom: {
        name: 'Custom Method',
        fajrAngle: 18,
        ishaAngle: 17,
        region: 'Custom',
        description: 'User-defined calculation method',
        adjustments: {
            fajr: 0,
            sunrise: 0,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0
        }
    }
};

// Enhanced calculation function with PrayTimes.org adjustments
function calculatePrayerTimeWithAdjustments(baseTime, prayer, method) {
    if (!method.adjustments || !method.adjustments[prayer]) {
        return baseTime;
    }
    
    return moment(baseTime).add(method.adjustments[prayer], 'minutes');
}

// Function to get method info for UI display
function getMethodInfo(method) {
    const methodData = CALCULATION_METHODS[method];
    if (!methodData) return '';

    let info = `${methodData.name}: Fajr ${methodData.fajrAngle}°`;
    if (methodData.ishaAngle) {
        info += `, Isha ${methodData.ishaAngle}°`;
    } else if (methodData.ishaMinutes) {
        info += `, Isha ${methodData.ishaMinutes} min after Maghrib`;
    }
    return info;
}

// Function to get API method number for Aladhan API
function getApiMethodNumber(method) {
    const methodMap = {
        'MuslimWorldLeague': 3,
        'Egyptian': 5,
        'Karachi': 1,
        'UmmAlQura': 4,
        'Dubai': 8,
        'MoonsightingCommittee': 15,
        'NorthAmerica': 2,
        'Kuwait': 9,
        'Qatar': 10,
        'Singapore': 11,
        'Turkey': 13,
        'Tehran': 7,
        'Jafari': 0
    };
    return methodMap[method] || 3; // Default to Muslim World League
}

// Global variables
let currentPrayerTimes;
let currentCalculationMethod = localStorage.getItem('calculationMethod') || 'MuslimWorldLeague';
let currentMadhab = localStorage.getItem('madhab') || 'Shafi';

// Prayer time calculation functions
function calculateFajrTime(date, angle, decl, eqt) {
    // Fajr is calculated using the provided formula with negative angle
    return calculateTimeByAngle(date, -angle, true, decl, eqt);
}

function calculateSunrise(date, decl, eqt) {
    // Sunrise occurs at -0.833° due to atmospheric refraction
    return calculateTimeByAngle(date, -0.833, true, decl, eqt);
}

function calculateAsr(date, decl, eqt) {
    // Get shadow length multiplier based on madhab with improved handling
    const shadowLength = getMadhabShadowLength(currentMadhab);
    console.log(`Calculating Asr with ${currentMadhab} madhab (shadow length: ${shadowLength})`);
    
    // Calculate Asr time
    const angle = Math.atan(1/(shadowLength + Math.tan(Math.abs(window.latitude - decl))));
    const H = angle * (180/Math.PI) / 15;
    
    return calculateTimeByAngle(date, H, false, decl, eqt);
}

function calculateMaghrib(date, decl, eqt) {
    // Maghrib is at sunset (-0.833° due to refraction)
    return calculateTimeByAngle(date, -0.833, false, decl, eqt);
}

function calculateIshaTime(date, angle, decl, eqt) {
    // Isha is calculated using the provided formula with negative angle
    return calculateTimeByAngle(date, -angle, false, decl, eqt);
}

// Helper function for Julian Date calculation
function julianDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let y = year;
    let m = month;
    
    if (m <= 2) {
        y -= 1;
        m += 12;
    }
    
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    
    const jd = Math.floor(365.25 * (y + 4716)) + 
               Math.floor(30.6001 * (m + 1)) + 
               day + b - 1524.5;
    
    return jd;
}

// Add high latitude adjustment methods from PrayTimes.org
const HIGH_LATITUDE_METHODS = {
    None: 'none',            // No adjustment
    AngleBased: 'angle',     // Angle-based method
    OneSeventh: 'seventh',   // 1/7th of night method
    MiddleOfNight: 'middle'  // Middle of night method
};

// Function to handle extreme latitudes
function adjustForHighLatitude(times, method, latitude) {
    const adjustmentMethod = getHighLatitudeAdjustmentMethod(latitude);
    
    if (adjustmentMethod === HIGH_LATITUDE_METHODS.None) {
        return times;
    }

    const night = moment.duration(times.sunrise.diff(times.fajr)).asMinutes();
    
    switch (adjustmentMethod) {
        case HIGH_LATITUDE_METHODS.AngleBased:
            // Adjust based on angles
            if (!isValidTime(times.fajr)) {
                times.fajr = moment(times.sunrise).subtract(method.fajrAngle * 4, 'minutes');
            }
            if (!isValidTime(times.isha)) {
                times.isha = moment(times.maghrib).add(method.ishaAngle * 4, 'minutes');
            }
            break;
            
        case HIGH_LATITUDE_METHODS.OneSeventh:
            // Adjust to 1/7th of night
            if (!isValidTime(times.fajr)) {
                times.fajr = moment(times.sunrise).subtract(night / 7, 'minutes');
            }
            if (!isValidTime(times.isha)) {
                times.isha = moment(times.maghrib).add(night / 7, 'minutes');
            }
            break;
            
        case HIGH_LATITUDE_METHODS.MiddleOfNight:
            // Adjust to middle of night
            if (!isValidTime(times.fajr)) {
                times.fajr = moment(times.sunrise).subtract(night / 2, 'minutes');
            }
            if (!isValidTime(times.isha)) {
                times.isha = moment(times.maghrib).add(night / 2, 'minutes');
            }
            break;
    }
    
    return times;
}

// Helper function to check if a prayer time is valid
function isValidTime(time) {
    return time && time.isValid() && !isNaN(time.valueOf());
}

// Function to determine high latitude adjustment method
function getHighLatitudeAdjustmentMethod(latitude) {
    const absLat = Math.abs(latitude);
    if (absLat < 45) return HIGH_LATITUDE_METHODS.None;
    if (absLat < 48) return HIGH_LATITUDE_METHODS.AngleBased;
    if (absLat < 55) return HIGH_LATITUDE_METHODS.OneSeventh;
    return HIGH_LATITUDE_METHODS.MiddleOfNight;
}

// Improved Madhab handling
function getMadhabShadowLength(madhab) {
    // Validate and normalize madhab input
    const normalizedMadhab = String(madhab || '').trim();
    
    // Handle different possible formats of madhab names
    if (/^hanafi$/i.test(normalizedMadhab)) {
        return 2; // Hanafi uses 2x shadow length
    } else if (/^shafi/i.test(normalizedMadhab) || /^hanbali/i.test(normalizedMadhab) || /^maliki/i.test(normalizedMadhab)) {
        return 1; // Shafi, Hanbali, and Maliki use 1x shadow length
    } else {
        console.warn(`Unknown madhab "${madhab}", defaulting to Shafi (1x shadow length)`);
        return 1; // Default to Shafi if unknown
    }
}

// Update handleMadhabChange to be more reliable
async function handleMadhabChange(madhab) {
    try {
        console.log(`Updating calculations for madhab: ${madhab}`);
        
        // Validate madhab with more flexibility
        const normalizedMadhab = String(madhab || '').trim();
        let validMadhab;
        
        if (/^hanafi$/i.test(normalizedMadhab)) {
            validMadhab = 'Hanafi';
        } else if (/^shafi/i.test(normalizedMadhab)) {
            validMadhab = 'Shafi';
        } else if (/^hanbali/i.test(normalizedMadhab)) {
            validMadhab = 'Shafi'; // Use Shafi calculation for Hanbali
        } else if (/^maliki/i.test(normalizedMadhab)) {
            validMadhab = 'Shafi'; // Use Shafi calculation for Maliki
        } else {
            console.warn(`Invalid madhab "${madhab}", defaulting to Shafi`);
            validMadhab = 'Shafi'; // Default to Shafi
        }

        // Update madhab
        currentMadhab = validMadhab;
        localStorage.setItem('madhab', validMadhab);
        
        // Update UI to reflect the change
        const madhabInput = document.querySelector(`input[name="madhab"][value="${validMadhab}"]`);
        if (madhabInput) {
            madhabInput.checked = true;
        }

        // Clear current times
        currentPrayerTimes = null;

        // Force recalculation
        const times = await calculatePrayerTimes();
        
        if (!times) {
            throw new Error('Failed to calculate new prayer times');
        }

        console.log(`Prayer times updated successfully for ${validMadhab} madhab`);
        return times;

    } catch (error) {
        console.error('Error updating madhab:', error);
        // Try API fallback
        return await fallbackToAPI();
    }
}
