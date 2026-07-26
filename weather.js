// مفتاح API بتاعك
const API_KEY = "372a715e485a063040193286f99237ac";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// دالة جلب بيانات الطقس
async function getWeather() {
    var cityInput = document.getElementById("cityInput");
    var weatherResult = document.getElementById("weatherResult");
    var city = cityInput.value.trim();
    
    // التحقق من إن الحقل مش فاضي
    if (city === "") {
        weatherResult.innerHTML = '<p class="error">⚠️ من فضلك اكتب اسم مدينة!</p>';
        return;
    }
    
    // عرض حالة التحميل
    weatherResult.innerHTML = '<p class="loading">⏳ جاري البحث...</p>';
    
    try {
        // طلب البيانات من API
        var response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ar`);
        
        // لو المدينة مش موجودة
        if (!response.ok) {
            weatherResult.innerHTML = '<p class="error">❌ المدينة غير موجودة! تأكد من الاسم وحاول تاني.</p>';
            return;
        }
        
        // تحويل البيانات لـ JSON
        var data = await response.json();
        
        // استخراج المعلومات
        var cityName = data.name;
        var country = data.sys.country;
        var temperature = Math.round(data.main.temp);
        var feelsLike = Math.round(data.main.feels_like);
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;
        var description = data.weather[0].description;
        var icon = data.weather[0].icon;
        
        // عرض البيانات
        weatherResult.innerHTML = `
            <div class="weather-card">
                <h2 class="city-name">${cityName}, ${country}</h2>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="حالة الطقس" width="100">
                <div class="temperature">${temperature}°C</div>
                <p class="description">${description}</p>
                <div class="details">
                    <div class="detail-item">
                        <div class="detail-label">الإحساس الفعلي</div>
                        <div class="detail-value">${feelsLike}°C</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">الرطوبة</div>
                        <div class="detail-value">${humidity}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">سرعة الرياح</div>
                        <div class="detail-value">${windSpeed} م/ث</div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        weatherResult.innerHTML = '<p class="error">❌ حدث خطأ! تأكد من اتصالك بالإنترنت.</p>';
        console.error(error);
    }
}

// السماح بالبحث بزر Enter
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
