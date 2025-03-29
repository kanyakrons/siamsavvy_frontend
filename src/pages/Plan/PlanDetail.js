import { useParams } from "react-router-dom";
import {
  checkIfFavorited,
  GetPlanDetail,
  toggleFavorite,
} from "../../api/planApi";
import { useContext, useEffect, useState } from "react";
import { defaultValue } from "./PlanDefaultValue";
import { Hero } from "../Sections";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const PlanDetail = () => {
  const { planId } = useParams();
  const [planDetails, setPlanDetail] = useState(defaultValue);
  const [selectedDay, setSelectedDay] = useState(0);
  const { user, isAuth } = useContext(AuthContext);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const addFavorite = async () => {
    try {
      const response = await toggleFavorite(planId);
      if (response.status === 200 || response.status === 201) {
        setIsFavorited(response.data);
      }
    } catch (error) {
      message.error("Failed to like/unlike place. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetPlanDetail(planId);
      console.log("🚀 ~ fetchData ~ response:", response);
      setPlanDetail({
        name: response.data.name,
        detail: JSON.parse(response.data.detail),
      });

      if (isAuth) {
        const likedData = await checkIfFavorited(planId);
        console.log("🚀 ~ fetchData ~ likedData:", likedData);
        setIsFavorited(likedData.data);
      }
    };

    fetchData();
  }, [planId, isAuth]);

  return (
    <div className="w-full mx-auto h-screen">
      <Hero />
      <div className=" p-5 flex flex-col items-center mt-4">
        <div className="w-full">
          {planDetails.detail && (
            <div className="mx-40">
              <div className="flex">
                {" "}
                <p className="font-semibold text-3xl mb-6">
                  {planDetails.name}
                </p>
                <div className="mt-2 ml-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 hover:shadow-2xl hover:scale-105"
                    onClick={() => {
                      navigate(`/blogs/create?planId=${planId}`);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                    />
                  </svg>
                </div>
                {isAuth && (
                  <div className="mt-2 ml-5">
                    {/* Heart icon */}
                    <svg
                      onClick={addFavorite}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isFavorited ? "red" : "none"}
                      stroke={isFavorited ? "red" : "gray"}
                      className="w-7 h-7 cursor-pointer"
                    >
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  </div>
                )}
              </div>
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
