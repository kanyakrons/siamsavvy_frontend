import React from "react";

const BlogCard = ({ blog, layout = "vertical", imageHeight = 200 }) => {
  return (
    <div
      className={`flex ${
        layout === "horizontal" ? "flex-row gap-4" : "flex-col"
      } w-full`}
    >
      {/* Image Section */}
      <div
        className={`${
          layout === "horizontal" ? "w-[800px] max-w-sm" : "w-full"
        }`}
      >
        <img
          src={blog.pic}
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
          {blog.date || "Sunday, 1 Jan 2023"}
        </p>
        <p className="font-bold text-xl truncate">
          {blog.title || "Lorem ipsum dolor sit"}
        </p>
        <p
          className={` text-gray-700   ${
            layout === "horizontal"
              ? "w-[250px] line-clamp-3"
              : "w-full line-clamp-2"
          }`}
        >
          {blog.description ||
            "Lorem ipsum dolor sit amet consectetur. Diam eu risus volutpat in. A consequat netus vulputate. A consequat netus vulputate. A consequat netus vulputate. A consequat netus vulputate. A consequat netus vulputate."}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
