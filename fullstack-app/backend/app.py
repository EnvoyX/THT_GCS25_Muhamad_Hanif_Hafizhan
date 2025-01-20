from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Setup Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///friends.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create Database
db = SQLAlchemy(app)


frontend_folder = os.path.join(os.getcwd(),"..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

# Server static file dari "dist" folder
@app.route("/", defaults={"filename":""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html" #App React
    return send_from_directory(dist_folder,filename)

# API routes
import routes

# Create tables
with app.app_context():
    db.create_all()

# Jika file dirun secara directly (tidak di import):
if __name__ == "__main__":
    app.run(debug=True)