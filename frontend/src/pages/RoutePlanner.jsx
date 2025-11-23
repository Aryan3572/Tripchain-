import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { apiRequest } from "../api/api";

import "../styles/animations.css";
import "../theme/light.css";
import "../theme/medium.css";
import "../theme/strong.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function RoutePlanner() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const mapLoaded = useRef(false);

  const [currentPos, setCurrentPos] = useState(null);
  const [destination, setDestination] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [mode, setMode] = useState("driving");
  const [ecoInfo, setEcoInfo] = useState(null);
  const [error, setError] = useState("");

  const directionsClient = mbxDirections({ accessToken: mapboxgl.accessToken });
  const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

  // INIT MAP
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [72.8777, 19.076],
      zoom: 12,
    });

    map.on("load", () => {
      mapLoaded.current = true;
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // GET USER LOCATION
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lng: pos.coords.longitude,
          lat: pos.coords.latitude,
        };
        setCurrentPos(coords);

        const interval = setInterval(() => {
          if (mapLoaded.current) {
            new mapboxgl.Marker().setLngLat([coords.lng, coords.lat]).addTo(mapRef.current);
            mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 14 });
            clearInterval(interval);
          }
        }, 100);
      },
      () => setError("Enable location permissions.")
    );
  }, []);

  // DRAW ROUTE
  function drawRoute(id, data, color) {
    const map = mapRef.current;

    if (!mapLoaded.current) return;

    if (map.getSource(id)) {
      map.removeLayer(id);
      map.removeSource(id);
    }

    map.addSource(id, {
      type: "geojson",
      data,
    });

    map.addLayer({
      id,
      type: "line",
      source: id,
      paint: {
        "line-width": 5,
        "line-color": color,
      },
      layout: { "line-cap": "round", "line-join": "round" },
    });
  }

  // PLAN ROUTE
  async function planRoute(e) {
    e.preventDefault();
    setError("");
    setRouteInfo(null);
    setEcoInfo(null);

    if (!destination.trim()) {
      setError("Enter destination");
      return;
    }
    if (!currentPos) {
      setError("Finding your location...");
      return;
    }

    try {
      const geo = await geocodingClient
        .forwardGeocode({ query: destination, limit: 1 })
        .send();

      if (!geo.body.features.length) {
        setError("Destination not found");
        return;
      }

      const [lng, lat] = geo.body.features[0].center;

      const dir = await directionsClient
        .getDirections({
          profile: mode,   // ← ← ← ONLY CHANGE (this line)
          geometries: "geojson",
          alternatives: true,
          waypoints: [
            { coordinates: [currentPos.lng, currentPos.lat] },
            { coordinates: [lng, lat] },
          ],
        })
        .send();

      const routes = dir.body.routes;

      const fastest = routes[0];
      const eco = [...routes].sort((a, b) => a.distance - b.distance)[0];

      drawRoute("fastest", fastest.geometry, "#6366F1");
      drawRoute("eco", eco.geometry, "#10B981");

      setRouteInfo({
        km: (fastest.distance / 1000).toFixed(2),
        min: Math.round(fastest.duration / 60),
      });

      setEcoInfo({
        km: (eco.distance / 1000).toFixed(2),
        min: Math.round(eco.duration / 60),
      });
    } catch (err) {
      console.error(err);
      setError("Could not calculate route");
    }
  }

  // SAVE TRIP
  async function saveTrip() {
    if (!routeInfo) return alert("Plan a route first");

    const body = {
      from: "My Location",
      to: destination,
      mode: "car",
      distance: Number(routeInfo.km),
      duration: Number(routeInfo.min),
      date: new Date().toISOString(),
    };

    await apiRequest("/api/trips", "POST", body);
    alert("Trip saved!");
  }

  return (
    <div className="page fade-in">
      <div className="glass-card">
        <h1>Route Planner</h1>

        <form onSubmit={planRoute}>
          <input
            placeholder="Enter destination..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button className="btn primary">Show Route</button>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mode-select"
          >
            <option value="driving">🚗 Driving</option>
            <option value="cycling">🚴 Cycling</option>
            <option value="walking">🚶 Walking</option>
          </select>
        </form>

        {routeInfo && (
          <div className="glass-card fade-in">
            <h3>Fastest Route</h3>
            <p>{routeInfo.km} km — {routeInfo.min} min</p>
          </div>
        )}

        {ecoInfo && (
          <div className="glass-card fade-in">
            <h3>Eco Route</h3>
            <p>{ecoInfo.km} km — {ecoInfo.min} min</p>
          </div>
        )}

        <button onClick={saveTrip} className="btn secondary">Save Trip</button>

        {error && <p className="error">{error}</p>}
      </div>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "450px",
          marginTop: "20px",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

export default RoutePlanner;
