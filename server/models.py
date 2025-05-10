from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db, bcrypt

# Models go here!
user_tickets = db.Table('user_tickets',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('ticket_id', db.Integer, db.ForeignKey('tickets.id')),
    db.Column('priority', db.Integer, nullable=False)  # User submittable attribute
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    # One-to-many: User has many Devices
    devices = db.relationship('Device', backref='owner', lazy=True, cascade="all, delete-orphan")
    
    # Many-to-many: User has many Tickets (direct relationship with priority)
    assigned_tickets = db.relationship('Ticket', secondary=user_tickets, backref=db.backref('assigned_users', lazy='dynamic'))

    @property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed')
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'


class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    serial_number = db.Column(db.String(50), unique=True, nullable=False)

    # One-to-many: Device belongs to a User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # One-to-many: Device has many Tickets
    tickets = db.relationship('Ticket', backref='device', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Device {self.name} - {self.serial_number}>'


class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='open')
    severity = db.Column(db.Integer, nullable=False, default=3)  # 1-5 scale
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())

    # One-to-many: Ticket belongs to a Device
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=False)

    @validates('severity')
    def validate_severity(self, key, severity):
        if not isinstance(severity, int):
            raise ValueError("Severity must be an integer")
        if severity < 1 or severity > 5:
            raise ValueError("Severity must be between 1 and 5")
        return severity

    def __repr__(self):
        return f'<Ticket {self.title} - {self.status}>'