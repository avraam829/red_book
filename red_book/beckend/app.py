from flask import Flask, jsonify, render_template
import folium

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map')
def map():
    # Создаем карту с начальной позицией и зумом
    m = folium.Map(location=[51.1657, 10.4515], zoom_start=6)
    # Сохраняем карту в HTML файл
    m.save('templates/map.html')
    return jsonify({"message": "Map generated successfully"})

if __name__ == '__main__':
    app.run(debug=True)
