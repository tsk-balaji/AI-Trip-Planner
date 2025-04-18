import React, { useContext } from "react";
import { motion } from "framer-motion";
import { TripContext } from "./utils/TripContext";
import "../main/TripResults.css";
import { useNavigate } from "react-router-dom";

// Dynamically import RouteMap component for tree shaking
const RouteMap = React.lazy(() => import("./Components/RouteMap"));

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
  const navigate = useNavigate(); // Initialize useNavigate

  if (!tripData) return <div>Loading...</div>; // Early return if data is missing

  const { tripDetails, itinerary, hotelOptions, mapUIData } = tripData;

  if (!tripDetails) {
    return <div>Error: Trip details not available.</div>;
  }

  const metaVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const metaItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const handleGenerateAnotherTrip = () => {
    navigate("/generate-trip"); // Navigate to generate-trip route
  };

  return (
    <div className="trip-results-container">
      <section className="trip-header">
        <div className="trip-header-content col-6">
          <h3 className="trip-title">
            {`Travel Plan: ${tripDetails?.startCity ?? "N/A"} → ${
              tripDetails?.endCity ?? "N/A"
            }`}
          </h3>
          <motion.div
            className="trip-meta"
            variants={metaVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="meta-item" variants={metaItemVariants}>
              From {formatDate(tripDetails?.startDate)} Till{" "}
              {formatDate(tripDetails?.endDate)}
            </motion.span>
            <motion.span className="meta-item" variants={metaItemVariants}>
              No of Travelers : {tripDetails?.travelers ?? "N/A"}
            </motion.span>
            <motion.span className="meta-item" variants={metaItemVariants}>
              Budget: {tripDetails?.budget ?? "N/A"}
            </motion.span>
          </motion.div>
        </div>
        <div className="map-container col-6">
          <h3 className="map-title">Route Overview</h3>
          {mapUIData ? (
            <React.Suspense fallback={<div>Loading Map...</div>}>
              <RouteMap mapUIData={mapUIData} />
            </React.Suspense>
          ) : (
            <div className="map-placeholder">Map data not available.</div>
          )}
        </div>
      </section>

      <section className="itinerary-section">
        <h3 className="section-title">Your Itinerary</h3>
        <div className="itinerary-wrapper">
          {itinerary ? (
            Object.entries(itinerary).map(([dayKey, day], index) => (
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

      {hotelOptions?.length > 0 && (
        <section className="hotel-section">
          <h3 className="section-title">Hotel Suggestions</h3>
          <ul className="hotel-list">
            {hotelOptions.map((hotel, index) => (
              <li key={index} className="hotel-list-item">
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
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="generate-another-trip-container">
        <button
          className="generate-another-trip-button"
          onClick={handleGenerateAnotherTrip}
        >
          Generate Another Trip
        </button>
      </div>
    </div>
  );
};

export default TripResults;
