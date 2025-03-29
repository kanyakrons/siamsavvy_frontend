import { useEffect, useState } from "react";
import { SearchValue } from "./SearchValue";
import { Hero } from "../Sections";
import { searchBlog } from "../../api/blogApi";
import BlogCard from "../../components/BlogCard";
import { useNavigate } from "react-router-dom";
import { getProvinces } from "../../api/placeApi";
import { getCategories } from "../../api/categoryApi";
import { Input, message, Pagination, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const BlogSearch = () => {
  const [searchValue, setSearchValue] = useState(SearchValue);
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      // Mapping the selected options to only include values
      const formattedSearchValue = {
        ...searchValue,
        listCategory: searchValue.listCategory,
        listProvince: searchValue.listProvince,
      };

      const response = await searchBlog(formattedSearchValue);
      setBlogList(response.data.content);
      setPage(response?.data.number);
      setTotalPage(response?.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provincesData = await getProvinces();
        const categoriesData = await getCategories();
        handleSearch();
        setProvinces(provincesData.data);
        setCategories(categoriesData.data);
      } catch (error) {
        message.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative w-full mx-auto h-screen ">
      <Hero title={"Blog"} />
      <div className=" flex justify-center items-center w-full mb-7">
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
            value={searchValue.blogTitle}
            onChange={(e) =>
              setSearchValue({ ...searchValue, blogTitle: e.target.value })
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
  );
};

export default BlogSearch;
