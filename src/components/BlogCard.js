import React from "react";
import { useNavigate } from "react-router-dom";
import formatDate from "../utils/FormatDate";

const BlogCard = ({ blog, layout = "vertical", imageHeight = 200 }) => {
  const navigate = useNavigate();
  const getTextFromHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent.replace(/\s+/g, "  ").trim();
  };
  return (
    <div
      className={`flex ${
        layout === "horizontal" ? "flex-row gap-4" : "flex-col"
      } w-full transition-all duration-300 transform hover:shadow-2xl`}
      onClick={() => {
        navigate(`/blogs/${blog?.id}`);
      }}
    >
      {/* Image Section */}
      <div
        className={`${
          layout === "horizontal" ? "w-[800px] max-w-sm" : "w-full"
        }`}
      >
        <img
          src={blog?.image?.url}
          alt="blog"
          className="w-full object-cover"
          style={{ height: `${imageHeight}px` }}
        />
      </div>

      {/* Text Section */}
      <div
        className={`flex flex-col gap-3 my-5 flex-grow ${
          layout === "horizontal" ? "mt-0" : "mt-4"
        }`}
      >
        <p className="text-purple-500 font-semibold">
          {blog?.createdAt ? formatDate(blog?.createdAt) : "xx/xx/xxxx"}
        </p>
        <p
          className={`font-bold text-xl truncate   ${
            layout === "horizontal" ? "w-[300px] " : "w-full"
          }`}
        >
          {blog?.title}
        </p>
        <p
          className={` text-gray-700   ${
            layout === "horizontal"
              ? "w-[250px] line-clamp-3"
              : "w-full line-clamp-2"
          }`}
        >
          {blog?.content ? getTextFromHTML(blog?.content) : ""}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
