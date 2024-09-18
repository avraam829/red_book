from flask import Flask
from flask_cors import CORS
from routes import species_bp
from models import db

app = Flask(__name__)
app.config.from_object('config.Config')
CORS(app)

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(species_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
