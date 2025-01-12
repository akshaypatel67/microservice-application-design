from db.connection import session
from db.models import Event, EventHistory, TicketHistory, TicketStatus, Feedback, User
from sqlalchemy.orm import joinedload
from sqlalchemy import func, and_
from datetime import datetime
from dateutil.relativedelta import relativedelta

AGE_DISTRIBUTION = [[0, 17], [18, 30], [31, 50], [51, 100]]
TIME_MAP = {
    "daily": "day",
    "monthly": "month",
    "weekly": "week",
}

# ======================================== Helper Methods ========================================

def get_latest_ticket_status_query(filters):
    query = (
        session.query(
            TicketHistory.ticket_id, 
            func.max(TicketHistory.created_on).label("created_on")
        )
        .join(Event)
        .filter(*filters)
        .group_by(TicketHistory.ticket_id)
        .subquery()
    )
    return query

def get_count_for_status(latest_ticket_status, status):
        return (
            session.query(
                TicketHistory.event_id,
                Event.name,
                func.count(TicketHistory.ticket_id).label(f"total_{'booked' if status == TicketStatus.BOOKED else 'cancelled'}_tickets")
            )
            .join(Event)
            .join(latest_ticket_status, TicketHistory.ticket_id == latest_ticket_status.c.ticket_id)  # Join with subquery on ticket_id
            .filter(TicketHistory.created_on == latest_ticket_status.c.created_on)  # Ensure we are getting the latest ticket status
            .filter(TicketHistory.ticket_status == status)  # Only consider "BOOKED/CANCELLED" tickets
            .group_by(TicketHistory.event_id, Event.name)  # Group by event_id to get the total count per event
        ).all()

def get_average_ratings(filters):
    average_ratings = (
        session.query(
            Feedback.event_id,
            func.avg(Feedback.ratings).label("average_ratings")
        )
        .join(Event)
        .filter(*filters)
        .group_by(Feedback.event_id)
        .all()
    )
    return average_ratings

# ======================================== Analytics Methods ========================================

def get_event_popularity(user_id, event_id=None):
    """
    Provides popularity statistics for events, such as number of tickets sold/cancelled, visits and average ratings.
    """

    filters = []
    filters.append(Event.user_id == user_id)
    if event_id:
        filters.append(Event.id == event_id)
    
    latest_ticket_status = get_latest_ticket_status_query(filters)

    booked_count = get_count_for_status(latest_ticket_status, TicketStatus.BOOKED)
    cancelled_count = get_count_for_status(latest_ticket_status, TicketStatus.CANCELLED)

    visit_count = (
        session.query(
            EventHistory.event_id,
            func.count(EventHistory.id).label("visit_count")
        )
        .join(Event)
        .filter(*filters)
        .group_by(EventHistory.event_id)
        .all()
    )

    average_ratings = get_average_ratings(filters)
    average_ratings = [{**data._mapping, "average_ratings": round(float(data._mapping["average_ratings"]), 2)} for data in average_ratings]
    print(average_ratings)

    event_data = {}

    def update_event_data(rows):
        for row in rows:
            if type(row) != dict:
                row = dict(row._mapping)
            if not event_data.get(row.get("event_id")):
                event_data[row.get("event_id")] = {}
            event_data[row.get("event_id")].update(row)

    update_event_data(booked_count)
    update_event_data(cancelled_count)
    update_event_data(visit_count)
    update_event_data(average_ratings)

    print(event_data)

    return event_data

    
def get_user_demographics(user_id, event_id=None):
    filters = []
    filters.append(Event.user_id == user_id)
    if event_id:
        filters.append(Event.id == event_id)

    ticket_query = get_latest_ticket_status_query(filters)

    ticket_data = (
        session.query(TicketHistory.event_id, User.email, User.gender, User.age)
        .join(ticket_query, TicketHistory.ticket_id == ticket_query.c.ticket_id) # Join with subquery on ticket_id
        .join(User)
        .filter(TicketHistory.created_on == ticket_query.c.created_on)  # Ensure we are getting the latest ticket status
        .filter(TicketHistory.ticket_status == TicketStatus.BOOKED) # We only need Booked tickets
        .all()
    )

    event_wise_demographics = {}

    for data in ticket_data:
        data = dict(data._mapping)
        event_id = data.get("event_id")

        if not event_id in event_wise_demographics:
            event_wise_demographics[event_id] = {
                "gender_distribution": {},
                "age_distribution": {}
            }
        
        event_wise_demographics[event_id]["gender_distribution"][data.get("gender")] = \
            event_wise_demographics.get(event_id).get("gender_distribution").get(data.get("gender"), 0) + 1
        
        for range in AGE_DISTRIBUTION:
            if data.get("age") >= range[0] and data.get("age") <= range[1]:
                range_key = f"_{str(range[0])}_{str(range[1])}"
                event_wise_demographics[event_id]["age_distribution"][range_key] = \
                    event_wise_demographics.get(event_id).get("age_distribution").get(range_key, 0) + 1
                break

    return event_wise_demographics

