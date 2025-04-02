import React, { useContext } from "react";
import RouteMap from "./Components/RouteMap";
import { TripContext } from "./utils/TripContext";
import "../main/TripResults.css";

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/300x200?text=Hotel+Image";

const handleImageError = (event) => {
  event.target.src = PLACEHOLDER_IMAGE_URL;
  event.target.onerror = null;
};

const formatDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return "N/A";
  }
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const TripResults = () => {
  const { tripData } = useContext(TripContext);
  console.log("Trip Data:", tripData);
  const tripPlan = tripData || null;

  if (!tripPlan.tripDetails) {
    console.error("Trip details are missing:", tripPlan);
    return <div>Error: Trip details not available.</div>;
  }

  if (!tripPlan.itinerary) {
    console.error("Trip itinerary is missing:", tripPlan);
  }

  if (!tripPlan.hotelOptions) {
    console.error("Trip hotel options are missing:", tripPlan);
  }

  if (!tripPlan.mapUIData) {
    console.error("Trip map data is missing:", tripPlan);
  }

  return (
    <div className="trip-results-container">
      <section className="trip-header">
        <div className="trip-details">
          <h2 className="trip-title">
            {`Travel Plan: ${tripPlan?.tripDetails?.startCity ?? "N/A"} → ${
              tripPlan?.tripDetails?.endCity ?? "N/A"
            }`}
          </h2>
          <div className="trip-meta">
            <span className="meta-item">
              {formatDate(tripPlan?.tripDetails?.startDate)} -{" "}
              {formatDate(tripPlan?.tripDetails?.endDate)}
            </span>
            <span className="meta-item">
              {tripPlan?.tripDetails?.travelers ?? "N/A"} Travelers
            </span>
            <span className="meta-item">
              Budget: {tripPlan?.tripDetails?.budget ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="map-container">
          <h3 className="map-title">Route Overview</h3>
          {tripPlan?.mapUIData ? (
            <RouteMap mapUIData={tripPlan.mapUIData} />
          ) : (
            <div className="map-placeholder">Map data not available.</div>
          )}
        </div>
      </section>

      <section className="itinerary-section">
        <h3 className="section-title">Your Itinerary</h3>
        <div className="itinerary-wrapper">
          {tripPlan.itinerary ? (
            Object.entries(tripPlan.itinerary).map(([dayKey, day], index) => (
              <div key={dayKey} className="day-card">
                <div className="day-header">
                  <h4 className="day-title">
                    Day {index + 1} - {formatDate(day.date)}
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
            ))
          ) : (
            <p>No itinerary details available.</p>
          )}
        </div>
      </section>

      {tripPlan.hotelOptions?.length > 0 && (
        <section className="hotel-section">
          <h3 className="section-title">Hotel Suggestions</h3>
          <div className="hotel-wrapper">
            {tripPlan.hotelOptions.map((hotel, index) => (
              <div key={index} className="hotel-card">
                <img
                  src={hotel.imageURL || PLACEHOLDER_IMAGE_URL}
                  alt={`Image of ${hotel.name}`}
                  className="hotel-image"
                  onError={handleImageError}
                />
                <div className="hotel-details">
                  <h4 className="hotel-name">{hotel.name}</h4>
                  {hotel.rating && (
                    <p className="hotel-rating">Rating: {hotel.rating} ⭐</p>
                  )}
                  {hotel.price && (
                    <p className="hotel-price">Price: {hotel.price}</p>
                  )}
                  {hotel.description && (
                    <p className="hotel-description">{hotel.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TripResults;
