import React, { useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./TripForm.css";
import { TripContext } from "../main/utils/TripContext";

const BACKEND_URL = "https://ai-trip-planner-ymrv.onrender.com/api/geminiAI";
const REQUEST_TIMEOUT = 180000;

export default function TripForm() {
  // Removed onFormSubmit prop
  const { setTripData, setLoading } = useContext(TripContext);
  const [origin, setOrigin] = useState("Chennai");
  const [destination, setDestination] = useState("Bengaluru");
  const [startDate, setStartDate] = useState("2025-03-25");
  const [endDate, setEndDate] = useState("2025-03-28");
  const [budget, setBudget] = useState("Cheap");
  const [numPersons, setNumPersons] = useState(1);
  const navigate = useNavigate(); // Initialize useNavigate

  const validateForm = () => {
    if (!origin || !destination || !startDate || !endDate || !budget) {
      toast.error("All fields are required!", { position: "bottom-right" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTripData(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const requestData = {
      startLocation: origin,
      destination,
      startDate,
      endDate,
      budgetType: budget,
      persons: numPersons,
    };

    try {
      const response = await axios.post(BACKEND_URL, requestData, {
        timeout: REQUEST_TIMEOUT,
      });
      toast.success("Trip generated successfully!", { position: "top-center" });
      setTripData(response.data.tripPlan);
      navigate("/trip-result"); // Navigate to /trip-result after successful submission
    } catch (error) {
      console.error("Error submitting trip:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to generate trip. Try again!";
      toast.error(errorMessage, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-form-container">
      <form onSubmit={handleSubmit} className="trip-form">
        <h2 id="tripform-h">Plan Your Trip</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Start Location"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
          />
        </div>
        <label className="form-label">Select Your Budget</label>
        <div className="selection-group">
          {["cheap", "moderate", "luxury"].map((type) => (
            <div
              key={type}
              className={`budget-card ${budget === type ? "active" : ""}`}
              onClick={() => setBudget(type)}
            >
              <span role="img" aria-label={type}>
                {type === "cheap" ? "💵" : type === "moderate" ? "💰" : "💎"}
              </span>
              <p>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
            </div>
          ))}
        </div>
        <label className="form-label">Who Are You Traveling With?</label>
        <div className="selection-group">
          {[1, 2, 3, 5].map((num) => (
            <div
              key={num}
              className={`travel-card ${numPersons === num ? "active" : ""}`}
              onClick={() => setNumPersons(num)}
            >
              <span role="img" aria-label={num}>
                {num === 1 ? "✈️" : num === 2 ? "🥂" : num === 3 ? "🏡" : "⛵"}
              </span>
              <p>
                {num === 1
                  ? "Just Me"
                  : num === 2
                  ? "Couple"
                  : num === 3
                  ? "Family"
                  : "Friends"}
              </p>
            </div>
          ))}
        </div>
        <button type="submit" className="submit-btn">
          Generate Trip
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
