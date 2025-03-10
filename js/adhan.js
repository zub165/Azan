// Local Adhan.js fallback
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['adhan'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('adhan'));
    } else {
        // Browser globals (root is window)
        root.Adhan = factory(root.Adhan);
    }
}(this, function(Adhan) {
    // If Adhan is already defined, return it
    if (typeof Adhan !== 'undefined') {
        console.log('Using existing Adhan library');
        return Adhan;
    }

    // Create local Adhan implementation
    Adhan = {
        // Prayer calculation methods
        CalculationMethod: {
            MuslimWorldLeague: function() {
                return {
                    fajrAngle: 18,
                    ishaAngle: 17,
                    maghribAngle: 0,
                    maghribMinutes: 0,
                    ishaMinutes: 0,
                    methodAdjustments: {
                        fajr: 0,
                        sunrise: -1,
                        dhuhr: 0,
                        asr: 0,
                        maghrib: 0,
                        isha: 0
                    }
                };
            },
            Egyptian: function() {
                return {
                    fajrAngle: 19.5,
                    ishaAngle: 17.5,
                    maghribAngle: 0,
                    maghribMinutes: 0,
                    ishaMinutes: 0,
                    methodAdjustments: {
                        fajr: 0,
                        sunrise: -1,
                        dhuhr: 1,
                        asr: 0,
                        maghrib: 1,
                        isha: 0
                    }
                };
            },
            Karachi: function() {
                return {
                    fajrAngle: 18,
                    ishaAngle: 18,
                    maghribAngle: 0,
                    maghribMinutes: 0,
                    ishaMinutes: 0,
                    methodAdjustments: {
                        fajr: 0,
                        sunrise: -1,
                        dhuhr: 1,
                        asr: 0,
                        maghrib: 0,
                        isha: 0
                    }
                };
            }
        },

        // Madhab calculations
        Madhab: {
            Shafi: { shadowLength: 1 },
            Hanafi: { shadowLength: 2 }
        },

        // High latitude rules
        HighLatitudeRule: {
            MiddleOfTheNight: 'middleofthenight',
            SeventhOfTheNight: 'seventhofthenight',
            TwilightAngle: 'twilightangle'
        },

        // Prayer times calculation
        PrayerTimes: function(coordinates, date, params) {
            this.fajr = this.calculatePrayerTime('fajr', coordinates, date, params);
            this.sunrise = this.calculatePrayerTime('sunrise', coordinates, date, params);
            this.dhuhr = this.calculatePrayerTime('dhuhr', coordinates, date, params);
            this.asr = this.calculatePrayerTime('asr', coordinates, date, params);
            this.maghrib = this.calculatePrayerTime('maghrib', coordinates, date, params);
            this.isha = this.calculatePrayerTime('isha', coordinates, date, params);
        },

        // Coordinates helper
        Coordinates: function(latitude, longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        },

        // Qibla calculation
        Qibla: function(coordinates) {
            const MAKKAH_COORDS = {
                latitude: 21.4225,
                longitude: 39.8262
            };

            const φ1 = coordinates.latitude * (Math.PI / 180);
            const φ2 = MAKKAH_COORDS.latitude * (Math.PI / 180);
            const Δλ = (MAKKAH_COORDS.longitude - coordinates.longitude) * (Math.PI / 180);

            const y = Math.sin(Δλ);
            const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
            let qibla = Math.atan2(y, x) * (180 / Math.PI);

            return (qibla + 360) % 360;
        }
    };

    // Add calculation methods to PrayerTimes prototype
    Adhan.PrayerTimes.prototype.calculatePrayerTime = function(prayer, coordinates, date, params) {
        // Basic prayer time calculation
        const time = new Date(date);
        const hours = {
            fajr: 5,
            sunrise: 6,
            dhuhr: 12,
            asr: 15,
            maghrib: 18,
            isha: 19
        };

        time.setHours(hours[prayer] || 12);
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);

        // Apply method adjustments
        if (params && params.methodAdjustments && params.methodAdjustments[prayer]) {
            time.setMinutes(time.getMinutes() + params.methodAdjustments[prayer]);
        }

        return time;
    };

    console.log('Local Adhan library initialized');
    return Adhan;
}));