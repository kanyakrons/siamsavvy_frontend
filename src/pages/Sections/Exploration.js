import React, { useEffect, useState } from "react";
import PlaceCardvertical from "../../components/PlaceCardVertical";
import { getProvinces } from "../../api/placeApi";
import { useNavigate } from "react-router-dom";

const Exploration = () => {
  const [provinces, setProvinces] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const provincesData = await getProvinces();
        setProvinces(provincesData.data);
      } catch (error) {}
    };
    fetchData();
  }, []);
  return (
    <div className="w-full min-h-[40rem] pt-8">
      <div className="justify-center items-center flex flex-col">
        <p className="text-2xl font-bold">EXPLORATION</p>
        <p className="mt-1 text-purple-400">
          Lorem ipsum dolor sit amet consectetur. Diam eu risus volutpat in.{" "}
        </p>
      </div>
      <div className=" grid grid-cols-3 gap-4 mt-8 mx-20 ">
        <div
          onClick={() => {
            navigate(`/places?listProvince=${provinces[0]}`);
          }}
        >
          <PlaceCardvertical
            place={{
              title: provinces[0],
              pic: "https://siamsavvy.s3.ap-southeast-2.amazonaws.com/exploration.png",
            }}
            height={600}
          />
        </div>

        <div
          onClick={() => {
            navigate(`/places?listProvince=${provinces[1]}`);
          }}
        >
          <PlaceCardvertical
            place={{
              title: provinces[1],
              pic: "https://siamsavvy.s3.ap-southeast-2.amazonaws.com/exploration.png",
            }}
            height={600}
          />
        </div>

        <div
          onClick={() => {
            navigate(`/places?listProvince=${provinces[2]}`);
          }}
        >
          <PlaceCardvertical
            place={{
              title: provinces[2],
              pic: "https://siamsavvy.s3.ap-southeast-2.amazonaws.com/exploration.png",
            }}
            height={600}
          />
        </div>
      </div>
    </div>
  );
};

export default Exploration;
