import React, { useContext } from "react";
import RouteMap from "./Components/RouteMap";
import "../main/TripResult.css";
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
    return <p>Fetching Data...</p>;
  }

  if (!tripData?.length) {
    return <p>No Data Available</p>;
  }

  const tripPlan = tripData[0];
  console.log(tripPlan);
  // const hotelOptions = tripPlan?.hotelOptions || [];

  return (
    <div className="trip-results">
      <div className="trip-header">
        <div className="trip-details col-5 p-2">
          <h2>{`Travel Plan for ${tripPlan?.tripDetails?.startCity} to ${tripPlan?.tripDetails?.endCity}`}</h2>
          <p>
            Dates: {formatDate(tripPlan?.tripDetails?.startDate)} -{" "}
            {formatDate(tripPlan?.tripDetails?.endDate)}
          </p>
          <p>Travelers: {tripPlan?.tripDetails?.travelers}</p>
          <p>Budget: {tripPlan?.tripDetails?.budget}</p>
        </div>
        <div className="map-header col-5">
          <h3>Map View</h3>
          {tripPlan?.mapUIData ? (
            <RouteMap mapUIData={tripPlan.mapUIData} />
          ) : (
            <p>🏞️ No map data available.</p>
          )}
        </div>
      </div>
      <div className="itinerary-container col-12">
        <h3>Itinerary</h3>
        <div className="timeline">
          <div className="itinerary">
            {Object.keys(tripPlan.itinerary).map((dayKey) => {
              const day = tripPlan.itinerary[dayKey];
              return (
                <div key={dayKey} className="day-card">
                  <h4>{`Day ${dayKey.replace("day", "")} - ${day.date}`}</h4>
                  <ul className="activity-list">
                    {day.activities.map((activity, i) => (
                      <li key={i}>
                        <strong>{activity.time}:</strong> {activity.description}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* <div className="hotels">
        <h3>Hotel Options</h3>
        <div className="hotels-container">
          {hotelOptions.map((hotel, index) => (
            <div key={index} className="hotel-card card">
              <img
                src={hotel.imageURL || "https://via.placeholder.com/200"}
                alt={hotel.name || "Hotel Image"}
                className="card-img-top"
              />
              <div className="card-body">
                <h5>{hotel.name}</h5>
                <p>Rating: {hotel.rating} ⭐</p>
                <p>{hotel.description}</p>
                <p>Price: ₹{hotel.price}</p>
                {hotel.coordinates && (
                  <a
                    href={`https://www.google.com/maps?q=${hotel.coordinates.latitude},${hotel.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Get Directions
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default TripResults;
