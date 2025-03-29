import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ places }) => {
  const [map, setMap] = useState(null);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    if (map && places.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      
      places.forEach((place) => {
        const [lat, lng] = place.location.split(",").map(coord => parseFloat(coord.trim()));
        bounds.extend(new window.google.maps.LatLng(lat, lng));
      });
      
      // Fit the map to the bounds
      map.fitBounds(bounds);
    }
  }, [map, places]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyC5sHKuA6W--94ketB3V89APPJSOvS8okM">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={{
          lat: parseFloat(places[0].location.split(",")[0].trim()),
          lng: parseFloat(places[0].location.split(",")[1].trim())
        }}
        zoom={10}
        onLoad={onLoad}
      >
        {places.map((place, index) => {
          const [lat, lng] = place.location.split(",").map(coord => parseFloat(coord.trim()));

          return (
            <Marker
              key={index}
              position={{ lat, lng }}
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
