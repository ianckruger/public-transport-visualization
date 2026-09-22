import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.protobuf.message import DecodeError
from google.transit import gtfs_realtime_pb2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

FEED_URL = (
    "https://api-endpoint.mta.info"
    "/Dataservice/mtagtfsfeeds/nyct%2Fgtfs"
)

def event_time(stop, field):
    if not stop.HasField(field):
        return None

    event = getattr(stop, field)
    return int(event.time) if event.HasField("time") else None

@app.get("/api/trains/1")
def get_trains():
    try:
        response = requests.get(FEED_URL, timeout=10)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not fetch the MTA feed.",
        ) from exc

    feed = gtfs_realtime_pb2.FeedMessage()


    try:
        feed.ParseFromString(response.content)
    except DecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not decode the MTA feed.",
        ) from exc

    trains = []

    for entity in feed.entity:
        if not entity.HasField("trip_update"):
            continue

        update = entity.trip_update

        if update.trip.route_id != "1":
            continue

        stops = []

        for stop in update.stop_time_update:
            stops.append({
                "stopId": stop.stop_id,
                "arrivalTime": event_time(stop, "arrival"),
                "departureTime": event_time(stop, "departure"),
            })

        trains.append({
            "tripId": update.trip.trip_id,
            "startDate": update.trip.start_date,
            "routeId": update.trip.route_id,
            "upcomingStops": stops,
        })

    return {
        "updatedAt": (
            int(feed.header.timestamp)
            if feed.header.HasField("timestamp")
            else None
        ),
        "trains": trains,
    }