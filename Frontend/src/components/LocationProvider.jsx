
import React, { useState } from "react";
import LocationPopup from "./LocationPopup";
import { LocationContext } from "../context/LocationContext";

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {!location && <LocationPopup onLocationSet={setLocation} />}
      {location && children}
    </LocationContext.Provider>
  );
}
