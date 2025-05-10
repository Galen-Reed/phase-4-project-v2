#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Device, Ticket

# Views go here!

class Signup(Resource):
    def post(self):
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return {"error": "Username and password are required"}, 422
        
        if User.query.filter_by(username=username).first():
            return {"error": "Username already exists"}, 422
        
        new_user = User(username=username)
        new_user.password_hash = password

        db.session.add(new_user)
        db.session.commit()

        session["user_id"] = new_user.id

        return make_response(new_user.to_dict(), 200)
    
class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()

        if user:
            return make_response(user.to_dict(), 200)
        else:
            return {"error": "User not signed in"}, 401
            
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session["user_id"] = user.id
            return make_response(user.to_dict(), 200)
        else:
            return {"error": "Invalid username or password"}, 401
            
class Logout(Resource):
    def delete(self):
        user = User.query.filter(User.id == session.get('user_id')).first()

        if user:
            session['user_id'] = None
            return {'message': '204: No Content'}, 204
        else:
            return {'message': '401: Not authorized'}, 401
            
class DeviceList(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()

        if not user:
            return {"error": "401: Unauthorized"}, 401
            
        devices = [device.to_dict() for device in Device.query.all()]

        return make_response(devices, 200)

    def post(self):
        user = User.query.filter(User.id == session.get('user_id')).first()

        if not user:
            return {"error": "401: Unauthorized"}, 401

        data = request.get_json()

        try:
            new_device = Device(
                name=data.get('name'),
                device_type=get('device'),
                serial_number=get('serial_number')
            )

            db.session.add(new_device)
            db.session.commit()
            db.session.refresh(new_device)

            return make_response(new_device.to_dict(), 201)

        except ValueError as e:
            db.session.rollback()
            print("Validation error:", str(e))
            return {"error": str(e)}, 422
            
        except Exception as e:
            db.session.rollback()
            print("Unexpected error:", str(e))
            return {'error': 'Internal Server Error: ' + str(e)}, 500

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(DeviceList, '/recipes', endpoint='recipes')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

