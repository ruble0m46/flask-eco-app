// 기존 날씨 관련 함수들
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
       const sunsetUnix = data.sys?.sunset;  
    let sunsetStr = '정보 없음';
    }

    if (sunsetUnix) {
        const sunsetDate = new Date(sunsetUnix * 1000);
        sunsetStr = sunsetDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }

        document.getElementById("weather-result").innerHTML = `
            <p>☁️ 상태: ${weather}</p>
            <p>🌡️ 온도: ${temp}°C (체감 ${feels}°C)</p>
            <p>💧 습도: ${humidity}%</p>
            <p>🌬️ 바람: ${wind} m/s</p>
            <p>🌇 일몰: ${sunsetStr}</p>
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

// 센서 데이터 관련 함수들
let sensorChart = null;

function initChart() {
    const ctx = document.getElementById('sensorChart').getContext('2d');
    sensorChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['센서 1', '센서 2', '센서 3'],
            datasets: [{
                label: '조도 센서 값',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1023,
                    title: {
                        display: true,
                        text: '조도 값'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '실시간 조도 센서 데이터'
                }
            }
        }
    });
}

function fetchSensorData() {
    // Render 배포 URL 동적 감지
    const baseUrl = window.location.origin;
    
    fetch(`${baseUrl}/api/sensor-data`)
        .then(response => response.json())
        .then(data => {
            updateChart(data);
            updateSensorInfo(data);
        })
        .catch(error => {
            console.error('센서 데이터를 불러오는데 실패했습니다:', error);
            document.getElementById("sensor-info").innerHTML = 
                '<p style="color: red;">❌ 센서 데이터를 불러올 수 없습니다.</p>';
        });
}

function updateChart(data) {
    if (sensorChart) {
        sensorChart.data.datasets[0].data = [
            data.sensor1,
            data.sensor2,
            data.sensor3
        ];
        sensorChart.update();
    }
}

function updateSensorInfo(data) {
    const timestamp = new Date(data.timestamp).toLocaleString('ko-KR');
    const maxSensor = Math.max(data.sensor1, data.sensor2, data.sensor3);
    let brightestSensor = '';
    
    if (data.sensor1 === maxSensor) brightestSensor = '센서 1';
    else if (data.sensor2 === maxSensor) brightestSensor = '센서 2';
    else brightestSensor = '센서 3';
    
    document.getElementById("sensor-info").innerHTML = `
        <p><strong>📊 센서 데이터 (5분 평균)</strong></p>
        <div class="sensor-value">센서 1: ${data.sensor1}</div>
        <div class="sensor-value">센서 2: ${data.sensor2}</div>
        <div class="sensor-value">센서 3: ${data.sensor3}</div>
        <p><strong>🌞 가장 밝은 센서:</strong> ${brightestSensor} (${maxSensor})</p>
        <p><strong>🕐 마지막 업데이트:</strong> ${timestamp}</p>
    `;
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    fetchSensorData();
    
    // 30초마다 자동으로 센서 데이터 갱신
    setInterval(fetchSensorData, 30000);
});
