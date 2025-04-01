import React, { useContext } from "react";
import RouteMap from "./Components/RouteMap"; // Assuming this component is ready
import { TripContext } from "./utils/TripContext"; // Assuming correct context setup
import "../main/TripResults.css"; // Ensure CSS paths are correct

// --- Placeholder Image ---
// You can host your own or use a service. Using placeholder.com as an example.
const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/300x200?text=Hotel+Image";

// --- Helper Function for Image Errors ---
const handleImageError = (event) => {
  event.target.src = PLACEHOLDER_IMAGE_URL; // Set to placeholder on error
  event.target.onerror = null; // Prevent infinite loop if placeholder fails
};

// --- Date Formatting Function ---
const formatDate = (dateString) => {
  // Basic validation: Check if dateString is truthy and potentially a valid date format
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    // console.warn("Invalid date string received:", dateString); // Optional: Log warning
    return "N/A"; // Return N/A for invalid or missing dates
  }
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (err) {
    console.error("Error formatting date:", dateString, err);
    return "Invalid Date"; // Fallback for unexpected errors
  }
};

// --- TripResults Component ---
const TripResults = () => {
  const { tripData, loading } = useContext(TripContext);

  if (loading) {
    return (
      <div className="loading-container">
        {/* Consider adding a spinner */}
        <p>Generating your personalized trip plan...</p>
      </div>
    );
  }

  // Check if tripData is valid and has content
  if (
    !tripData ||
    !Array.isArray(tripData) ||
    tripData.length === 0 ||
    !tripData[0]
  ) {
    // console.log("No valid trip data found.", tripData); // Log for debugging
    return (
      <div className="no-data-container">
        <p>No trip plan generated. Please try creating a new trip.</p>
        {/* Optionally add a button to go back */}
      </div>
    );
  }

  const tripPlan = tripData[0];

  if (!tripPlan.tripDetails || !tripPlan.itinerary) {
    console.error("Trip plan data is missing essential details:", tripPlan); // Log error
    return (
      <div className="no-data-container error">
        <p>
          There was an issue displaying the trip plan. Essential details are
          missing.
        </p>
      </div>
    );
  }

  return (
    <div className="trip-results-container">
      {/* --- Trip Header Section --- */}
      <section className="trip-header">
        <div className="trip-details">
          <h2 className="trip-title">
            {/* Use optional chaining extensively */}
            {`Travel Plan: ${tripPlan?.tripDetails?.startCity ?? "N/A"} → ${
              tripPlan?.tripDetails?.endCity ?? "N/A"
            }`}
          </h2>
          <div className="trip-meta">
            <span className="meta-item">
              <i className="icon-calendar"></i>{" "}
              {/* Replace with actual icon component if using library */}
              {formatDate(tripPlan?.tripDetails?.startDate)} -{" "}
              {formatDate(tripPlan?.tripDetails?.endDate)}
            </span>
            <span className="meta-item">
              <i className="icon-users"></i>{" "}
              {/* Replace with actual icon component */}
              {tripPlan?.tripDetails?.travelers ?? "N/A"} Travelers
            </span>
            <span className="meta-item">
              <i className="icon-budget"></i>{" "}
              {/* Replace with actual icon component */}
              Budget: {tripPlan?.tripDetails?.budget ?? "N/A"}
            </span>
          </div>
        </div>
        {/* --- Map Container --- */}
        <div className="map-container">
          <h3 className="map-title">Route Overview</h3>
          {/* Check if mapUIData exists and has necessary coordinates */}
          {tripPlan?.mapUIData &&
          tripPlan.mapUIData.start?.latitude &&
          tripPlan.mapUIData.end?.latitude ? (
            <RouteMap mapUIData={tripPlan.mapUIData} />
          ) : (
            <div className="map-placeholder">
              {tripPlan?.mapUIData
                ? "Map data incomplete."
                : "Map data not available."}
            </div>
          )}
        </div>
      </section>

      {/* --- Itinerary Section --- */}
      <section className="itinerary-section">
        <h3 className="section-title">Your Itinerary</h3>
        <div className="itinerary-wrapper">
          {/* Check if itinerary exists and is an object before trying to map */}
          {tripPlan.itinerary && typeof tripPlan.itinerary === "object" ? (
            Object.entries(tripPlan.itinerary).map(([dayKey, day], index) =>
              // Ensure 'day' has expected structure
              day && day.date && Array.isArray(day.activities) ? (
                <div key={dayKey} className="day-card" data-day={index + 1}>
                  <div className="day-header">
                    <h4 className="day-title">
                      {/* Use regex to safely extract number, fallback to index */}
                      Day {dayKey.match(/\d+$/)?.[0] || index + 1} -{" "}
                      {formatDate(day.date)}
                    </h4>
                  </div>
                  <ul className="activity-list">
                    {day.activities.map((activity, i) =>
                      // Ensure activity has expected structure
                      activity && activity.time && activity.description ? (
                        <li key={i} className="activity-item">
                          <span className="activity-time">{activity.time}</span>
                          <span className="activity-desc">
                            {activity.description}
                          </span>
                        </li>
                      ) : (
                        <li key={i} className="activity-item error">
                          Activity data missing
                        </li> // Handle missing activity data
                      )
                    )}
                  </ul>
                </div>
              ) : (
                <div key={dayKey} className="day-card error">
                  Invalid day data for {dayKey}
                </div> // Handle invalid day structure
              )
            )
          ) : (
            <p>No itinerary details available.</p> // Handle missing itinerary object
          )}
        </div>
      </section>

      {/* --- Hotel Options Section --- */}
      {/* Check if hotelOptions exists and is a non-empty array */}
      {tripPlan.hotelOptions &&
        Array.isArray(tripPlan.hotelOptions) &&
        tripPlan.hotelOptions.length > 0 && (
          <section className="hotel-section">
            <h3 className="section-title">Hotel Suggestions</h3>
            {/* Display Disclaimer */}
            {tripPlan.disclaimer && (
              <p className="disclaimer-text">{tripPlan.disclaimer}</p>
            )}
            <div className="hotel-wrapper">
              {tripPlan.hotelOptions.map((hotel, index) =>
                // Basic check for hotel object validity
                hotel && hotel.name ? (
                  <div key={index} className="hotel-card">
                    <img
                      // Use representativeImageUrl, fallback to placeholder
                      src={
                        hotel.representativeImageUrl || PLACEHOLDER_IMAGE_URL
                      }
                      alt={`Representative image for ${hotel.name}`}
                      className="hotel-image"
                      // Add error handler
                      onError={handleImageError}
                    />
                    <div className="hotel-details">
                      <h4 className="hotel-name">{hotel.name}</h4>
                      {/* Display rating if available */}
                      {hotel.rating && (
                        <p className="hotel-rating">
                          Rating: {hotel.rating}{" "}
                          {typeof hotel.rating === "number" ? "⭐" : ""}
                        </p>
                      )}
                      {/* Display estimated price if available */}
                      {hotel.estimatedPricePerNight && (
                        <p className="hotel-price">
                          Price: {hotel.estimatedPricePerNight}
                        </p>
                      )}
                      {/* Display description if available */}
                      {hotel.description && (
                        <p className="hotel-description">{hotel.description}</p>
                      )}
                      {/* Add Google Maps Search Link */}
                      {hotel.gmapSearchLink && (
                        <a
                          href={hotel.gmapSearchLink}
                          target="_blank" // Open in new tab
                          rel="noopener noreferrer" // Security best practice
                          className="hotel-map-link button" // Style as needed
                        >
                          Search on Google Maps
                          <i className="icon-external-link"></i>{" "}
                          {/* Optional: Add icon */}
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="hotel-card error">
                    Invalid hotel data
                  </div> // Handle missing hotel name or object
                )
              )}
            </div>
          </section>
        )}
    </div> // End trip-results-container
  );
};

export default TripResults;
