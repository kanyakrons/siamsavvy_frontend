import { useEffect, useState } from "react";
import { getPlaces, getProvinces, searchPlace } from "../../api/placeApi";
import { getCategories } from "../../api/categoryApi";
import Select from "react-select";
import { Link, useSearchParams } from "react-router-dom";
import { Hero } from "../Sections";
import SearchValue from "./SearchValue";
import { message, Pagination } from "antd";
import Loading from "../../components/Loading";

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState({
    placeTitle: searchParams.get("placeTitle") || "",
    listCategory: searchParams
      .getAll("listCategory")
      .map((c) => ({ value: c, label: c })),
    listProvince: searchParams
      .getAll("listProvince")
      .map((p) => ({ value: p, label: p })),
    pageNumber: searchParams.get("pageNumber") || 0,
    pageSize: 12,
  });

  // Search & filter states
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleSearch = async (newPage) => {
    console.log("🚀 ~ handleSearch ~ number:", newPage);
    setLoading(true);
    try {
      // Mapping the selected options to only include values
      const formattedSearchValue = {
        ...searchValue,
        listCategory: searchValue.listCategory?.map((option) => option.value),
        listProvince: searchValue.listProvince?.map((option) => option.value),
        pageNumber: newPage ? newPage : searchValue.pageNumber,
      };

      setSearchParams({
        placeTitle: formattedSearchValue.placeTitle,
        listCategory: formattedSearchValue.listCategory,
        listProvince: formattedSearchValue.listProvince,
        pageNumber: formattedSearchValue.pageNumber,
      });

      const response = await searchPlace(formattedSearchValue);
      setPlaces(response?.data.content);
      setPage(response?.data.number);
      setTotalPage(response?.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      message.error("Load error");
    }
  };

  const handlePaginate = () => {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const provincesData = await getProvinces();
        const categoriesData = await getCategories();
        handleSearch();
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

  return (
    <div className="relative w-full mx-auto h-screen ">
      {loading && (
        <Loading loading={loading}></Loading>
      )}

      <Hero />
      {/* Outer container to center the search bar */}
      <div className="flex justify-center items-center w-full mb-7">
        {/* Search Bar container */}
        <div className="absolute flex gap-4 justify-center items-center bg-white rounded-full shadow-lg px-6 py-3 w-full max-w-[750px]">
          {/* Province Multi-Select */}
          <Select
            isMulti
            options={provinces.map((p) => ({ value: p, label: p }))}
            onChange={(selectedOption) => {
              setSearchValue({ ...searchValue, listProvince: selectedOption });
            }}
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
            onChange={(e) =>
              setSearchValue({ ...searchValue, placeTitle: e.target.value })
            }
            className="w-[200px] p-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Category Multi-Select */}
          <Select
            isMulti
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            onChange={(selectedOption) => {
              setSearchValue({ ...searchValue, listCategory: selectedOption });
            }}
            placeholder="Filter by Category"
            styles={{
              control: (base) => ({
                ...base,
                width: "200px",
                borderRadius: "9999px",
              }),
            }}
          />
          <button
            className="p-2 bg-purple-600 text-white rounded-full"
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>
      </div>

          <div className="grid grid-cols-3 gap-5 mx-20 mt-20 mb-5">
            {places.length > 0 ? (
              places.map((place) => (
                <div
                  key={place.id}
                  className="w-full h-[335px] relative bg-white rounded-3xl shadow-lg aspect-square overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <Link to={`/places/${place.id}`}>
                    {/* Image Section */}
                    <div className="h-[230px] relative">
                      <img
                        src={
                          place.image
                            ? place.image
                            : "/default-mockup-place.jpg"
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
                      <p className="text-black font-semibold ">
                        {place.nameTh}
                      </p>
                      <p className="text-black">{place.nameEn}</p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No places found.</p>
            )}
          </div>
          <div className="">
            <Pagination
              align="center"
              defaultCurrent={page}
              total={totalPage}
              onChange={(newPage) => {
                handleSearch(newPage);
              }}
            />
          </div>
    </div>
  );
};

export default Place;
