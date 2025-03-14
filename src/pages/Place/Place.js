import { useEffect, useState } from "react";
import { getPlaces, getProvinces } from "../../api/placeApi";
import { getCategories } from "../../api/categoryApi";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Hero } from "../Sections";

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & filter states
  const [provinces, setProvinces] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placesData = await getPlaces();
        const provincesData = await getProvinces();
        const categoriesData = await getCategories();

        setPlaces(placesData.data);
        setFilteredPlaces(placesData.data);
        setProvinces(provincesData.data);
        setCategories(categoriesData.data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle filtering when inputs change
  useEffect(() => {
    let filtered = places;

    if (searchQuery) {
      filtered = filtered.filter(
        (place) =>
          place.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedProvinces.length > 0) {
      const provinceNames = selectedProvinces.map((p) => p.value);
      filtered = filtered.filter((place) =>
        provinceNames.includes(place.province)
      );
    }

    if (selectedCategories.length > 0) {
      const categoryNames = selectedCategories.map((c) => c.value);
      filtered = filtered.filter((place) =>
        categoryNames.includes(place.category.id)
      );
    }

    setFilteredPlaces(filtered);
  }, [searchQuery, selectedProvinces, selectedCategories, places]);

  return (
    <div className="relative w-full mx-auto h-screen ">
      <Hero />
      {/* Outer container to center the search bar */}
      <div className="flex justify-center items-center w-full mb-7 mt-10">
        {/* Search Bar container */}
        <div className="absolute top-[60%]  flex gap-4 justify-center items-center bg-white rounded-full shadow-lg px-6 py-3 w-full max-w-[750px]">
          {/* Province Multi-Select */}
          <Select
            isMulti
            options={provinces.map((p) => ({ value: p, label: p }))}
            value={selectedProvinces}
            onChange={setSelectedProvinces}
            placeholder="Filter by Province"
            styles={{
              control: (base) => ({
                ...base,
                width: "200px",
                borderRadius: "9999px",
              }),
            }}
          />

          {/* Search by Place Name */}
          <input
            type="text"
            placeholder="Place Name ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px] p-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Category Multi-Select */}
          <Select
            isMulti
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Filter by Category"
            styles={{
              control: (base) => ({
                ...base,
                width: "200px",
                borderRadius: "9999px",
              }),
            }}
          />
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <p>Loading places...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="grid grid-cols-3 gap-5 mx-20">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="w-full h-[335px] relative bg-white rounded-3xl shadow-lg aspect-square overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <Link to={`/places/${place.id}`}>
                  {/* Image Section */}
                  <div className="h-[230px] relative">
                    <img
                      src={
                        place.image ? place.image : "/default-mockup-place.jpg"
                      }
                      alt={place.nameEn}
                      className="w-full h-full object-cover"
                    />
                    {/* Category Box (Top Right) */}
                    <div className="absolute top-3 right-3 bg-purple-400 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      {place.category.name}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="h-[105px] bg-white px-5 py-3">
                    <p className="text-purple-400 font-semibold text-sm mb-1">
                      {place.province}
                    </p>
                    <p className="text-black font-semibold ">{place.nameTh}</p>
                    <p className="text-black">{place.nameEn}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No places found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Place;
