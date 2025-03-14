import React from "react";

const PlaceCardvertical = ({ place, height }) => {
  return (
    <div className="relative  w-full h-full">
      <img
        src={place.pic}
        className={`w-full h-[${height}px] object-cover rounded-md`}
      />
      <p class="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-[90%] text-white  font-semibold overflow-hidden text-lg w-[250px] text-center">
        {place.title}
      </p>
    </div>
  );
};

export default PlaceCardvertical;
