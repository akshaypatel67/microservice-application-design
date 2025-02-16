from sqlalchemy import Column, Integer, Float, String, Enum, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

Base = declarative_base()

# =========================== Ticket History =========================== #
class TicketStatus(enum.Enum):
    BOOKED = '1'
    CANCELLED = '2'

class TicketHistory(Base):
    __tablename__ = 'ticket_history'

    id = Column(Integer, primary_key=True)
    event_id = Column(String, ForeignKey('event.id'), nullable=False)
    user_id = Column(String, ForeignKey('user_profile.email'), nullable=False)
    ticket_id = Column(String, nullable=False)
    ticket_status = Column(Enum(TicketStatus), nullable=False)
    created_on = Column(DateTime, default=datetime.utcnow)

    # Relationship with Event
    event = relationship('Event', back_populates='ticket_histories')
    user_profile = relationship('User', back_populates='ticket_histories')

# =========================== Event History =========================== #
class EventHistory(Base):
    __tablename__ = 'event_visit_history'

    id = Column(Integer, primary_key=True)
    event_id = Column(String, ForeignKey('event.id'), nullable=False)
    user_id = Column(String, nullable=False)
    visit_time = Column(DateTime, default=datetime.utcnow)

    # Relationship with Event
    event = relationship('Event', back_populates='event_histories')

# =========================== Event Data =========================== #
class Event(Base):
    __tablename__ = 'event'

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    location = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    user_id = Column(String, nullable=False)
    created_on = Column(DateTime, default=datetime.utcnow)
    updated_on = Column(DateTime, default=datetime.utcnow)

    # Relationship with Other Tables
    ticket_histories = relationship('TicketHistory', back_populates='event')
    event_histories = relationship('EventHistory', back_populates='event')
    feedbacks = relationship('Feedback', back_populates='event')

# =========================== User Data =========================== #
class User(Base):
    __tablename__ = 'user_profile'

    id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    name = Column(String, nullable=False)
    gender = Column(String, nullable=True)
    age = Column(Integer, nullable=True)

    # Relationship with Event
    ticket_histories = relationship('TicketHistory', back_populates='user_profile')
    feedbacks = relationship('Feedback', back_populates='user_profile')


# =========================== Feedback =========================== #
class Feedback(Base):
    __tablename__ = 'feedback'

    id = Column(String, primary_key=True)
    event_id = Column(String, ForeignKey('event.id'), nullable=False)
    user_id = Column(String, ForeignKey('user_profile.email'), nullable=False)
    ratings = Column(Integer, nullable=True)
    description = Column(String, nullable=True)

    # Relationship with Event
    event = relationship('Event', back_populates='feedbacks')
    user_profile = relationship('User', back_populates='feedbacks')

# create all models
def create_models(engine):
    Base.metadata.create_all(engine)
