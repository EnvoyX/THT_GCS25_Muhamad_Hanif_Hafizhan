from app import app, db
from flask import request, jsonify
from models import Friend


#CRUD Operation
# Get all friends (ENDPOINT)
@app.route("/api/friends", methods=["GET"])
def get_friends():
    # Query dari database
    friends = Friend.query.all() # Dalam format object python
    result = [friend.to_json() for friend in friends]  # With loop through list in python, convert it to json
    # result = [{...}, {...}, {...}]
    return jsonify(result) 

# Create a friend (ENDPOINT)
@app.route("/api/friends", methods=["POST"])
def create_friend():
    try:
        data = request.json

        #Validation
        required_fields = ["name", "role", "description", "gender"]
        for field in required_fields:
            # Cek jika ada field yang tidak ada di data atau jika semua data nya kosong
            if field not in data or not data.get(field):
                return jsonify({"error": f'Missing required field: {field}'}), 400 

        name = data.get("name")
        role = data.get("role")
        description = data.get("description")
        gender = data.get("gender")

        # fetch avatar image based on gender
        if gender == "male":
            img_url = f'https://avatar.iran.liara.run/public/boy?username={name}'
        elif gender == "female":
            img_url = f'https://avatar.iran.liara.run/public/girl?username={name}'
        else:
            img_url = None

        new_friend = Friend(name=name, role=role, description=description, gender=gender, img_url=img_url)

        db.session.add(new_friend)
        db.session.commit()

        return jsonify(new_friend.to_json()) , 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete Friend (ENDPOINT)
@app.route("/api/friends/<int:id>", methods=["DELETE"])
def delete_friend(id):
    try:
        friend = Friend.query.get(id)
        if friend is None:
            return jsonify({"error": "Friend not found"}), 404
        
        db.session.delete(friend)
        db.session.commit()
        return jsonify({"msg": "Friend deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error" : str(e)}), 500
    
# Update Friend (ENDPOINT)
@app.route("/api/friends/<int:id>", methods=["PATCH"])
def update_friend(id):
    try:
        friend = Friend.query.get(id)
        if friend is None:
            return jsonify({"error": "Friend not found"}), 404

        data = request.json

        friend.name = data.get("name", friend.name) # Jika data tidak dirubah, maka default value nya adalah data sebelumnya
        friend.role = data.get("role", friend.role)
        friend.description = data.get("description", friend.description)
        friend.gender = data.get("gender", friend.gender)

        # Check perubahan gender dan nama user, untuk mengubah username di link img_url
        if friend.gender == "male":
            friend.img_url = f'https://avatar.iran.liara.run/public/boy?username={friend.name}'
        elif friend.gender == "female":
            friend.img_url = f'https://avatar.iran.liara.run/public/girl?username={friend.name}'
        else:
            friend.img_url =  data.get("imgUrl", friend.img_url)

        db.session.commit()
        return jsonify(friend.to_json()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error" : str(e)}) , 500