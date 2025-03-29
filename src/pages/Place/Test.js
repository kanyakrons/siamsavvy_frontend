import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getPlaces, getProvinces, searchPlace } from "../../api/placeApi";
import { getCategories } from "../../api/categoryApi";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  generatePlanByAi,
  CreatePlan,
  GetPlanWithRoute,
} from "../../api/planApi";
import { Link } from "react-router-dom";
import { defaultValue } from "../Plan/PlanDefaultValue";
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
} from "@ant-design/icons";
import Loading from "../../components/Loading";
import SearchValue from "../Place/SearchValue";
import { SearchOutlined } from "@mui/icons-material";

const DragAndDropList = () => {
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
  const ItemTypes = {
    PLACE: "place",
    ITINERARY_PLACE: "itinerary_place",
  };
  const navigate = useNavigate();

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

  const DroppableDay = ({ day, children, isSelected }) => {
    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.PLACE,
      drop: (item) => addPlaceToDay(item.place, day),
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
        <Link to={`/places/${place.place.id}`}>
          <div className="h-[170px] relative">
            <img
              src={
                place.place.image
                  ? place.place.image
                  : "/default-mockup-place.jpg"
              }
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
        </Link>
      </div>
    );
  };

  const addPlaceToDay = (place, day) => {
    setPlanDetails((prevDetails) => {
      const newPlanDetails = JSON.parse(JSON.stringify(prevDetails));

      // Initialize if empty
      if (!newPlanDetails.detail) {
        newPlanDetails.detail = {
          trip: {
            itinerary: Array(day)
              .fill()
              .map((_, i) => ({
                day: i + 1,
                places: [],
              })),
          },
        };
      }

      const dayIndex = day - 1;

      // Ensure day exists
      if (!newPlanDetails.detail.trip.itinerary[dayIndex]) {
        newPlanDetails.detail.trip.itinerary[dayIndex] = {
          day: day,
          places: [],
        };
      }

      const placeToAdd = {
        place_id: place.place.id,
        place_name: place.place.nameEn,
        start_time: "09:00",
        end_time: "12:00",
      };

      // Check for duplicates
      const exists = newPlanDetails.detail.trip.itinerary[dayIndex].places.some(
        (p) => p.place_id === place.place.id
      );

      if (!exists) {
        newPlanDetails.detail.trip.itinerary[dayIndex].places.push(placeToAdd);
        message.success(`Added ${place.place.nameEn} to Day ${day}`);
      } else {
        message.warning(`${place.place.nameEn} is already in Day ${day}`);
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
      start_time: "09:00",
      end_time: "12:00",
    };

    if (!newPlanDetails.detail.trip.itinerary[0].places) {
      newPlanDetails.detail.trip.itinerary[0].places = [];
    }

    newPlanDetails.detail.trip.itinerary[0].places.push(placeToAdd);
    setPlanDetails(newPlanDetails);
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

  const handleSearch = async (newPage) => {
    setLoading(true);
    try {
      // Mapping the selected options to only include values
      const formattedSearchValue = {
        ...searchValue,
        listCategory: searchValue.listCategory,
        listProvince: searchValue.listProvince,
        pageNumber: newPage ? newPage : searchValue.pageNumber,
      };

      const response = await searchPlace(formattedSearchValue);
      setPlaces(response?.data.content);
      setPage(response?.data.number);
      setTotalPage(response?.data.totalPages);
      setLoading(false);
    } catch (error) {
      message.error("Load error");
    }
  };

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-screen mx-auto">
        {/* Full-screen Loading Spinner */}
        <Hero />
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
              onClick={() => setIsPlanning(false)}
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
                        places.map((place, index) => (
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
                {planDetails.detail && (
                  <div>
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
                    <DroppableDay day={selectedDay + 1} isSelected={true}>
                      {planDetails.detail?.trip.itinerary[selectedDay]
                        ?.places ? (
                        <div className="relative">
                          {planDetails.detail?.trip.itinerary[
                            selectedDay
                          ].places.map((place, placeIndex, placesArray) => (
                            <div
                              key={placeIndex}
                              className={`relative flex items-start ${
                                placeIndex !== 0 ? "mt-[50px]" : ""
                              }`}
                            >
                              {/* Vertical Line */}
                              {placeIndex < placesArray.length - 1 && (
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

                              {/* Distance */}
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
                    </DroppableDay>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!isPlanning && (
          <div className="flex flex-col items-center mt-4 px-20 min-h-[70rem]">
            <div className="w-full">
              {planDetails.detail && (
                <div>
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
                    <div className="relative">
                      {planDetails.detail?.trip.itinerary[
                        selectedDay
                      ].places.map((place, placeIndex, placesArray) => (
                        <div
                          key={placeIndex}
                          className={`relative flex items-start ${
                            placeIndex !== 0 ? "mt-[50px]" : ""
                          }`}
                        >
                          {/* Vertical Line */}
                          {placeIndex < placesArray.length - 1 && (
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
                </div>
              )}
            </div>

            <button
              onClick={SavePlan}
              className={`px-4 py-2 mr-2 rounded-xl font-semibold text-white focus:outline-none bg-purple-400 transition duration-300 ease-in-out bg-purple-300 hover:bg-purple-500`}
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

export default DragAndDropList;
