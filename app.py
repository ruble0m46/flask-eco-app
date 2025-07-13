from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)
API_KEY = 'f8af007bb8d199bd6612f11a4fc70e6b'  # 너의 OpenWeatherMap API 키

# 센서 데이터 저장 변수
sensor_data = {
    'sensor1': 0,
    'sensor2': 0,
    'sensor3': 0,
    'timestamp': 0
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    lat = data['lat']
    lon = data['lon']
    url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=kr'
    res = requests.get(url)
    return jsonify(res.json())

# 센서 데이터 수신 API
@app.route('/api/sensor-data', methods=['POST'])
def receive_sensor_data():
    global sensor_data
    data = request.get_json()
    
    sensor_data = {
        'sensor1': data.get('sensor1', 0),
        'sensor2': data.get('sensor2', 0),
        'sensor3': data.get('sensor3', 0),
        'timestamp': data.get('timestamp', 0)
    }
    
    print(f"받은 센서 데이터: {sensor_data}")
    return jsonify({'success': True})

# 웹사이트에서 센서 데이터 요청 API
@app.route('/api/sensor-data', methods=['GET'])
def get_sensor_data():
    return jsonify(sensor_data)

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
