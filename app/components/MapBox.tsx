"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Item {
  ID: string;
  Name: string;
  lat: number;
  long: number;
  found: boolean;
}

interface MapboxExampleProps {
  items: Item[];
}

const MapboxExample = ({ items }: MapboxExampleProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWdhdGhheSIsImEiOiJjbWx3bnI2d3UwanduM2ZvZ3V0NGJtazE0In0.V_jbokD218Gmfxt1L7o2Eg';

    if (!mapContainerRef.current) return;

    const bounds: [[number, number], [number, number]] = [
      [-71.14, 42.40],  // Southwest
      [-71.08, 42.44]   // Northeast
    ];

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-71.1197, 42.4075],  // Tufts campus center
      zoom: 16,  // Closer zoom for campus view
      maxBounds: bounds
    });

    // Add markers from props
    items.forEach(item => {
      const markerColor = item.found ? '#10b981' : '#ef4444';
      
      new mapboxgl.Marker({ color: markerColor })
        .setLngLat([item.long, item.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <strong>${item.Name}</strong><br/>
            Status: ${item.found ? 'Found' : 'Lost'}
          `)
        )
        .addTo(mapRef.current!);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [items]);

  return <div ref={mapContainerRef} style={{ height: '100%' }}></div>;
};

export default MapboxExample;