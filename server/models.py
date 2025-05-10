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
    devices = db.relationship('Device', backref='owner', lazy=True, cascade="all, delete-orphan")
    tickets = db.relationship('Ticket', backref='user', cascade='all, delete-orphan')


    @property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed')
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "devices": [device.to_dict() for device in self.devices],
            "tickets": [ticket.to_dict() for ticket in self.tickets]
        }

    def __repr__(self):
        return f'<User {self.username}>'


class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    serial_number = db.Column(db.String(50), unique=True, nullable=False)


    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tickets = db.relationship('Ticket', backref='device', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "device_type": self.device_type,
            "serial_number": self.serial_number,
            "user_id": self.user_id,
            "tickets": [ticket.to_dict() for ticket in self.tickets]
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