def get_user_demographics_feedback(user_id, event_id=None):
    filters = []
    filters.append(Event.user_id == user_id)
    if event_id:
        filters.append(Event.id == event_id)

    feedback_data = (
        session.query(Feedback.event_id, Feedback.ratings, User.gender, User.age)
        .join(Event)
        .join(User)
        .filter(*filters)
        .all()
    )

    event_wise_ratings = {}
    event_wise_total = {}

    for data in feedback_data:
        data = dict(data._mapping)
        event_id = data.get("event_id")

        if not event_id in event_wise_ratings:
            event_wise_ratings[event_id] = {
                "gender_distribution": {},
                "age_distribution": {}
            }

            event_wise_total[event_id] = {
                "gender_distribution": {},
                "age_distribution": {}
            }

        event_wise_ratings[event_id]["gender_distribution"][data.get("gender")] = \
            event_wise_ratings.get(event_id).get("gender_distribution").get(data.get("gender"), 0) + data.get("ratings")
        
        event_wise_total[event_id]["gender_distribution"][data.get("gender")] = \
            event_wise_total.get(event_id).get("gender_distribution").get(data.get("gender"), 0) + 1
        
        for range in AGE_DISTRIBUTION:
            if data.get("age") >= range[0] and data.get("age") <= range[1]:
                range_key = f"_{str(range[0])}_{str(range[1])}"
                event_wise_ratings[event_id]["age_distribution"][range_key] = \
                    event_wise_ratings.get(event_id).get("age_distribution").get(range_key, 0) + data.get("ratings")
                event_wise_total[event_id]["age_distribution"][range_key] = \
                    event_wise_total.get(event_id).get("age_distribution").get(range_key, 0) + 1
                break

    event_wise_feedback = {}
    for event_id in event_wise_ratings:
        event_wise_feedback[event_id] = {
            "gender_distribution": {},
            "age_distribution": {}
        }

        for gender in event_wise_ratings[event_id].get("gender_distribution"):
            event_wise_feedback[event_id]["gender_distribution"][gender] = \
                float(event_wise_ratings[event_id].get("gender_distribution").get(gender, 0)) / \
                float(event_wise_total[event_id].get("gender_distribution").get(gender))
            
        for age_range in event_wise_ratings[event_id].get("age_distribution"):
            event_wise_feedback[event_id]["age_distribution"][age_range] = \
                float(event_wise_ratings[event_id].get("age_distribution").get(age_range, 0)) / \
                float(event_wise_total[event_id].get("age_distribution").get(age_range))
            
    return event_wise_feedback


def get_event_trends(user_id, time_range="monthly", event_id=None):
    filters = []
    filters.append(Event.user_id == user_id)
    if event_id:
        filters.append(Event.id == event_id)

    ticket_query = get_latest_ticket_status_query(filters)

    time_wise_booking_count = (
        session.query(
            TicketHistory.event_id,
            func.date_trunc(TIME_MAP.get(time_range), TicketHistory.created_on).label("period"),
            func.count(TicketHistory.id).label("total")
        )
        .join(ticket_query, (TicketHistory.ticket_id == ticket_query.c.ticket_id) & (TicketHistory.created_on == ticket_query.c.created_on))
        .filter(TicketHistory.ticket_status == TicketStatus.BOOKED)
        .group_by(
            TicketHistory.event_id,
            func.date_trunc(TIME_MAP.get(time_range), TicketHistory.created_on)
        )
        .all()
    )

    event_wise_trend = {}

    for row in time_wise_booking_count:
        row = dict(row._mapping)
        if not row.get("event_id") in event_wise_trend:
            event_wise_trend[row.get("event_id")] = {}
        
        start_date = row.get("period").date()
        if time_range == "monthly":
            end_date = start_date + relativedelta(day=31)   # it will return last day of the month
        elif time_range == "weekly":
            end_date = start_date + relativedelta(days=6)
        else:
            end_date = start_date
        event_wise_trend[row.get("event_id")][f"{str(start_date)} - {str(end_date)}"] = row.get("total")

    return event_wise_trend


def get_top_events(user_id=None):
    filters = []
    if user_id:
        filters.append(Event.user_id == user_id)

    ticket_query = get_latest_ticket_status_query(filters)
    event_booking = get_count_for_status(ticket_query, TicketStatus.BOOKED)

    event_booking.sort(key=lambda data: data._mapping["total_booked_tickets"], reverse=True)

    result = [dict(data._mapping) for data in event_booking]

    return result[:10]




# -----------------------------------------------------------------------------------------------------------------------------------------
# query = session.query(Event).options(joinedload(Event.ticket_histories))

# data = session \
#         .query(Event.id, Event.name, 
#                func.count(TicketHistory.id).label("ticket_count")) \
#         .filter(*filters) \
#         .join(TicketHistory) \
#         .group_by(Event.id, Event.name).all()





# return (session.query(TicketHistory.event_id,Event.name,func.count(TicketHistory.ticket_id).label("total_booked_tickets")).join(Event).join(latest_ticket_status, TicketHistory.ticket_id == latest_ticket_status.c.ticket_id).filter(TicketHistory.created_on == latest_ticket_status.c.created_on).filter(TicketHistory.ticket_status == status).group_by(TicketHistory.event_id)).all()return (session.query(TicketHistory.event_id,Event.name,func.count(TicketHistory.ticket_id).label("total_booked_tickets")).join(Event).join(latest_ticket_status, TicketHistory.ticket_id == latest_ticket_status.c.ticket_id).filter(TicketHistory.created_on == latest_ticket_status.c.created_on).filter(TicketHistory.ticket_status == status).group_by(TicketHistory.event_id)).all()
