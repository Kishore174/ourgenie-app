import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    area: "Fetching location...",
    full: ""
  });

  /* 🔴 LIVE LOCATION ON APP LOAD */
  useEffect(() => {
    getLiveLocation();
  }, []);

  const getLiveLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocation({
          area: "Permission denied",
          full: ""
        });
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const place = await Location.reverseGeocodeAsync(loc.coords);

      if (place.length) {
        const p = place[0];
        setLocation({
          area:
            p.suburb ||
            p.neighborhood ||
            p.city ||
            "Your location",
          full: [
            p.street,
            p.city,
            p.region,
            p.postalCode
          ].filter(Boolean).join(", ")
        });
      }
    } catch (e) {
      console.log("Location error:", e);
    }
  };

  return (
    <LocationContext.Provider
      value={{ location, setLocation, getLiveLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () =>
  useContext(LocationContext);
