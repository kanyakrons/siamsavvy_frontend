import { useEffect, useState } from "react";
import { getPlaces, getProvinces, searchPlace } from "../../api/placeApi";
import { getCategories } from "../../api/categoryApi";
import { Select, Input } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { Hero } from "../Sections";
import { message, Pagination, Image } from "antd";
import Loading from "../../components/Loading";
import { SearchOutlined } from "@ant-design/icons";
import "../../css/Custom.css";

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCateories] = useState([]);

  const [searchValue, setSearchValue] = useState({
    placeTitle: searchParams.get("placeTitle") || "",
    listCategory: searchParams.getAll("listCategory"),
    listProvince: searchParams.getAll("listProvince"),
    pageNumber: searchParams.get("pageNumber") || 0,
    pageSize: 15,
  });

  // Search & filter states
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);

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

      setSearchParams({
        placeTitle: formattedSearchValue.placeTitle,
        listCategory: formattedSearchValue.listCategory,
        listProvince: formattedSearchValue.listProvince,
        pageNumber: formattedSearchValue.pageNumber,
      });

      const response = await searchPlace(formattedSearchValue);
      setPlaces(response?.data.content);
      setPage(response?.data.number);
      setTotalPage(response?.data.totalElements);
    } catch (error) {
      console.log(error);
      setError(error);
      message.error("Load error");
    } finally {
      setLoading(false);
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
      {loading && <Loading loading={loading}></Loading>}

      <Hero title={"Places"} />
      {/* Outer container to center the search bar */}
      <div className="flex justify-center items-center w-full mb-7">
        {/* Search Bar container */}
        <div className="absolute flex gap-4 justify-center items-center bg-white rounded-full shadow-lg px-6 py-3 w-full max-w-[750px]">
          {/* Province Multi-Select */}
          <Select
            mode="multiple"
            options={provinces.map((p) => ({ value: p, label: p }))}
            value={searchValue.listProvince}
            onChange={(selectedValues) =>
              setSearchValue({ ...searchValue, listProvince: selectedValues })
            }
            placeholder="Filter by Province"
            style={{ width: "300px", height: "35px" }}
            maxTagCount={"responsive"}
            className="custom-select"
            bordered={false}
          />

          {/* Search by Place Name */}
          <Input
            placeholder="Place Name ..."
            value={searchValue.placeTitle}
            onChange={(e) =>
              setSearchValue({ ...searchValue, placeTitle: e.target.value })
            }
            style={{ width: "300px", padding: "8px", height: "35px" }}
            className="rounded-full hover:border-purple-400 focus:border-purple-400"
          />

          {/* Category Multi-Select */}
          <Select
            mode="multiple"
            value={searchValue.listCategory}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            onChange={(selectedValues) =>
              setSearchValue({ ...searchValue, listCategory: selectedValues })
            }
            placeholder="Filter by Category"
            style={{ width: "400px", height: "35px" }}
            maxTagCount={"responsive"}
            className="custom-select"
            bordered={false}
          />

          <button
            className="p-2 bg-purple-600 text-white rounded-full"
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

      <div className="grid grid-cols-3 gap-5 mx-20 mt-20 mb-5">
        {places.length > 0 ? (
          places.map((place) => (
            <div
              key={place.id}
              className="w-full h-[330px] relative bg-white rounded-3xl shadow-lg aspect-square overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <Link to={`/places/${place.place.id}`}>
                {/* Image Section */}
                <div className="h-[230px] relative">
                  <Image
                    src={place.image}
                    alt={place.nameEn}
                    width={"100%"}
                    height={"100%"}
                    fallback="/default-mockup-place.jpg"
                    className="object-cover"
                    preview="false"
                  />

                  {/* Category Box (Top Right) */}
                  <div className="absolute top-3 right-3 bg-purple-400 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    {place.place.category.name}
                  </div>
                </div>

                {/* Info Section */}
                <div className="h-[100px] bg-white px-5 py-3">
                  <p className="text-purple-400 font-semibold text-sm mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {place.place.province}
                  </p>
                  <p className="text-black font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                    {place.place.nameTh}
                  </p>
                  <p className="text-black overflow-hidden text-ellipsis whitespace-nowrap">
                    {place.place.nameEn}
                  </p>
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
          showSizeChanger={false}
          onChange={(newPage) => {
            handleSearch(newPage - 1);
          }}
        />
      </div>
    </div>
  );
};

export default Place;
