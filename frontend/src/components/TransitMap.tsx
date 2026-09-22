import {Map} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';



export default function TransitMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!mapContainer.current) return;
        const map = new Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/globe.json',
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