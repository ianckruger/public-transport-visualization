import {Map, setWorkerUrl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(workerUrl);

export default function TransitMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!mapContainer.current) return;
        const map = new Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center:[-73.9712, 40.7831],
        zoom: 10,
        interactive: true,
    });
    return () => map.remove();
    },[]);
    
    return (
        <div ref={mapContainer} style={{width: "100%", height:"600px"}}></div>
    );
}