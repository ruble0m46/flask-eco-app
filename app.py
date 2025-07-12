from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)
API_KEY = 'f8af007bb8d199bd6612f11a4fc70e6b'  # 너의 OpenWeatherMap API 키

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

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
