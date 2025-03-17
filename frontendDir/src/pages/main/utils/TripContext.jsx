import React, { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <TripContext.Provider
      value={{ tripData, setTripData, loading, setLoading }}
    >
      {children}
    </TripContext.Provider>
  );
};
