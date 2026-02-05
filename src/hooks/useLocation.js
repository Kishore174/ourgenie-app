import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useLocation() {
  const [location, setLocation] = useState({
    area: "Fetching...",
    full: ""
  });

  useEffect(() => {
    (async () => {
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

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });

        const place = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });

        if (place.length > 0) {
          const p = place[0];

          const area =
            p.suburb ||
            p.neighborhood ||
            p.street ||
            p.city ||
            "Your location";

          const full = [
            p.city,
            p.subregion,
            p.region,
            p.postalCode
          ]
            .filter(Boolean)
            .join(", ");

          setLocation({ area, full });
        }
      } catch (e) {
        console.log("Location error:", e);
        setLocation({
          area: "Location unavailable",
          full: ""
        });
      }
    })();
  }, []);

  return location;
}
