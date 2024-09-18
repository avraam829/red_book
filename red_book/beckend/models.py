from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Species(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    population = db.Column(db.Integer, nullable=False)
    habitat = db.Column(db.String(120), nullable=False)
    risk_level = db.Column(db.String(50), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'population': self.population,
            'habitat': self.habitat,
            'risk_level': self.risk_level,
            'latitude': self.latitude,
            'longitude': self.longitude
        }
