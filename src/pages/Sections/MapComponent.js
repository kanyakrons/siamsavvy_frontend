import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = ({ places = [] }) => {
  // Default to empty array
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 13.7563, lng: 100.5018 }); // Default to Bangkok

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    console.log("🚀 ~ MapComponent ~ places:", places);
    if (map && places.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let validLocations = 0;

      places.forEach((place) => {
        if (place?.location) {
          try {
            const [lat, lng] = place.location
              .split(",")
              .map((coord) => parseFloat(coord.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
              bounds.extend(new window.google.maps.LatLng(lat, lng));
              validLocations++;
            }
          } catch (e) {
            console.error("Error parsing location:", place.location, e);
          }
        }
      });

      if (validLocations > 0) {
        // Only fit bounds if we have valid locations
        map.fitBounds(bounds);

        // Set center to first valid location
        const firstValidPlace = places.find((p) => p?.location);
        if (firstValidPlace) {
          const [lat, lng] = firstValidPlace.location
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          setCenter({ lat, lng });
        }
      }
    }
  }, [map, places]);

  // Safe location parsing helper
  const parseLocation = (locationString) => {
    if (!locationString) return null;
    try {
      const [lat, lng] = locationString
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;
    } catch (e) {
      console.error("Error parsing location string:", locationString);
      return null;
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyC5sHKuA6W--94ketB3V89APPJSOvS8okM">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px" }}
        center={center}
        zoom={10}
        onLoad={onLoad}
      >
        {places.map((place, index) => {
          const location = parseLocation(place?.location);
          if (!location) return null;

          return (
            <Marker
              key={`${index}-${location.lat}-${location.lng}`}
              position={location}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
