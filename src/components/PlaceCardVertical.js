import React from "react";

const PlaceCardvertical = ({ place, height }) => {
  return (
    <div className="relative w-full h-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
      <img
        src={place.pic}
        className="w-full object-cover rounded-md"
        style={{ height: `${height}px` }}
      />
      <p class="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-[90%] text-white  font-semibold overflow-hidden text-lg w-[250px] text-center">
        {place.title}
      </p>
    </div>
  );
};

export default PlaceCardvertical;
