import React, { useEffect, useState } from "react";
import BlogCard from "../../components/BlogCard";
import { SearchValue } from "../Blog/SearchValue";
import { searchBlog } from "../../api/blogApi";
import { message } from "antd";

const Blogs = () => {
  const [searchValue, setSearchValue] = useState(SearchValue);
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await searchBlog({ ...searchValue, pageSize: 9 });
        setBlogs(response.data.content);
      } catch (error) {
        message.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className=" w-full min-h-[90rem]">
      <div className="mx-[8rem] pt-10 ">
        <p className="font-bold text-2xl text-center mb-5"> BLOGS </p>
        <p className="font-bold mb-2"> Recent blog posts</p>

        <div className="min-h-[30rem] w-full  grid grid-cols-2 mt-5 gap-5">
          <div className="h-full">
            <BlogCard blog={blogs.at(0)} layout="vertical" imageHeight={300} />
          </div>
          <div className=" h-full grid grid-rows-2  gap-5">
            {blogs.slice(1, 3).map((item) => (
              <div className="h-full width-full">
                <BlogCard blog={item} layout="horizontal" imageHeight={200} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4 min-h-[40rem]">
            {blogs.slice(3, 8).map((item) => (
              <BlogCard blog={item} layout="vertical" imageHeight={200} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
