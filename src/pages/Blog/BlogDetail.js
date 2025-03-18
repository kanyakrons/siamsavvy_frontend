import React, { useContext, useEffect, useState } from "react";
import { getDetail } from "../../api/blogApi";
import { useParams } from "react-router-dom";
import { Avatar, message, Tag } from "antd";
import { Hero } from "../Sections";
import formatDate from "../../utils/FormatDate";
import { AuthContext } from "../../context/AuthContext";

const BlogDetail = () => {
  const [blog, setBlog] = useState("");
  const [blogComment, setBlogComment] = useState("");
  const { isAuth, user } = useContext(AuthContext);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDetail(id);
        setBlog(response.data);
      } catch (error) {
        message.error(`error ${error}`);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div>
      <div>
        <Hero />
        <div className="mt-10 mx-40 h-screen">
          <img
            src="https://siamsavvy.s3.amazonaws.com/1742222088975_music-poster-with-light-effect_23-2148353360.jpg"
            className="object-cover h-[550px]  w-full"
          />
          <div className="w-full flex flex-col">
            <div className=" mt-5 grid grid-cols-2">
              {" "}
              <div className="w-1/2">
                <div>{blog?.createdAt ? formatDate(blog.createdAt) : ""}</div>
                <div className="mt-5 ">
                  {blog?.categories
                    ? blog.categories.map((category) => (
                        <Tag>{category.name}</Tag>
                      ))
                    : ""}
                </div>
              </div>
              <div className="flex flex-col items-end">
                {" "}
                <div className="bg-purple-200 px-5  py-2 rounded-lg grid grid-cols-2 gap-5">
                  <div>
                    {" "}
                    <Avatar
                      size="large"
                      src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                    />
                  </div>
                  <div>
                    {" "}
                    <p>{blog.user?.displayName}</p>{" "}
                    <p>@{blog.user?.username}</p>{" "}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="w-1/2 mt-10"
              dangerouslySetInnerHTML={{ __html: blog?.content }}
            ></div>

            <div className="my-10">
              {isAuth && (
                <div className="border border-gray-200 rounded-lg bg-gray-100 px-7 py-5 shadow-md">
                  {/* User Name */}
                  <p className="font-semibold">
                    {JSON.parse(JSON.stringify(user)).username}
                  </p>

                  {/* Review Input */}
                  <textarea
                    className="w-full mt-3 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    rows="3"
                    placeholder="Write your review..."
                    value={blogComment}
                    onChange={(e) => setBlogComment(e.target.value)}
                  ></textarea>

                  {/* Rating and Button Container */}
                  <div className="mt-2 flex items-center justify-between">
                    {/* Star Rating */}

                    {/* Post Review Button */}
                    <button
                      className="px-5 py-2 bg-black text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-purple-400"
                      onClick={() => {}}
                    >
                      Post Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
