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
                type=data.get('type'),
                serial_number=data.get('serial_number')
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
        
class AddTicket(Resource):
    def post(self):
        user_id = session.get("user_id")
        user = db.session.get(User, user_id)

        if not user:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()

        try:
            new_ticket = Ticket(
                title=data.get("title"),
                description=data.get("description"),
                status=data.get("status", "open"),
                user_id=user.id,
                device_id=data.get("device_id")
            )

            db.session.add(new_ticket)
            db.session.commit()

            return make_response(new_ticket.to_dict(), 201)

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422
        
class TicketById(Resource):
    def patch(self, id):
        user_id = session.get("user_id")
        ticket = db.session.get(Ticket, id)

        if not ticket:
            return {"error": "Ticket not found"}, 404

        if ticket.user_id != user_id:
            return {"error": "Forbidden"}, 403

        data = request.get_json()
        for field in ["title", "description", "status"]:
            if field in data:
                setattr(ticket, field, data[field])

        db.session.commit()
        return make_response(ticket.to_dict(), 200)
    
    def delete(self, id):
        user_id = session.get("user_id")
        ticket = db.session.get(Ticket, id)

        if not ticket:
            return {"error": "Ticket not found"}, 404

        if ticket.user_id != user_id:
            return {"error": "Forbidden"}, 403

        db.session.delete(ticket)
        db.session.commit()
        return {"message": "Ticket deleted"}, 204

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(DeviceList, '/devices', endpoint='devices')
api.add_resource(AddTicket, '/tickets', endpoint='tickets')
api.add_resource(TicketById, '/tickets/<int:id>', endpoint='ticket_by_id')



if __name__ == '__main__':
    app.run(port=5555, debug=True)

