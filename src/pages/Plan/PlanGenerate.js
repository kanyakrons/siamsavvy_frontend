import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getPlaces, getProvinces, searchPlace } from "../../api/placeApi";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { getCategories } from "../../api/categoryApi";
import {
  generatePlanByAi,
  CreatePlan,
  GetPlanWithRoute,
} from "../../api/planApi";
import { Link } from "react-router-dom";
import { defaultValue } from "./PlanDefaultValue";
import { Hero } from "../Sections";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import {
  Tooltip,
  Button,
  Checkbox,
  Form,
  InputNumber,
  Select,
  message,
  Pagination,
  Input,
  Modal,
} from "antd";
import {
  InfoCircleOutlined,
  FieldTimeOutlined,
  NodeIndexOutlined,
  CarOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Loading from "../../components/Loading";
import SearchValue from "../Place/SearchValue";
import { SearchOutlined } from "@mui/icons-material";
import MapComponent from "../Sections/MapComponent";
import { HTML5Backend } from "react-dnd-html5-backend";

const PlanGenerate = () => {
  const googleMapsApiKey = "AIzaSyC5sHKuA6W--94ketB3V89APPJSOvS8okM";
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPlanning, setIsPlanning] = useState(true);
  const [isAiGenerate, setIsAiGenerate] = useState(true);

  const [planName, setPlanName] = useState("");
  const [planDetails, setPlanDetails] = useState(defaultValue);

  //ai generate
  const [categoriesCriteria, setCategoriesCriteria] = useState([]);
  const [provincesCriteria, setProvincesCriteria] = useState([]);

  const [isSpecifyLocation, setIsSpecifyLocation] = useState(false);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(null);
  const autocompleteRef = useRef(null);
  const [searchMapQuery, setSearchMapQuery] = useState("");

  const [selectedDaysCriteria, setSelectedDaysCriteria] = useState(0);
  const [selectedCategoriesCriteria, setSelectedCategoriesCriteria] = useState(
    []
  );
  const [selectedProvincesCriteria, setSelectedProvincesCriteria] =
    useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const [selectedDistance, setSelectedDistance] = useState(0);

  //ai generate - plan detail
  const [selectedDay, setSelectedDay] = useState(0);

  //plan be your self
  // State for modal visibility
  const [isErrModalOpen, setIsErrModalOpen] = useState(false);
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [searchValue, setSearchValue] = useState(SearchValue);
  const navigate = useNavigate();

  const ItemTypes = {
    PLACE: "place",
    ITINERARY_PLACE: "itinerary_place",
  };

  const SavePlan = async () => {
    setLoading(true);
    try {
      const response = await CreatePlan(planDetails);
      navigate(`/plans/${response.data?.id}`);
    } catch (err) {
      console.error("Error saving plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (newPage) => {
    setLoading(true);
    try {
      // Mapping the selected options to only include values
      const formattedSearchValue = {
        ...searchValue,
        listCategory: searchValue.listCategory,
        listProvince: searchValue.listProvince,
        pageSize: 4,
        pageNumber: newPage ? newPage : searchValue.pageNumber,
      };

      const response = await searchPlace(formattedSearchValue);
      setPlaces(response?.data.content);
      setPage(response?.data.number);
      setTotalPage(response?.data.totalElements);
      setLoading(false);
    } catch (error) {
      message.error("Load error");
    }
  };

  const DroppableDay = ({ day, children, isSelected }) => {
    const [{ isOver }, drop] = useDrop({
      accept: [ItemTypes.PLACE, ItemTypes.ITINERARY_PLACE],
      drop: (item, monitor) => {
        if (monitor.getItemType() === ItemTypes.PLACE) {
          addPlaceToDay(item.place, day);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        style={{
          backgroundColor: isOver ? "rgba(233, 213, 255, 0.5)" : "transparent",
          padding: "8px",
          borderRadius: "8px",
          minHeight: isSelected ? "400px" : "auto", // Only show drop zone for selected day
        }}
      >
        {children}
        {isSelected && isOver && (
          <div className="mt-4 p-4 border-2 border-dashed border-purple-400 rounded-lg text-center">
            Drop here to add to Day {day}
          </div>
        )}
      </div>
    );
  };

  const DraggablePlace = ({ place }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.PLACE,
      item: { place },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
        }}
        className="w-full h-[250px] relative bg-white rounded-3xl shadow-lg aspect-square overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
      >
        <a
          href={`/places/${place.place.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="h-[170px] relative">
            <img
              src={place.image ? place.image : "/default-mockup-place.jpg"}
              alt={place.place.nameEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-purple-400 text-white text-xs font-semibold px-4 py-1 rounded-full overflow-hidden text-ellipsis whitespace-nowrap">
              {place.place.category.name}
            </div>
          </div>
          <div className="h-[80px] bg-white px-5 py-2">
            <p className="text-purple-400 font-semibold text-xs mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {place.place.province}
            </p>
            <p className="text-black font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {place.place.nameTh}
            </p>
            <p className="text-black text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {place.place.nameEn}
            </p>
          </div>
        </a>
      </div>
    );
  };

  const addPlaceToDay = (place, day) => {
    setPlanDetails((prevDetails) => {
      const newPlanDetails = JSON.parse(JSON.stringify(prevDetails));

      const dayIndex = day - 1;
      const placeToAdd = {
        place_id: place.place.id,
        place_name: place.place.nameTh,
        location: place.place.location,
        start_time: "00:00",
        end_time: "00:00",
      };

      // Check for duplicates
      const exists = newPlanDetails.detail.trip.itinerary[dayIndex].places.some(
        (p) => p.place_id === place.place.id
      );

      if (!exists) {
        newPlanDetails.detail.trip.itinerary[dayIndex].places.push(placeToAdd);

        // Calculate distances for all places in this day
        if (newPlanDetails.detail.trip.itinerary[dayIndex].places.length > 1) {
          if (!newPlanDetails.detail.trip.itinerary[dayIndex].routes) {
            newPlanDetails.detail.trip.itinerary[dayIndex].routes = [];
          }

          const places = newPlanDetails.detail.trip.itinerary[dayIndex].places;
          for (let i = 0; i < places.length - 1; i++) {
            const distance = calculateDistance(
              places[i].location,
              places[i + 1].location
            );
            if (!newPlanDetails.detail.trip.itinerary[dayIndex].routes[i]) {
              newPlanDetails.detail.trip.itinerary[dayIndex].routes[i] = {
                distance: distance,
                route_options: [],
              };
            } else {
              newPlanDetails.detail.trip.itinerary[dayIndex].routes[
                i
              ].distance = distance;
            }
          }
        }

        message.success(`Added ${place.place.nameTh} to Day ${day}`);
      } else {
        message.warning(`${place.place.nameTh} is already in Day ${day}`);
      }

      return newPlanDetails;
    });
  };

  const addToPlanDetails = (place) => {
    if (!planDetails.detail) {
      // Initialize planDetails if empty
      setPlanDetails({
        name: planName,
        detail: {
          trip: {
            itinerary: [
              {
                day: 1,
                places: [],
              },
            ],
          },
        },
      });
    }
    const newPlanDetails = { ...planDetails };
    const placeToAdd = {
      place_id: place.place.id,
      place_name: place.place.nameTh,
      location: place.place.location,
      start_time: "00:00",
      end_time: "00:00",
    };

    if (!newPlanDetails.detail.trip.itinerary[0].places) {
      newPlanDetails.detail.trip.itinerary[0].places = [];
    }

    newPlanDetails.detail.trip.itinerary[0].places.push(placeToAdd);
    setPlanDetails(newPlanDetails);
  };

  const DraggableItineraryPlace = ({
    place,
    index,
    dayIndex,
    movePlace,
    placesArray,
  }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.ITINERARY_PLACE,
      item: { index, dayIndex },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: ItemTypes.ITINERARY_PLACE,
      hover(item, monitor) {
        if (!ref.current) return;
        if (item.dayIndex !== dayIndex) return; // Only allow sorting within same day

        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        movePlace(dragIndex, hoverIndex, dayIndex);
        item.index = hoverIndex;
      },
    });

    drag(drop(ref));

    const handleTimeChange = (field, value) => {
      setPlanDetails((prevDetails) => {
        const newDetails = JSON.parse(JSON.stringify(prevDetails));
        newDetails.detail.trip.itinerary[dayIndex].places[index][field] = value;
        return newDetails;
      });
    };

    return (
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0.5 : 1,
        }}
        className={`relative flex items-start ${
          index !== 0 ? "mt-[50px]" : ""
        }`}
      >
        {/* Your existing place card JSX */}
        {/* Vertical Line */}
        {index < placesArray.length - 1 && (
          <div className="absolute left-5 top-6 bottom-0 w-1 h-[130px] bg-gray-300"></div>
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
          <div className="flex-1 p-4 border border-gray-300 rounded-xl bg-white shadow-lg">
            <div className="flex justify-between items-center">
              <a
                href={`/places/${place.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold"
              >
                <p>{place.place_name}</p>
              </a>

              <div className="flex items-center space-x-2">
                <TimeInput
                  value={place.start_time}
                  onChange={(value) => handleTimeChange("start_time", value)}
                />
                <span className="font-semibold">to</span>
                <TimeInput
                  value={place.end_time}
                  onChange={(value) => handleTimeChange("end_time", value)}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePlaceFromDay(dayIndex, index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {index < placesArray.length - 1 &&
          planDetails.detail.trip.itinerary[selectedDay]?.routes[index] && (
            <div className="absolute mt-3 ml-[75px] top-full flex flex-col font-semibold">
              <div className="flex mb-2">
                <NodeIndexOutlined className="text-purple-400 text-2xl me-2" />
                <p className="text-sm">
                  {
                    planDetails.detail.trip.itinerary[selectedDay].routes[index]
                      .distance
                  }
                </p>
              </div>
            </div>
          )}
      </div>
    );
  };

  // Add this utility function somewhere in your file (or in a separate utils file)
  function calculateDistance(location1, location2) {
    // Parse the location strings
    const [lat1, lon1] = location1
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    const [lat2, lon2] = location2
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    // Haversine formula to calculate distance in km
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(2) + " km";
  }

  const movePlace = (dragIndex, hoverIndex, dayIndex) => {
    setPlanDetails((prevDetails) => {
      const newPlanDetails = JSON.parse(JSON.stringify(prevDetails));
      const places = [...newPlanDetails.detail.trip.itinerary[dayIndex].places];
      const [removed] = places.splice(dragIndex, 1);

      // Reset times when moving
      removed.start_time = "00:00";
      removed.end_time = "00:00";

      places.splice(hoverIndex, 0, removed);
      newPlanDetails.detail.trip.itinerary[dayIndex].places = places;

      // Recalculate all distances for this day
      if (places.length > 1) {
        newPlanDetails.detail.trip.itinerary[dayIndex].routes = [];
        for (let i = 0; i < places.length - 1; i++) {
          const distance = calculateDistance(
            places[i].location,
            places[i + 1].location
          );
          newPlanDetails.detail.trip.itinerary[dayIndex].routes[i] = {
            distance: distance,
            route_options: [],
          };
        }
      }

      return newPlanDetails;
    });
  };

  const removePlaceFromDay = (dayIndex, placeIndex) => {
    setPlanDetails((prevDetails) => {
      const newDetails = JSON.parse(JSON.stringify(prevDetails));

      // Remove the place at the specified index
      newDetails.detail.trip.itinerary[dayIndex].places.splice(placeIndex, 1);

      // If there was a route at this index, remove it too
      if (newDetails.detail.trip.itinerary[dayIndex].routes) {
        newDetails.detail.trip.itinerary[dayIndex].routes.splice(placeIndex, 1);
      }

      // Recalculate distances for remaining places
      const places = newDetails.detail.trip.itinerary[dayIndex].places;
      if (places.length > 1) {
        newDetails.detail.trip.itinerary[dayIndex].routes = [];
        for (let i = 0; i < places.length - 1; i++) {
          const distance = calculateDistance(
            places[i].location,
            places[i + 1].location
          );
          newDetails.detail.trip.itinerary[dayIndex].routes[i] = {
            distance: distance,
            route_options: [],
          };
        }
      } else if (places.length <= 1) {
        // If only 1 or 0 places left, clear all routes
        newDetails.detail.trip.itinerary[dayIndex].routes = [];
      }

      return newDetails;
    });
  };

  <DndProvider backend={HTML5Backend}>
    <div className="grid grid-cols-2 gap-4 mt-10 my-5">
      {places.length > 0 ? (
        places.map((place, index) => (
          <div key={place.place.id} onClick={() => addToPlanDetails(place)}>
            <DraggablePlace key={place.place.id} place={place} />
          </div>
        ))
      ) : (
        <p>No places found.</p>
      )}
    </div>
  </DndProvider>;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provincesData = await getProvinces();
        const categoriesData = await getCategories();
        setProvinces(provincesData.data);
        setCategories(categoriesData.data);
        setProvincesCriteria(provincesData.data);
        setCategoriesCriteria(categoriesData.data);
        handleSearch();

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setSelectedLocation({ lat: latitude, lng: longitude });
              setCenter({ lat: latitude, lng: longitude });
            },
            (error) => {
              console.error(error);
            }
          );
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //get plan generated by AI
  const AiGenerate = async () => {
    // Set loading to true before the request
    setLoading(true);

    try {
      const categoryLabels = categoriesCriteria
        .filter((c) => selectedCategoriesCriteria.includes(c.id))
        .map((c) => c.name)
        .join(", ");
      const formattedLocation =
        selectedPlaceName +
        " (" +
        selectedLocation.lat +
        ", " +
        selectedLocation.lng +
        ")";

      const response = await generatePlanByAi(
        selectedDaysCriteria,
        categoryLabels,
        selectedProvincesCriteria,
        isSpecifyLocation ? formattedLocation : null,
        isSpecifyLocation ? selectedDistance : null
      );

      const data = {
        name: planName,
        detail: response.data,
      };
      setPlanDetails(data);
    } catch (error) {
      console.error("Error generating plan:", error);
      showErrorModal();
    } finally {
      setLoading(false);
    }
  };

  const handleMapSearch = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const { location } = place.geometry;
        setSelectedLocation({ lat: location.lat(), lng: location.lng() });
        setCenter({ lat: location.lat(), lng: location.lng() });
      }

      // Update the search input with the place's name
      setSearchMapQuery(place.name);
      setSelectedPlaceName(place.name);
    }
  };

  const handleMapClick = (e) => {
    // Clear the search input
    setSearchMapQuery("");

    //get pin location
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelectedLocation({ lat, lng });

    // Reverse Geocoding to get the place name
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const placeName = results[0].formatted_address;
          setSelectedPlaceName(placeName);
        }
      }
    });
  };

  // Function to show modal
  const showErrorModal = () => {
    setIsErrModalOpen(true);
  };

  // Function to close modal
  const handleCloseErrModal = () => {
    setIsErrModalOpen(false);
  };

  // Error modal component
  const ErrorModal = () => (
    <Modal
      title={
        <span className="text-2xl font-bold text-black">
          Something Went Wrong
        </span>
      }
      open={isErrModalOpen}
      onCancel={handleCloseErrModal}
      footer={[
        <Button
          key="close"
          type="primary"
          className="bg-purple-400"
          onClick={handleCloseErrModal}
        >
          Close
        </Button>,
      ]}
      centered
    >
      <p className="text-black text-base">
        We encountered an issue while generating your travel plan. Please try
        again later.
      </p>
    </Modal>
  );

  // get place detail with route
  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        setLoading(true);

        if (!isPlanning) {
          const response = await GetPlanWithRoute(planDetails);

          const data = {
            name: planName,
            detail: response.data,
          };
          setPlanDetails(data);
        }
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [isPlanning]);

  const validateTimeFormat = (timeStr) => {
    if (!timeStr) return false;
    const timeRegex = /^([01]?[0-9]|2[0-3])\.[0-5][0-9]$/;
    return timeRegex.test(timeStr);
  };

  const validateTimePeriod = (startTime, endTime) => {
    if (!validateTimeFormat(startTime)) return false;
    if (!validateTimeFormat(endTime)) return false;

    const [startHours, startMins] = startTime.split(".").map(Number);
    const [endHours, endMins] = endTime.split(".").map(Number);

    if (startHours > endHours) return false;
    if (startHours === endHours && startMins >= endMins) return false;

    return true;
  };

  const validatePlanBeforeSummary = () => {
    if (!planDetails.detail || !planDetails.detail.trip.itinerary.length) {
      message.error("Please add at least one place to your plan");
      return false;
    }

    // Check each day's itinerary
    for (const dayPlan of planDetails.detail.trip.itinerary) {
      if (!dayPlan.places || dayPlan.places.length === 0) {
        message.error(`Day ${dayPlan.day} has no places`);
        return false;
      }

      // Check times for each place in the day
      for (let i = 0; i < dayPlan.places.length; i++) {
        const place = dayPlan.places[i];

        // Check for unset times
        if (place.start_time === "00:00" && place.end_time === "00:00") {
          message.error(
            `Please set times for ${place.place_name} in Day ${dayPlan.day}`
          );
          return false;
        }

        // Validate time format
        if (!validateTimeFormat(place.start_time.replace(":", "."))) {
          message.error(
            `Invalid start time format for ${place.place_name} (use HH.MM format)`
          );
          return false;
        }
        if (!validateTimeFormat(place.end_time.replace(":", "."))) {
          message.error(
            `Invalid end time format for ${place.place_name} (use HH.MM format)`
          );
          return false;
        }

        // Validate time period
        if (
          !validateTimePeriod(
            place.start_time.replace(":", "."),
            place.end_time.replace(":", ".")
          )
        ) {
          message.error(
            `Invalid time period for ${place.place_name} (end time must be after start time)`
          );
          return false;
        }

        // Check sequence with next place
        if (i < dayPlan.places.length - 1) {
          const nextPlace = dayPlan.places[i + 1];
          const currentEnd = place.end_time.replace(":", ".");
          const nextStart = nextPlace.start_time.replace(":", ".");

          if (!validateTimePeriod(currentEnd, nextStart)) {
            message.error(
              `Time sequence error between ${place.place_name} and ${nextPlace.place_name}`
            );
            return false;
          }
        }
      }
    }

    return true;
  };

  const TimeInput = ({ value, onChange }) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e) => {
      const newValue = e.target.value;
      setInternalValue(newValue);

      // Basic length check while typing
      if (newValue.length > 5) return;

      // Allow partial input (like "1" or "12:")
      setIsValid(true);
    };

    const handleBlur = () => {
      // Validate full time format on blur
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      const isValidTime = timeRegex.test(internalValue);

      if (isValidTime) {
        onChange(internalValue);
      } else {
        // Revert to last valid value if invalid
        setInternalValue(value);
      }
      setIsValid(isValidTime);
    };

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    return (
      <Input
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="HH:MM"
        className={`w-20 ${!isValid ? "border-red-500" : ""}`}
        maxLength={5}
      />
    );
  };

  const addNewDay = () => {
    setPlanDetails((prevDetails) => {
      const newDetails = prevDetails.detail
        ? JSON.parse(JSON.stringify(prevDetails))
        : {
            name: planName,
            detail: {
              trip: {
                itinerary: [],
              },
            },
          };

      const newDayNumber = newDetails.detail.trip.itinerary.length + 1;

      newDetails.detail.trip.itinerary.push({
        day: newDayNumber,
        places: [],
        routes: [],
      });

      newDetails.detail.trip.duration = newDayNumber;

      if (newDayNumber === 1) {
        setSelectedDay(0);
      }

      return newDetails;
    });
  };

  const deleteDay = (dayIndex) => {
    if (planDetails.detail?.trip.itinerary.length <= 1) {
      message.warning("You must have at least one day in your plan");
      return;
    }

    setPlanDetails((prevDetails) => {
      const newDetails = JSON.parse(JSON.stringify(prevDetails));
      newDetails.detail.trip.itinerary.splice(dayIndex, 1);

      // Re-number the remaining days
      newDetails.detail.trip.itinerary.forEach((day, index) => {
        day.day = index + 1;
      });

      // If we deleted the currently selected day, select the previous day
      if (selectedDay >= dayIndex) {
        setSelectedDay(Math.max(0, selectedDay - 1));
      }

      return newDetails;
    });
  };

  const renderDayTabs = () => (
    <div className="flex items-center mb-4">
      <div className="flex overflow-x-auto">
        {planDetails.detail?.trip.itinerary?.map((dayPlan, index) => (
          <div key={dayPlan.day} className="flex items-center mr-2">
            <button
              onClick={() => {
                setSelectedDay(index);
              }}
              className={`flex px-4 py-2 rounded-xl font-semibold focus:outline-none ${
                selectedDay === index
                  ? "bg-purple-400 text-white"
                  : "bg-gray-200 text-gray-800"
              } transition duration-300 ease-in-out ${
                selectedDay === index
                  ? "hover:bg-purple-500"
                  : "hover:bg-gray-300"
              }`}
            >
              <p className="me-1">{`Day ${dayPlan.day}`}</p>

              <button
                onClick={() => deleteDay(index)}
                className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <CloseOutlined />
              </button>
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addNewDay}
        className="ml-2 px-3 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-950 transition-colors flex items-center"
      >
        <PlusOutlined className="me-2" /> Add Day
      </button>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-screen mx-auto">
        {/* Full-screen Loading Spinner */}
        <Hero title={"Plan Your Trip"} />
        {loading && <Loading loading={loading}></Loading>}
        {/* toggle plan / summary */}
        <div className="flex flex-col items-center mt-10">
          <div className="flex w-60 bg-gray-200 rounded-xl p-1">
            <button
              className={`w-1/2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isPlanning
                  ? "bg-white font-semibold shadow-md"
                  : "text-gray-700"
              }`}
              onClick={() => setIsPlanning(true)}
            >
              Plan
            </button>
            <button
              className={`w-1/2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                !isPlanning
                  ? "bg-white font-semibold shadow-md"
                  : "text-gray-700"
              }`}
              onClick={() => {
                if (validatePlanBeforeSummary()) {
                  setIsPlanning(false);
                }
              }}
            >
              Summary
            </button>
          </div>
        </div>
        {isPlanning && (
          <div className="px-20 min-h-[70rem]">
            <div className="mt-8">
              <input
                type="text"
                placeholder="Plan Name ..."
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="mb-1 w-1/2 px-3 py-2 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-xl font-semibold"
              />
              <p className="text-gray-400 text-sm">
                {(() => {
                  const date = new Date();
                  const options = {
                    weekday: "short",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  };
                  const formattedDate = date
                    .toLocaleDateString("en-US", options)
                    .split(" ");
                  return `${formattedDate[0]} ${formattedDate[2].replace(
                    ",",
                    ""
                  )} ${formattedDate[1]} ${formattedDate[3]}`;
                })()}
              </p>
            </div>

            <div className="flex mt-4 gap-x-16">
              <div className="w-1/2 flex flex-col items-center">
                <div className="flex w-80 mb-4">
                  <button
                    className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                      isAiGenerate ? "bg-gray-300" : "bg-white"
                    }`}
                    onClick={() => setIsAiGenerate(true)}
                  >
                    Auto-generate plan
                  </button>
                  <button
                    className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                      !isAiGenerate ? "bg-gray-300" : "bg-white"
                    }`}
                    onClick={() => setIsAiGenerate(false)}
                  >
                    Plan trip by yourself
                  </button>
                </div>

                {isAiGenerate && (
                  <Form
                    form={form}
                    name="planGenRequest"
                    onFinish={AiGenerate}
                    layout="vertical"
                    className="w-full"
                  >
                    <Form.Item
                      name="Days"
                      label="Days"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (value === undefined || value === null) {
                              return Promise.reject(
                                new Error("Days is required")
                              );
                            }
                            if (!Number.isInteger(value)) {
                              return Promise.reject(
                                new Error("Days must be an integer")
                              );
                            }
                            if (value <= 0) {
                              return Promise.reject(
                                new Error("Days must be greater than 0")
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        onChange={(value) => {
                          if (value && Number.isInteger(value) && value > 0) {
                            setSelectedDaysCriteria(value);
                          }
                        }}
                        className="w-full h-[35px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="Category"
                      label="Category"
                      rules={[
                        {
                          required: true,
                          message: "Please select at least one category",
                          type: "array",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.label
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        mode="multiple"
                        options={categoriesCriteria.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        value={selectedCategoriesCriteria}
                        onChange={(values) => {
                          setSelectedCategoriesCriteria(values);
                        }}
                        placeholder="Select Categories"
                        className="h-[35px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="Province"
                      label="Province"
                      rules={[
                        {
                          required: true,
                          message: "Please select a province",
                        },
                      ]}
                    >
                      <Select
                        options={provincesCriteria.map((p) => ({
                          value: p,
                          label: p,
                        }))}
                        showSearch
                        value={selectedProvincesCriteria}
                        onChange={(value) => {
                          setSelectedProvincesCriteria(value);
                        }}
                        placeholder="Select a province"
                        className="h-[35px]"
                      />
                    </Form.Item>
                    <div className="flex cursor-pointer mt-8 mb-2">
                      <Checkbox
                        checked={isSpecifyLocation}
                        onChange={() =>
                          setIsSpecifyLocation(!isSpecifyLocation)
                        }
                        className="me-3"
                      />
                      <span>Specify Location</span>
                      <Tooltip
                        title="The selected start location and max distance might not work perfectly"
                        className="ms-2"
                      >
                        <InfoCircleOutlined
                          style={{ fontSize: "16px" }}
                          className="text-gray-400"
                        />
                      </Tooltip>
                    </div>
                    {isSpecifyLocation && (
                      <div>
                        <Form.Item name="Location" label="Start Location">
                          <LoadScript
                            googleMapsApiKey={googleMapsApiKey}
                            libraries={["places"]}
                          >
                            <GoogleMap
                              center={center}
                              zoom={14}
                              mapContainerStyle={{
                                width: "100%",
                                height: "350px",
                              }}
                              onLoad={(map) => setMap(map)}
                              onClick={handleMapClick}
                            >
                              <Autocomplete
                                onLoad={(autocomplete) =>
                                  (autocompleteRef.current = autocomplete)
                                }
                                onPlaceChanged={handleMapSearch}
                              >
                                <input
                                  type="text"
                                  placeholder="Search for a location"
                                  value={searchMapQuery}
                                  onChange={(e) =>
                                    setSearchMapQuery(e.target.value)
                                  }
                                  style={{
                                    position: "absolute",
                                    top: "10px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "250px",
                                    padding: "8px",
                                  }}
                                />
                              </Autocomplete>

                              {selectedLocation && (
                                <Marker position={selectedLocation} />
                              )}
                            </GoogleMap>
                          </LoadScript>
                        </Form.Item>
                        <Form.Item
                          name="distance"
                          label="Distance (km)"
                          rules={[
                            {
                              validator: (_, value) => {
                                if (value === undefined || value === null) {
                                  return Promise.reject(
                                    new Error("Please enter a distance")
                                  );
                                }
                                if (isNaN(value)) {
                                  return Promise.reject(
                                    new Error("Distance must be a valid number")
                                  );
                                }
                                if (value <= 0) {
                                  return Promise.reject(
                                    new Error("Distance must be greater than 0")
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            value={selectedDistance}
                            onChange={(value) => setSelectedDistance(value)}
                            min={0.01}
                            step={0.01}
                            className="w-full h-[35px]"
                          />
                        </Form.Item>
                      </div>
                    )}
                    <Form.Item>
                      <div className="flex justify-center">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="w-40 h-10 bg-purple-400 text-white rounded-xl py-2 hover:bg-purple-500 hover:shadow-lg transition duration-300 ease-in-out"
                        >
                          Generate
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                )}

                {!isAiGenerate && (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-[400px] p-5 border-2 border-purple-400 rounded-xl">
                      <p className="font-semibold mb-3">Filter places:</p>
                      <Input
                        type="text"
                        placeholder="Place Name ..."
                        value={searchValue.placeTitle}
                        onChange={(e) =>
                          setSearchValue({
                            ...searchValue,
                            placeTitle: e.target.value,
                          })
                        }
                        className="mb-3 w-full h-[35px] p-2 border-1 rounded-lg hover:border-purple-400 focus:border-purple-400"
                      />
                      <Select
                        mode="multiple"
                        options={categories.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }))}
                        value={searchValue.listCategory}
                        onChange={(selectedValue) => {
                          setSearchValue({
                            ...searchValue,
                            listCategory: selectedValue,
                          });
                        }}
                        placeholder="Filter by Category"
                        className="mb-3 w-full h-[35px]"
                        bordered="false"
                      />
                      <Select
                        mode="multiple"
                        options={provinces.map((p) => ({ value: p, label: p }))}
                        value={searchValue.listProvince}
                        onChange={(selectedValue) => {
                          setSearchValue({
                            ...searchValue,
                            listProvince: selectedValue,
                          });
                        }}
                        className="w-full h-[35px] mb-3"
                        placeholder="Filter by Province"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "0.75rem",
                          }),
                          width: "100%",
                        }}
                      />
                      <div className="w-full flex justify-center">
                        <button
                          className="bg-purple-600 text-white rounded-full "
                          style={{
                            width: "50px",
                            height: "35px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => handleSearch()}
                        >
                          <SearchOutlined />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-10 my-5">
                      {places.length > 0 ? (
                        places.map((place) => (
                          <div
                            key={place.place.id}
                            onClick={() => addToPlanDetails(place)}
                          >
                            <DraggablePlace
                              key={place.place.id}
                              place={place}
                            />
                          </div>
                        ))
                      ) : (
                        <p>No places found.</p>
                      )}
                    </div>
                    <Pagination
                      align="center"
                      defaultCurrent={page}
                      total={totalPage}
                      showSizeChanger={false}
                      onChange={(newPage) => {
                        handleSearch(newPage);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="w-1/2">
                {planDetails.detail && <div>{renderDayTabs()}</div>}

                <div>
                  {/* Show empty state if no days exist yet */}
                  {!planDetails.detail ||
                  !planDetails.detail.trip.itinerary ||
                  planDetails.detail.trip.itinerary.length == 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 mb-4">
                        No days in your plan yet
                      </p>
                      <button
                        onClick={addNewDay}
                        className="px-4 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500"
                      >
                        Add Your First Day
                      </button>
                    </div>
                  ) : (
                    <DroppableDay day={selectedDay + 1} isSelected={true}>
                      {planDetails.detail?.trip.itinerary[selectedDay]?.places
                        .length > 0 ? (
                        <div className="relative">
                          {planDetails.detail?.trip.itinerary[
                            selectedDay
                          ].places.map((place, placeIndex, placesArray) => (
                            <DraggableItineraryPlace
                              key={place.place_id}
                              place={place}
                              placesArray={placesArray}
                              index={placeIndex}
                              dayIndex={selectedDay}
                              movePlace={movePlace}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500 mb-4">
                              No places for this day
                            </p>
                            <button className="px-4 py-2 bg-gray-300 text-white rounded-lg">
                              Drag and drop your first place
                            </button>
                          </div>
                        </div>
                      )}
                    </DroppableDay>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {!isPlanning && (
          <div className="flex flex-col items-center my-4 px-20 min-h-[70rem]">
            <div className="w-full">
              {planDetails.detail && (
                <div className="mx-[200px]">
                  <p className="font-bold text-3xl mb-5">{planDetails.name}</p>

                  {/* Day Tabs */}
                  <div className="flex overflow-x-auto mb-4">
                    {planDetails.detail?.trip.itinerary.map((dayPlan) => (
                      <button
                        key={dayPlan.day}
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
                    <div className="relative mb-10">
                      {planDetails.detail?.trip.itinerary[
                        selectedDay
                      ].places.map((place, placeIndex, placesArray) => (
                        <div
                          key={placeIndex}
                          className={`relative flex items-start ${
                            placeIndex !== 0 ? "mt-[110px]" : ""
                          }`}
                        >
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
                                <p className="text-lg font-semibold">
                                  {place.place_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {place.start_time} - {place.end_time}
                                </p>
                              </div>
                            </a>
                          </div>

                          {/* Distance & Duration */}
                          {placeIndex < placesArray.length - 1 &&
                            planDetails.detail.trip.itinerary[selectedDay]
                              ?.routes[placeIndex] && (
                              <div className="absolute mt-3 ml-[75px] top-full flex flex-col font-semibold">
                                <div className="flex mb-2">
                                  <NodeIndexOutlined className="text-purple-400 text-2xl me-2" />
                                  <p className="text-sm">
                                    {
                                      planDetails.detail.trip.itinerary[
                                        selectedDay
                                      ].routes[placeIndex].distance
                                    }
                                  </p>
                                </div>

                                {planDetails.detail.trip.itinerary[
                                  selectedDay
                                ].routes[placeIndex].route_options.map(
                                  (option, index) => (
                                    <Tooltip
                                      title={
                                        <div
                                          style={{
                                            maxWidth: "500px",
                                            whiteSpace: "normal",
                                          }}
                                        >
                                          <p className="font-semibold">
                                            {option.duration}
                                          </p>

                                          {option.type == "DRIVE" ? (
                                            <div>{option.summary}</div>
                                          ) : option.steps ? (
                                            <div>
                                              {option.steps.map(
                                                (step, index) => (
                                                  <div key={index}>{step}</div>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <div></div>
                                          )}

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
                                      overlayInnerStyle={{ color: "#000" }}
                                      overlayStyle={{
                                        maxWidth: "500px",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      <div className="flex mb-2">
                                        {option.type == "DRIVE" ? (
                                          <CarOutlined className="text-purple-400 text-2xl me-2" />
                                        ) : (
                                          <div className="text-purple-400 me-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="22"
                                              height="22"
                                              fill="currentColor"
                                              class="bi bi-bus-front-fill"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.5 2.5 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A44 44 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43 43 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44 44 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994M8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1" />
                                            </svg>
                                          </div>
                                        )}
                                        <p className="text-sm">
                                          {option.type == "DRIVE"
                                            ? option.type
                                            : option.summary}{" "}
                                          <span className="text-gray-400">
                                            ({option.duration})
                                          </span>
                                        </p>
                                      </div>
                                    </Tooltip>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      No places available for this day
                    </div>
                  )}

                  <MapComponent
                    places={
                      planDetails.detail?.trip.itinerary[selectedDay]?.places
                    }
                  />
                </div>
              )}
            </div>

            <button
              onClick={SavePlan}
              className={`px-4 py-2 mt-8 mr-2 rounded-xl font-semibold text-white focus:outline-none bg-purple-400 transition duration-300 ease-in-out bg-purple-300 hover:bg-purple-500`}
            >
              Save
            </button>
          </div>
        )}
        <ErrorModal />;
      </div>
    </DndProvider>
  );
};

export default PlanGenerate;
