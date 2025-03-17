/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import TripForm from "../TripForm";
import { TripContext } from "../utils/TripContext";

// Mock dependencies
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => <div>ToastContainer</div>,
}));

// Mock process.env for API URL
process.env.REACT_APP_BACKEND_URI = "http://localhost:5000";

// Mock TripContext Provider
const mockSetTripData = jest.fn();
const mockSetLoading = jest.fn();
const mockOnFormSubmit = jest.fn();

const TripContextProvider = ({ children }) => (
  <TripContext.Provider
    value={{ setTripData: mockSetTripData, setLoading: mockSetLoading }}
  >
    {children}
  </TripContext.Provider>
);

// Suppress console.error for API failures
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("TripForm Component", () => {
  test("renders TripForm with initial values", () => {
    render(
      <TripContextProvider>
        <TripForm onFormSubmit={mockOnFormSubmit} />
      </TripContextProvider>
    );

    expect(screen.getByText("Plan Your Trip")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Start Location")).toHaveValue(
      "Chennai"
    );
    expect(screen.getByPlaceholderText("Destination")).toHaveValue("Bengaluru");
    expect(screen.getByDisplayValue("2025-03-25")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-03-28")).toBeInTheDocument();
    expect(screen.getByText(/cheap/i)).toBeInTheDocument();
    expect(screen.getByText(/just me/i)).toBeInTheDocument();
    expect(screen.getByText("Generate Trip")).toBeInTheDocument();
  });

  test("updates form fields on user input", () => {
    render(
      <TripContextProvider>
        <TripForm onFormSubmit={mockOnFormSubmit} />
      </TripContextProvider>
    );

    const originInput = screen.getByPlaceholderText("Start Location");
    const destinationInput = screen.getByPlaceholderText("Destination");
    const startDateInput = screen.getByDisplayValue("2025-03-25");
    const endDateInput = screen.getByDisplayValue("2025-03-28");

    fireEvent.change(originInput, { target: { value: "Mumbai" } });
    fireEvent.change(destinationInput, { target: { value: "Delhi" } });
    fireEvent.change(startDateInput, { target: { value: "2025-04-01" } });
    fireEvent.change(endDateInput, { target: { value: "2025-04-05" } });

    expect(originInput).toHaveValue("Mumbai");
    expect(destinationInput).toHaveValue("Delhi");
    expect(startDateInput).toHaveValue("2025-04-01");
    expect(endDateInput).toHaveValue("2025-04-05");
  });

  test("submits form and calls API successfully", async () => {
    const mockResponse = { data: { tripPlan: { id: 1, name: "Test Trip" } } };
    axios.post.mockResolvedValue(mockResponse);

    render(
      <TripContextProvider>
        <TripForm onFormSubmit={mockOnFormSubmit} />
      </TripContextProvider>
    );

    const submitButton = screen.getByText("Generate Trip");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/geminiAI",
        expect.objectContaining({
          startLocation: expect.any(String),
          destination: expect.any(String),
          startDate: expect.any(String),
          endDate: expect.any(String),
          budgetType: expect.any(String),
          persons: expect.any(Number),
        })
      );

      expect(toast.success).toHaveBeenCalledWith(
        "Trip generated successfully!",
        { position: "top-center" }
      );
      expect(mockSetTripData).toHaveBeenCalledWith(mockResponse.data.tripPlan);
      expect(mockOnFormSubmit).toHaveBeenCalled();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  test("shows error when required fields are missing", () => {
    render(
      <TripContextProvider>
        <TripForm onFormSubmit={mockOnFormSubmit} />
      </TripContextProvider>
    );

    const originInput = screen.getByPlaceholderText("Start Location");
    fireEvent.change(originInput, { target: { value: "" } });
    const submitButton = screen.getByText("Generate Trip");
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("All fields are required!", {
      position: "bottom-right",
    });
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("shows error on API failure", async () => {
    axios.post.mockRejectedValue(new Error("API Error"));

    render(
      <TripContextProvider>
        <TripForm onFormSubmit={mockOnFormSubmit} />
      </TripContextProvider>
    );

    const submitButton = screen.getByText("Generate Trip");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to generate trip. Try again!"
      );
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  test("updates budget selection", () => {
    render(
      <TripContextProvider>
        <TripForm onFormSubmit={mockOnFormSubmit} />
      </TripContextProvider>
    );

    const luxuryOption = screen.getByText(/luxury/i);
    fireEvent.click(luxuryOption);

    expect(luxuryOption.parentElement).toHaveClass("active");
    expect(screen.getByText(/cheap/i).parentElement).not.toHaveClass("active");
  });

  test("updates number of persons selection", () => {
    render(
      <TripContextProvider>
        <TripForm onFormSubmit={mockOnFormSubmit} />
      </TripContextProvider>
    );

    const familyOption = screen.getByText(/family/i);
    fireEvent.click(familyOption);

    expect(familyOption.parentElement).toHaveClass("active");
    expect(screen.getByText(/just me/i).parentElement).not.toHaveClass(
      "active"
    );
  });
});
