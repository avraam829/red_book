from flask import Blueprint, jsonify, request
from models import db, Species

species_bp = Blueprint('species', __name__)

@species_bp.route('/species', methods=['GET'])
def get_species():
    species = Species.query.all()
    return jsonify([s.to_dict() for s in species])

@species_bp.route('/species', methods=['POST'])
def add_species():
    data = request.json
    new_species = Species(
        name=data['name'],
        population=data['population'],
        habitat=data['habitat'],
        risk_level=data['risk_level'],
        latitude=data['latitude'],
        longitude=data['longitude']
    )
    db.session.add(new_species)
    db.session.commit()
    return jsonify(new_species.to_dict()), 201
