# TODO UPDATE THIS FILE FOR DEPLOYMENT
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Setup Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///friends.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create Database
db = SQLAlchemy(app)

# Mount routes
import routes

# Create tables
with app.app_context():
    db.create_all()

# Jika file dirun secara directly (tidak di import):
if __name__ == "__main__":
    app.run(debug=True)