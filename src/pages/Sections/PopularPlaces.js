import React, { useEffect, useState } from "react";
import PlaceCardvertical from "../../components/PlaceCardVertical";
import { searchPlace } from "../../api/placeApi";
import SearchValue from "../Place/SearchValue";
import { useNavigate } from "react-router-dom";

const PopularPlaces = () => {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        SearchValue.pageSize = 4;
        const response = await searchPlace(SearchValue);
        setPlaces(response.data?.content);
      } catch (error) {}
    };
    fetchData();
  }, []);
  return (
    <div className="w-full min-h-[40rem] pt-8">
      <div className="justify-center items-center flex flex-col">
        <p className="text-2xl font-bold">POPULAR PLACES</p>
        <p className="mt-1 text-purple-400">
          Lorem ipsum dolor sit amet consectetur. Diam eu risus volutpat in.{" "}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-8 mx-20 ">
        {places.slice(0, 4).map((place) => (
          <div
            onClick={() => {
              navigate(`/places/${place.id}`);
            }}
          >
            <PlaceCardvertical place={place} height={500} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPlaces;
