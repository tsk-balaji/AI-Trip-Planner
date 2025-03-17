import React from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RouteMap = ({ mapUIData }) => {
  if (
    !mapUIData ||
    !mapUIData.start ||
    !mapUIData.end ||
    !mapUIData.routeCoordinates
  ) {
    return <p>🗺️ No map data available.</p>;
  }

  const { start, end, waypoints = [], routeCoordinates } = mapUIData;

  return (
    <MapContainer
      center={[waypoints[0].latitude, waypoints[0].longitude]}
      zoom={7.5}
      style={{ height: "400px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polyline positions={routeCoordinates} color="blue" />
      <Marker position={[start.latitude, start.longitude]}>
        <Tooltip permanent>{start.label}</Tooltip>
      </Marker>
      {waypoints.map((waypoint, index) => (
        <Marker key={index} position={[waypoint.latitude, waypoint.longitude]}>
          <Tooltip permanent>{waypoint.label}</Tooltip>
        </Marker>
      ))}
      <Marker position={[end.latitude, end.longitude]}>
        <Tooltip permanent>{end.label}</Tooltip>
      </Marker>
    </MapContainer>
  );
};

export default RouteMap;
