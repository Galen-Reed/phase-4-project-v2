from datetime import datetime
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db, bcrypt

# Models go here!
class User(db.Model):
    __tablename__ = 'users'



    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    _password_hash = db.Column(db.String(255), nullable=False)

    #Relationships
    tickets = db.relationship('Ticket', backref='user', cascade='all, delete-orphan')
    devices = db.relationship('Device', secondary="tickets", primaryjoin="User.id == Ticket.user_id", secondaryjoin="Device.id == Ticket.device_id", viewonly=True, backref="users")

    @property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed')
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    @validates("username")
    def validates_username(self, key, username):
        if not username or len(username.strip()) < 3:
            raise ValueError("Username must be at least 3 characters.")
        return username.strip()

    
    def to_dict(self):

        return {
            "id": self.id,
            "username": self.username,
            "devices": [
                {
                    "id": device.id,
                    "name": device.name,
                    "type": device.type,
                    "serial_number": device.serial_number,
                    "tickets": [
                        {
                            "id": ticket.id,
                            "title": ticket.title,
                            "description": ticket.description,
                            "status": ticket.status,
                            "created_at": ticket.created_at.isoformat() if ticket.created_at else None
                        } 
                        for ticket in device.tickets if ticket.user_id == self.id
                    ]
                } 
                for device in self.devices
            ]
        }

    def __repr__(self):
        return f'<User {self.username}>'


class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    serial_number = db.Column(db.String(50), unique=True, nullable=False)

    tickets = db.relationship('Ticket', backref='device', cascade="all, delete-orphan")

    users = db.relationship(
        'User',
        secondary="tickets",
        primaryjoin="Device.id == Ticket.device_id",
        secondaryjoin="User.id == Ticket.user_id",
        viewonly=True
    )

    @validates('name')
    def validate_name(self, key, name):
        if not name.strip():
            raise ValueError("Device name cannot be empty.")
        return name.strip()
    
    @validates("type")
    def validates_type(self, key, dtype):
        if not dtype.strip():
            raise ValueError("Device type cannoty be empty")
        return dtype.strip()
    
    @validates("serial_number")
    def validate_serial(self, key, sn):
        if not sn.strip():
            raise ValueError("Serial number cannot be empty")
        return sn.strip()

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "serial_number": self.serial_number,
            "users": [
                {
                    "id": user.id,
                    "username": user.username,
                    "tickets": [
                        {
                            "id": ticket.id,
                            "title": ticket.title,
                            "description": ticket.description,
                            "status": ticket.status,
                            "created_at": ticket.created_at.isoformat() if ticket.created_at else None
                        }
                        for ticket in self.tickets if ticket.user_id == user.id
                    ]
                }
                for user in self.users
            ]
        }

    def __repr__(self):
        return f'<Device {self.name} - {self.serial_number}>'


class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='open')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=False)

    @validates("title")
    def validate_title(self, key, title):
        if not title.strip():
            raise ValueError("Title cannot be empty")
        return title.strip()
    
    @validates("description")
    def validate_description(self, key, desc):
        if not desc.strip() or len(desc) < 10:
            raise ValueError("Description must be at least 10 characters.")
        return desc.strip()
    
    @validates("status")
    def validate_status(self, key, status):
        allowed = {'open', 'closed', 'in progress'}
        if status.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}.")
        return status.lower()

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "user_id": self.user_id,
            "device_id": self.device_id
        }


    def __repr__(self):
        return f'<Ticket {self.title} - {self.status}>'