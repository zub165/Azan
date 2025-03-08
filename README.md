# Azan - Prayer Times & Islamic Calendar

A modern, responsive web application for Islamic prayer times, Azan notifications, and moon phase tracking.

## Features

- 🕌 Prayer times calculation with multiple methods (12 different calculation methods)
- 🎵 Multiple Azan recitations from renowned Muazzins
- 🌙 Moon phase calendar with visual tracking
- 📅 Islamic (Hijri) calendar
- 📍 Automatic location detection
- ⏰ Prayer time notifications
- 🕰️ Countdown to next prayer
- 📱 Responsive design for all devices
- 🌙 Optional prayer times (Tahajjud, Ishraq, Suhoor)
- 🎧 Test Azan audio feature
- 💾 Local storage for user preferences

## Muazzins Available

- Abdul Basit
- Al-Minshawi
- Al-Ghamdi
- Al-Hussary
- Mishary Rashid
- Ali Ahmad Mulla
- Muhammad Al-Muaiqly
- Masjid Al-Haram Live
- Masjid An-Nabawi Live
- Yusuf Islam
- Sheikh Essam Bukhari
- Ibrahim Al-Arkani

## Setup

1. Clone the repository:
```bash
git clone https://github.com/zub165/Azan.git
cd Azan
```

2. Open `index.html` in a web browser or serve using a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve
```

3. Access the application at `http://localhost:8000`

## Usage

1. Allow location access when prompted
2. Select your preferred calculation method
3. Choose your Madhab (Shafi'i or Hanafi)
4. Select your preferred Muazzin
5. Enable notifications for prayer time alerts

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [Adhan.js](https://github.com/batoulapps/adhan-js) for prayer time calculations
- [Moment.js](https://momentjs.com/) for time handling
- Material Design Icons
- OpenStreetMap for reverse geocoding

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 