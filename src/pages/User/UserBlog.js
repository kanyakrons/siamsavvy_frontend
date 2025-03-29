import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "../Sections";
import NavBar from "../../components/NavBar";
import CardUserItem from "../../components/CardUserItem";
import { getSavedBlog } from "../../api/blogApi";
import { SearchValue } from "../Blog/SearchValue";
import { getCategories } from "../../api/categoryApi";
import { message, Select } from "antd";
import { likeBlogList } from "../../api/userApi";

const UserBlog = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategoty] = useState([]); // Array for multiple categories
  const [searchValue, setSearchValue] = useState(SearchValue);
  const [isFav, setIsFav] = useState(false);
  const [blogList, setBlogList] = useState([]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const formattedSearchValue = {
        ...searchValue,
        listCategory: selectedCategory, // Use selectedCategory for multiple categories
      };

      const response = await getSavedBlog(formattedSearchValue);
      setBlogList(response.data.content);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData.data);

        if (isFav) {
          setLoading(true);
          const response = await likeBlogList();
          setBlogList(response.data);
        } else {
          handleSearch(); // Fetch blogs initially
        }
      } catch (error) {
        message.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, isFav]); // Trigger handleSearch when selectedCategory changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full">
      <NavBar variant={"black"} />
      <div className="mx-60 pt-20">
        <div className="flex">
          <p
            className="font-semibold text-3xl my-4 hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={() => {
              setIsFav(false);
            }}
          >
            <p style={{ color: !isFav ? "#b233ff" : "inherit" }}>Your Blogs</p>
          </p>
          <p className="font-semibold text-3xl my-4 ml-3">/</p>
          <p
            className="font-semibold text-3xl my-4 ml-2 hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={() => {
              setIsFav(true);
            }}
          >
            <p style={{ color: isFav ? "#b233ff" : "inherit" }}>
              Favorite Blogs
            </p>
          </p>
        </div>
        <div>
          <form className="w-full mx-auto">
            <div className="flex">
              {/* Multi-Select Dropdown */}
              <Select
                mode="multiple"
                allowClear
                style={{ width: "200px" }}
                placeholder="Select Categories"
                value={selectedCategory}
                onChange={(value) => {
                  setSelectedCategoty(value); // Update selected categories
                  setSearchValue({
                    ...searchValue,
                    listCategory: value,
                  });
                }}
              >
                {categories.map(({ id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>

              {/* Search Input */}
              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
                  placeholder="Search Mockups, Logos, Design Templates..."
                  onChange={(e) =>
                    setSearchValue({
                      ...searchValue,
                      blogTitle: e.target.value,
                    })
                  }
                />
                <button
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-gray-600 rounded-e-lg border"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent page refresh
                    handleSearch();
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-10 grid grid-cols-3 grid-flow-row gap-4">
          {blogList && blogList.length > 0 ? (
            blogList.map((blog, index) => (
              <CardUserItem key={index} item={blog} type={"blogs"} />
            ))
          ) : (
            <div>No blogs available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBlog;
