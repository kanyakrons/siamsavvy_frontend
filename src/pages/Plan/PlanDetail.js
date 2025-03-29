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
import { message, Tooltip } from "antd";
import { NodeIndexOutlined, CarOutlined } from "@ant-design/icons";
import MapComponent from "../Sections/MapComponent";

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
              <div className="mx-[200px] mb-[60px]">
                <div className="flex mb-6">
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
                      key={dayPlan.day}
                      onClick={() => {
                        setSelectedDay(parseInt(dayPlan.day) - 1);
                      }}
                      className={`px-4 py-2 mr-2 rounded-xl font-semibold focus:outline-none ${selectedDay === parseInt(dayPlan.day) - 1
                          ? "bg-purple-400 text-white"
                          : "bg-gray-200 text-gray-800"
                        } transition duration-300 ease-in-out ${selectedDay === parseInt(dayPlan.day) - 1
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
                  <div className="relative mb-10">
                    {planDetails.detail?.trip.itinerary[selectedDay].places.map(
                      (place, placeIndex, placesArray) => (
                        <div key={placeIndex} className={`relative flex items-start ${placeIndex !== 0 ? 'mt-[110px]' : ''}`}>
                          {/* Vertical Line */}
                          {placeIndex < placesArray.length - 1 && (
                            <div className="absolute left-5 top-6 bottom-0 w-1 h-[160px] bg-gray-300"></div>
                          )}

                          {/* Place Card */}
                          <div className="flex items-center space-x-4 w-full">
                            {/* Place Icon */}
                            <div className="relative z-10 bg-white p-2 rounded-full border border-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-purple-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                />
                              </svg>
                            </div>

                            {/* Place Details */}
                            <a
                              href={`/places/${place.place_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 p-4 border border-gray-300 rounded-xl bg-white shadow-lg"
                            >
                              <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold">{place.place_name}</p>
                                <p className="text-sm text-gray-600">
                                  {place.start_time} - {place.end_time}
                                </p>
                              </div>
                            </a>
                          </div>

                          {/* Distance & Duration */}
                          {placeIndex < placesArray.length - 1 &&
                            planDetails.detail.trip.itinerary[selectedDay]?.routes[
                            placeIndex
                            ] && (
                              <div className="absolute mt-3 ml-[75px] top-full flex flex-col font-semibold">
                                <div className="flex mb-2">
                                  <NodeIndexOutlined className="text-purple-400 text-2xl me-2" />
                                  <p className="text-sm">{planDetails.detail.trip.itinerary[selectedDay].routes[placeIndex].distance}</p>
                                </div>

                                {planDetails.detail.trip.itinerary[selectedDay].routes[placeIndex].route_options.map((option, index) => (
                                  <Tooltip
                                    title={
                                      <div style={{ maxWidth: "500px", whiteSpace: "normal" }}>
                                        <p className="font-semibold">{option.duration}</p>

                                        {option.type == "DRIVE" ?
                                          <div>
                                            {option.summary}
                                          </div>
                                          :
                                          option.steps ? (
                                            <div>
                                              {option.steps.map((step, index) => (
                                                <div key={index}>{step}</div>
                                              ))}
                                            </div>
                                          ) : <div></div>
                                        }

                                        {option.url && (
                                          <a
                                            href={option.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-400 underline block"
                                          >
                                            View in Google Map
                                          </a>
                                        )}
                                      </div>
                                    }
                                    placement="right"
                                    color={"white"}
                                    overlayInnerStyle={{color: '#000'}}
                                    overlayStyle={{ maxWidth: "500px", whiteSpace: "normal" }}
                                  >
                                    <div className="flex mb-2">
                                      {option.type == "DRIVE" ?
                                        <CarOutlined className="text-purple-400 text-2xl me-2" /> :
                                        <div className="text-purple-400 me-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bus-front-fill" viewBox="0 0 16 16">
                                            <path d="M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.5 2.5 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A44 44 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43 43 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44 44 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994M8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1"/>
                                          </svg>
                                        </div>
                                      }
                                      <p className="text-sm">{option.type == 'DRIVE' ? option.type : option.summary} <span className="text-gray-400">({option.duration})</span></p>
                                    </div>
                                  </Tooltip>
                                ))}
                              </div>
                            )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    No places available for this day
                  </div>
                )}
              
                <MapComponent places={planDetails.detail?.trip.itinerary[selectedDay]?.places}/>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default PlanDetail;
