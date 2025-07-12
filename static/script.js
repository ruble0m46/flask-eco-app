function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendCoordinates, showError);
    } else {
        showError({ message: "이 브라우저는 위치 서비스를 지원하지 않습니다." });
    }
}

function sendCoordinates(position) {
    fetchWeather(position.coords.latitude, position.coords.longitude);
}

function fetchWeather(lat, lon) {
    fetch('/get_weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: lat, lon: lon })
    })
    .then(res => res.json())
    .then(data => {
        const weather = data.weather[0].description;
        const temp = data.main.temp;
        const feels = data.main.feels_like;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;

        document.getElementById("weather-result").innerHTML = `
            <p>☁️ 상태: ${weather}</p>
            <p>🌡️ 온도: ${temp}°C (체감 ${feels}°C)</p>
            <p>💧 습도: ${humidity}%</p>
            <p>🌬️ 바람: ${wind} m/s</p>
        `;
    })
    .catch(() => {
        document.getElementById("weather-result").innerText = "날씨 정보를 불러오지 못했습니다.";
    });
}

function saveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            localStorage.setItem("savedLat", lat);
            localStorage.setItem("savedLon", lon);
            alert("📍 위치가 저장되었습니다.");
        }, showError);
    } else {
        showError({ message: "이 브라우저는 위치 서비스를 지원하지 않습니다." });
    }
}

function loadSavedLocation() {
    const lat = localStorage.getItem("savedLat");
    const lon = localStorage.getItem("savedLon");

    if (lat && lon) {
        fetchWeather(lat, lon);
    } else {
        alert("⚠️ 저장된 위치가 없습니다. 먼저 '내 위치 저장하기' 버튼을 눌러 저장해 주세요.");
    }
}

function showError(error) {
    document.getElementById("weather-result").innerText =
        `🚫 위치 정보를 가져올 수 없습니다.\n${error.message}`;
}
