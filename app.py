from flask import Flask, request, jsonify, render_template
import requests
from collections import deque

app = Flask(__name__)
API_KEY = 'f8af007bb8d199bd6612f11a4fc70e6b'  # OpenWeatherMap API 키

# 최대 60개 데이터 저장 (1시간치, 1분 단위라 가정)
sensor_data_history = deque(maxlen=60)

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

# 센서 데이터 수신 API (POST)
@app.route('/api/sensor-data', methods=['POST'])
def receive_sensor_data():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data received'}), 400

    if all(k in data for k in ['sensor1', 'sensor2', 'sensor3', 'timestamp']):
        sensor_data_history.append(data)
        print(f"새 센서 데이터 저장: {data}")
        return jsonify({'success': True}), 200
    else:
        return jsonify({'error': 'Invalid data format'}), 400

# 센서 데이터 히스토리 요청 API (GET)
@app.route('/api/sensor-history', methods=['GET'])
def get_sensor_history():
    # 리스트로 변환 후 반환
    return jsonify(list(sensor_data_history))

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
