import { useEffect, useState } from "react";

type StopUpdate = {
  stopId: string;
  arrivalTime: number | null;
  departureTime: number | null;
};

type Train = {
  tripId: string;
  startDate: string;
  routeId: string;
  upcomingStops: StopUpdate[];
};

type TrainResponse = {
  updatedAt: number | null;
  trains: Train[];
};

function formatTime(timestamp: number | null) {
  if (timestamp === null) return "Unavailable";
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  });
}


export default function App() {
  const [data, setData] = useState<TrainResponse | null>(null);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function loadTrains() { 
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/trains/1",
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        const result: TrainResponse = await response.json();

        if (!controller.signal.aborted) {
          setData(result);
          setError(null);
        }
      } catch (error) {
        if(!controller.signal.aborted) {
          setError(
            error instanceof Error ? error.message : "Could not load train data.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          timer = setTimeout(loadTrains, 30_000);
        }
      }
    }
    void loadTrains();
    return () => {
      controller.abort();
      if ( timer !== undefined) clearTimeout(timer);
    };
  }, []);

  return (
    <main>
      <h1>
        NYC Transit - 1 train
      </h1>

      <TransitMap />

      <h1>NYC Transit Map Data</h1>
      <p>Updates automatically every 30 seconds(ish)</p>

      {error && (
        <p role="alert">
          {error}
          {data && " Showing the last successful response."}
        </p>
      )}

      {!data && !error && <p>Loading Train Data...</p>}

      {data && (
        <>
        <p>
          Feed timestamp: {formatTime(data.updatedAt)} (New York time; EST)
        </p>
        <p>{data.trains.length} trips in the feed</p>

        <table>
          <thead>
            <tr>
              <th>Trip</th>
              <th>First listed stop</th>
              <th>Arrival / departure</th>
              <th>Stops listed</th>
            </tr>
          </thead>
          <tbody>
            {data.trains.map((train) => {
              const stop = train.upcomingStops[0];
              const time = stop?.arrivalTime ?? stop?.departureTime ?? null;

              return (
                <tr key={`${train.startDate}-${train.tripId}`}>
                  <td>{train.tripId}</td>
                  <td>{stop?.stopId ?? "Unavailable"}</td>
                  <td>{formatTime(time)}</td>
                  <td>{train.upcomingStops.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </>
      )}
    </main>
  );
  
}