function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendCoordinates, showError);
    } else {
        document.getElementById("weather-result").innerText = "위치 정보 미지원";
    }
}

function sendCoordinates(position) {
    fetch('/get_weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            lat: position.coords.latitude,
            lon: position.coords.longitude
        })
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
    });
}

function showError(error) {
    document.getElementById("weather-result").innerText = "위치 정보를 가져오지 못했습니다.";
}
