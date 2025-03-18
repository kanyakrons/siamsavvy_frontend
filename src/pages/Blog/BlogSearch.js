import { useEffect, useState } from "react";
import { SearchValue } from "./SearchValue";
import Select from "react-select";
import { Hero } from "../Sections";
import { searchBlog } from "../../api/blogApi";
import BlogCard from "../../components/BlogCard";
import { useNavigate } from "react-router-dom";

const BlogSearch = () => {
  const [searchValue, setSearchValue] = useState(SearchValue);
  const [blogList, setBlogList] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      // Mapping the selected options to only include values
      const formattedSearchValue = {
        ...searchValue,
        listCategory: searchValue.listCategory?.map((option) => option.value),
        listProvince: searchValue.listProvince?.map((option) => option.value),
      };

      const response = await searchBlog(formattedSearchValue);
      setBlogList(response.data.content);
      console.log("🚀 ~ searchBlog ~ response:", response);
    } catch (error) {
      console.log(error);
    }
  };

  const provinceOptions = [
    { value: "Bangkok", label: "Bangkok" },
    { value: "Chiang Mai", label: "Chiang Mai" },
    { value: "Phuket", label: "Phuket" },
  ];

  const placeOptions = [
    { value: "Park", label: "Park" },
    { value: "Museum", label: "Museum" },
    { value: "Beach", label: "Beach" },
  ];

  const categoryOptions = [
    { value: 1, label: "Nature" },
    { value: 2, label: "Adventure" },
    { value: 3, label: "Cafe" },
  ];

  useEffect(() => {
    // Fetch data initially when the component loads
    handleSearch();
  }, []);

  return (
    <div className="relative w-full mx-auto h-screen ">
      <Hero title={"Blog"} />
      <div className=" flex justify-center items-center w-full mb-7">
        {/* Search Bar container */}
        <div className="absolute flex gap-4 justify-center items-center bg-white rounded-full shadow-lg px-6 py-3 w-full max-w-[750px] ">
          {/* Province Multi-Select */}
          <Select
            isMulti
            placeholder="Filter by Province"
            options={provinceOptions}
            styles={{
              control: (base) => ({
                ...base,
                width: "200px",
                borderRadius: "9999px",
              }),
            }}
            onChange={(selectedOption) => {
              setSearchValue({ ...searchValue, listProvince: selectedOption });
            }}
          />

          <input
            type="text"
            placeholder="Blog Title ..."
            className="w-[200px] p-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) =>
              setSearchValue({ ...searchValue, blogTitle: e.target.value })
            }
          />

          {/* Category Multi-Select */}
          <Select
            isMulti
            placeholder="Filter by Category"
            options={categoryOptions}
            styles={{
              control: (base) => ({
                ...base,
                width: "200px",
                borderRadius: "9999px",
              }),
            }}
            onChange={(selectedOption) => {
              setSearchValue({ ...searchValue, listCategory: selectedOption });
            }}
          />

          {/* Search Button */}
          <button
            className="p-2 bg-purple-600 text-white rounded-full"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 row-auto mx-20 mt-20 gap-10">
        {blogList?.map((blog) => (
          <div
            key={blog.id}
            onClick={() => {
              navigate(`/blogs/${blog.id}`);
            }}
          >
            <BlogCard blog={blog} layout="vertical" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSearch;
