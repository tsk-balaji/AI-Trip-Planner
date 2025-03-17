/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import { TripContext } from "../utils/TripContext";
import TripResults from "../TripResults";

const mockTripData = [
  {
    tripDetails: {
      startCity: "New York",
      endCity: "Los Angeles",
      startDate: "2025-06-01",
      endDate: "2025-06-10",
      travelers: 2,
      budget: 1500,
    },
    mapUIData: {},
    itinerary: {
      day1: {
        date: "June 1, 2025",
        activities: [
          { time: "10:00 AM", description: "Visit Statue of Liberty" },
          { time: "2:00 PM", description: "Lunch at a local restaurant" },
        ],
      },
    },
  },
];

describe("TripResults Component", () => {
  test("displays loading message when data is being fetched", () => {
    render(
      <TripContext.Provider value={{ tripData: [], loading: true }}>
        <TripResults />
      </TripContext.Provider>
    );

    expect(screen.getByText("Fetching Data...")).toBeInTheDocument();
  });

  test("displays no data message when no trips are available", () => {
    render(
      <TripContext.Provider value={{ tripData: [], loading: false }}>
        <TripResults />
      </TripContext.Provider>
    );

    expect(screen.getByText("No Data Available")).toBeInTheDocument();
  });

  test("renders trip details when data is available", () => {
    render(
      <TripContext.Provider value={{ tripData: mockTripData, loading: false }}>
        <TripResults />
      </TripContext.Provider>
    );

    expect(
      screen.getByText("Travel Plan for New York to Los Angeles")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Dates: Jun 1, 2025 - Jun 10, 2025")
    ).toBeInTheDocument();
    expect(screen.getByText("Travelers: 2")).toBeInTheDocument();
    expect(screen.getByText("Budget: 1500")).toBeInTheDocument();
  });

  test("renders itinerary correctly", () => {
    render(
      <TripContext.Provider value={{ tripData: mockTripData, loading: false }}>
        <TripResults />
      </TripContext.Provider>
    );

    expect(screen.getByText("Day 1 - June 1, 2025")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM:")).toBeInTheDocument();
    expect(screen.getByText("Visit Statue of Liberty")).toBeInTheDocument();
  });
});
