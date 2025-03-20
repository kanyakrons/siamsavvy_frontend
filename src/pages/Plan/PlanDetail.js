import { useParams } from "react-router-dom";
import { GetPlanDetail } from "../../api/planApi";
import { useEffect, useState } from "react";
import { defaultValue } from "./PlanDefaultValue";
import { Hero } from "../Sections";

const PlanDetail = () => {
  const { planId } = useParams();
  const [planDetails, setPlanDetail] = useState(defaultValue);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetPlanDetail(planId);

      setPlanDetail({
        name: response.data.name,
        detail: JSON.parse(response.data.detail),
      });
    };
    fetchData();
  }, [planId]);

  return (
    <div className="w-full mx-auto h-screen">
      <Hero />
      <div className=" p-5 flex flex-col items-center mt-4">
        <div className="w-full">
          {planDetails.detail && (
            <div>
              <p className="font-semibold text-3xl mb-6">{planDetails.name}</p>
              {/* Day Tabs */}
              <div className="flex overflow-x-auto mb-4">
                {planDetails.detail?.trip.itinerary.map((dayPlan) => (
                  <button
                    onClick={() => {
                      setSelectedDay(parseInt(dayPlan.day) - 1);
                    }}
                    className={`px-4 py-2 mr-2 rounded-xl font-semibold focus:outline-none ${
                      selectedDay === parseInt(dayPlan.day) - 1
                        ? "bg-purple-400 text-white"
                        : "bg-gray-200 text-gray-800"
                    } transition duration-300 ease-in-out ${
                      selectedDay === parseInt(dayPlan.day) - 1
                        ? "hover:bg-purple-500"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    {`Day ${dayPlan.day}`}
                  </button>
                ))}
              </div>

              {/* Places Detail for the Selected Day */}
              {planDetails.detail?.trip.itinerary[selectedDay]?.places ? (
                planDetails.detail?.trip.itinerary[selectedDay].places.map(
                  (place, placeIndex) => (
                    <div key={placeIndex} className="relative mb-5">
                      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl mb-2 relative bg-white shadow-lg">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                          </svg>

                          <p className="ms-2 text-lg">{place.place_name}</p>
                        </div>

                        <div className="flex items-center">
                          <p className="text-sm mr-5">
                            {place.start_time} - {place.end_time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-gray-500">
                  No places available for this day
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
