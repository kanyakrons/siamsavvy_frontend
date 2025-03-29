import React from "react";
import { useNavigate } from "react-router-dom";

const PlanTrip = () => {
  const navigate = useNavigate();
  return (
    <div className="flex px-[8rem] pt-20 bg-blue-50 w-full min-h-[25rem] justify-around">
      <div className="w-2/5 ">
        {" "}
        <p className="font-bold text-3xl">Plan Your Trip</p>
        <button
          type="button"
          class="mt-8 text-white bg-black hover:bg-transparent hover:text-black hover:border-2 hover:border-black font-medium rounded-full text-sm px-10 py-4 text-center inline-flex items-center "
          onClick={() => {
            navigate("/plans/generate");
          }}
        >
          Explore More
          <svg
            class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col w-3/5">
        <p>
          Explore 77 vibrant cities across 5 unique zones—each with its own
          flavor, from bustling urban hubs to hidden natural escapes. Let AI
          craft your perfect itinerary, or dive into shared plans from travelers
          who’ve been there.
        </p>
        <div className="grid grid-cols-2 gap-5 mt-10">
          <div className="flex flex-col">
            <p className="text-3xl font-bold">📍 77 Cities, Endless Combos</p>
            <p className="">
              Mix and match destinations to build your dream route. Beach hop,
              mountain climb, or city binge—it’s your call.
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-3xl font-bold">🗺️ 5 Zones, Endless Routes</p>
            <p>
              {" "}
              Navigate by region: Coastal, Cultural, Adventure, Urban, or
              Serene. Filter by vibe, not just maps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
