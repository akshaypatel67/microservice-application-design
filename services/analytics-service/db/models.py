from sqlalchemy import Column, Integer, Float, String, Enum, DateTime
from sqlalchemy.ext.declarative import declarative_base
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
   event_id = Column(String, nullable=False)
   user_id = Column(String, nullable=False)
   ticket_id = Column(String, nullable=False)
   ticket_status = Column(Enum(TicketStatus), nullable=False)
   created_on = Column(DateTime, default=datetime.utcnow)

# =========================== Event History =========================== #
class EventHistory(Base):
    __tablename__ = 'event_visit_history'

    id = Column(Integer, primary_key=True)
    event_id = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    visit_time = Column(DateTime, default=datetime.utcnow)

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

# =========================== User Data =========================== #
class User(Base):
    __tablename__ = 'user_profile'

    id = Column(String, primary_key=True)
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
    gender = Column(String, nullable=True)
    age = Column(Integer, nullable=True)

# =========================== Feedback =========================== #
class Feedback(Base):
    __tablename__ = 'feedback'

    id = Column(String, primary_key=True)
    event_id = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    ratings = Column(Integer, nullable=True)
    description = Column(String, nullable=True)

# create all models
def create_models(engine):
    Base.metadata.create_all(engine)
