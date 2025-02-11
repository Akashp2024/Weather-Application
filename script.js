

// const API_KEY = '356070aeaf32c704617acfc42f225215';
                 

function fetchWeather() {
    const city = document.getElementById("city").value;

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    // Call the Flask backend instead of OpenWeather API directly
    const weatherUrl = `https://your-backend-url.onrender.com/weather?city=${city}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("City not found or API error");
                return;
            }
            updateTodayWeather(data);
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function updateTodayWeather(data) {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("city-date").innerText = `${data.name} (${today})`;
    document.getElementById("temperature").innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById("wind").innerText = `Wind: ${data.wind.speed} M/S`;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("condition").innerText = `Condition: ${data.weather[0].description}`;
}

function fetchForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=32&appid=${API_KEY}&units=metric`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => updateForecast(data.list))
        .catch(error => console.error("Forecast fetch error", error));
}

function updateForecast(forecastList) {
    const forecastDays = [7, 15, 23, 31]; 
    for (let i = 0; i < 4; i++) {
        const dayData = forecastList[forecastDays[i]];
        const card = document.getElementById(`forecast-day-${i + 1}`);
        card.innerHTML = `
            <h4>${dayData.dt_txt.split(" ")[0]}</h4>
            <p>Temp: ${dayData.main.temp}°C</p>
            <p>Wind: ${dayData.wind.speed} M/S</p>
            <p>Humidity: ${dayData.main.humidity}%</p>
        `;
    }
}

function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function fetchWeatherByCoords(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            updateTodayWeather(data);
            fetchForecast(lat, lon);
        })
        .catch(error => alert("Location fetch error"));
}
