import React, { useContext } from "react";
import RouteMap from "./Components/RouteMap";
import "../main/TripResults.css";
import { TripContext } from "./utils/TripContext";

const formatDate = (dateString) => {
  return dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
};

const TripResults = () => {
  const { tripData, loading } = useContext(TripContext);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Fetching Data...</p>
      </div>
    );
  }

  if (!tripData?.length) {
    return (
      <div className="no-data-container">
        <p>No Data Available</p>
      </div>
    );
  }

  const tripPlan = tripData[0];

  return (
    <div className="trip-results">
      <section className="trip-header">
        <div className="trip-details">
          <h2>
            {`Travel Plan: ${tripPlan?.tripDetails?.startCity} → ${tripPlan?.tripDetails?.endCity}`}
          </h2>
          <div className="trip-meta">
            <span>
              <i className="icon-calendar"></i>
              {formatDate(tripPlan?.tripDetails?.startDate)} -{" "}
              {formatDate(tripPlan?.tripDetails?.endDate)}
            </span>
            <span>
              <i className="icon-users"></i>
              {tripPlan?.tripDetails?.travelers} Travelers
            </span>
            <span>
              <i className="icon-budget"></i>
              Budget: {tripPlan?.tripDetails?.budget}
            </span>
          </div>
        </div>
        <div className="map-container">
          <h3>Route Overview</h3>
          {tripPlan?.mapUIData ? (
            <RouteMap mapUIData={tripPlan.mapUIData} />
          ) : (
            <div className="map-placeholder">🏞️ No map data available</div>
          )}
        </div>
      </section>

      <section className="itinerary-section">
        <h3>Your Itinerary</h3>
        <div className="itinerary-wrapper">
          {Object.entries(tripPlan.itinerary).map(([dayKey, day], index) => (
            <div key={dayKey} className="day-card" data-day={index + 1}>
              <div className="day-header">
                <h4>
                  Day {dayKey.replace("day", "")} - {day.date}
                </h4>
              </div>
              <ul className="activity-list">
                {day.activities.map((activity, i) => (
                  <li key={i} className="activity-item">
                    <span className="activity-time">{activity.time}</span>
                    <span className="activity-desc">
                      {activity.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TripResults;
