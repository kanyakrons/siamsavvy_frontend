import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const googleMapsApiKey = "AIzaSyC5sHKuA6W--94ketB3V89APPJSOvS8okM";

const GoogleMapPin = ({ location }) => {
    const openGoogleMaps = () => {
        const { lat, lng } = location;
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
      };
      
  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={15}
      >
        <Marker position={location} onClick={openGoogleMaps} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapPin;
