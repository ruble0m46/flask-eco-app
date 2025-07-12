# 이 코드는 app.py 안에 붙여넣기
from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)
API_KEY = 'f8af007bb8d199bd6612f11a4fc70e6b' 

@app.route('')
def home():
    return render_template('index.html')

@app.route('get_weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    lat = data['lat']
    lon = data['lon']
    url = f'httpsapi.openweathermap.orgdata2.5weatherlat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=kr'
    res = requests.get(url)
    return jsonify(res.json())

if __name__ == '__main__'
    app.run(debug=True)
