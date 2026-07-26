// API Configuration
const API_KEY = "bf5c01dfb8628e766da04a72dca87ab4";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM Elements
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');

// Get weather data
async function getWeather() {
    const city = cityInput.value.trim();
    
    // Validation
    if (city === '') {
        showError('️ من فضلك اكتب اسم مدينة!');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        
        if (!response.ok) {
            if (response.status === 404) {
                showError('❌ المدينة غير موجودة! تأكد من الاسم وحاول تاني.');
            } else if (response.status === 401) {
                showError('❌ خطأ في مفتاح API!');
            } else {
                showError('❌ حدث خطأ! حاول مرة أخرى.');
            }
            return;
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError('❌ حدث خطأ في الاتصال! تأكد من اتصالك بالإنترنت.');
    }
}

// Display weather data
function displayWeather(data) {
    const cityName = data.name;
    const country = data.sys.country;
    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    
    const weatherHTML = `
        <div class="weather-card">
            <h2 class="city-name">${cityName}, ${country}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
            <div class="weather-details">
                <div class="detail-item">
                    <i class="fas fa-temperature-high"></i>
                    <div class="detail-label">الإحساس الفعلي</div>
                    <div class="detail-value">${feelsLike}°C</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <div class="detail-label">الرطوبة</div>
                    <div class="detail-value">${humidity}%</div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <div class="detail-label">سرعة الرياح</div>
                    <div class="detail-value">${windSpeed} م/ث</div>
                </div>
            </div>
        </div>
    `;
    
    weatherResult.innerHTML = weatherHTML;
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
}

// Show loading state
function showLoading() {
    weatherResult.innerHTML = '';
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
}

// Show error state
function showError(message) {
    weatherResult.innerHTML = '';
    loadingState.style.display = 'none';
    errorMessage.textContent = message;
    errorState.style.display = 'block';
}

// Allow search with Enter key
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Clear error when user starts typing
cityInput.addEventListener('input', function() {
    errorState.style.display = 'none';
});

console.log('%c🌤️ Weather App loaded successfully!', 'color: #0984e3; font-weight: bold;');
