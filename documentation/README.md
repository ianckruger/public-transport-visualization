# public-transport-visualization

Dependencies:
    > npm install maplibre-gl<br>
    
Tech Stack:
    - React/Typescript for frontend details like line selections, frequency stat parsing, etc
    - MapLibre GL JS for making the map; This entails drawing routes, stations, and moving train dots
    - Python, FastAPI for the backend, to fetch and decode the MTA feed into JSON data
    - MTA GTFS for the static data like station locations, route shapes, etc
    - MTA GTFS-Realtime for live data of train trips + stops + arrivals

You can obtain the data used at this link:

> https://www.mta.info/developers

The browser animates dots between updates to keep everything smooth looking. in-memory cache is used.

MapLibre resources:
    -https://maplibre.org/maplibre-gl-js/docs/
    -https://maplibre.org/maplibre-gl-js/docs/examples/add-a-geojson-line/
    -https://maplibre.org/maplibre-gl-js/docs/examples/draw-geojson-points/

GeoJSON uses [longitude, latitude]. Get the routes, get the routes stations long and lat, and draw a line through each one

MTA Subway GTFS file in backend/data/ has .txt files that are python parsable.

run main
    python -m uvicorn main:app --reload

run frontend
    npm run dev -- --port 5173 --strictPort