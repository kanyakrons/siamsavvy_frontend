import React, { useContext, useEffect, useState } from "react";
import { commentBlog, getDetail } from "../../api/blogApi";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, message, Tag } from "antd";
import { Hero } from "../Sections";
import formatDate from "../../utils/FormatDate";
import { AuthContext } from "../../context/AuthContext";
import { isLikedBlog, likeBlog } from "../../api/userApi";
import NavBar from "../../components/NavBar";

const BlogDetail = () => {
  const [blog, setBlog] = useState("");
  const { isAuth, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const formatJson = (string) => {
    try {
      return JSON.parse(string);
    } catch (error) {
      console.error("Invalid JSON string", error);
      return {};
    }
  };

  const onClickLike = async () => {
    try {
      await likeBlog(id);
      setIsLiked(!isLiked);
    } catch (error) {
      message.error(error);
    }
  };

  const onComment = async () => {
    try {
      const request = {
        blogId: id,
        content: reviewText,
      };
      await commentBlog(request);
      setReviewText("");
      setCommentSubmitted(true);
    } catch (error) {
      message.error("Failed to submit review. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDetail(id);
        const liked = await isLikedBlog(id);
        setIsLiked(liked.data);
        setBlog(response.data);
      } catch (error) {
        message.error(`error ${error}`);
      }
    };

    if (commentSubmitted) {
      setCommentSubmitted(false);
    }
    fetchData();
  }, [id, commentSubmitted]);
  return (
    <div className="w-full">
      <NavBar variant="black" />

      <div>
        <div className="mx-60 pt-20 bg-gra ">
          <div className="flex mt-5">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold "> {blog?.title} </h1>
              <div className="mt-1">
                {blog?.createdAt ? formatDate(blog.createdAt) : ""}
              </div>
            </div>
            {isAuth && (
              <div className="ms-auto mt-5">
                {/* Heart icon */}
                <svg
                  onClick={onClickLike}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "red" : "none"}
                  stroke={isLiked ? "red" : "gray"}
                  className="w-7 h-7 cursor-pointer"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col">
            <div className=" grid grid-cols-2">
              {" "}
              <div className="w-1/2">
                <div className="mt-5 ">
                  {blog?.categories
                    ? blog.categories.map((category) => (
                        <Tag className=" bg-purple-400 text-white text-xs font-semibold px-4 py-1 rounded-full mb-2">
                          {category.name}
                        </Tag>
                      ))
                    : ""}
                </div>
                <div>
                  {blog.plan && (
                    <>
                      <div
                        className="px-5 py-5 border-2 shadow-lg rounded-xl mt-5 hover:scale-105 transition-all duration-300 ease-in-out"
                        onClick={() => {
                          navigate(`/plans/${blog.plan.id}`);
                        }}
                      >
                        <div className="flex">
                          <p className="font-bold text-lg"> {blog.plan.name}</p>
                          <p className="ms-auto text-sm text-gray-800">
                            {formatDate(blog.plan?.createdAt)}
                          </p>{" "}
                        </div>
                        <div className="flex flex-col gap-2 mt-3">
                          <p className="flex gap-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="size-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                              />
                            </svg>
                            {formatJson(blog.plan.detail).trip?.destination}
                          </p>{" "}
                          <p className="flex gap-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="size-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                              />
                            </svg>
                            {formatJson(blog.plan.detail).trip?.duration} day(s)
                          </p>{" "}
                        </div>
                        <p className="text-right">
                          {blog.plan?.user?.displayName}
                        </p>{" "}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                {" "}
                <div className="bg-purple-200 px-5  py-2 rounded-lg grid grid-cols-2 gap-5">
                  <div>
                    {" "}
                    <Avatar
                      size="large"
                      src={JSON.parse(localStorage.getItem("user"))?.imageUrl}
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
              className="quil-content w-full mt-10 "
              dangerouslySetInnerHTML={{ __html: blog?.content }}
            ></div>

            <div className="mb-3 mt-10">
              <p className="text-xl font-semibold">Comments</p>
              {blog.blogComments && blog.blogComments.length > 0 && (
                <div className="">
                  {blog.blogComments.map((review) => (
                    <div
                      key={review.id}
                      className="mt-2 p-4 border-t border-gray-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex">
                          <Avatar
                            size="large"
                            src={
                              JSON.parse(localStorage.getItem("user"))?.imageUrl
                            }
                          />
                          <p className="font-semibold ml-3">
                            {review.user.displayName}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{review.content}</p>
                      <p className="mt-2 text-gray-500 text-sm">
                        Commented on{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {isAuth && (
                <div className="mt-2 border border-gray-200 rounded-lg bg-gray-100 px-7 py-5 shadow-md mb-10">
                  {/* User Name */}
                  <p className="font-semibold">
                    {JSON.parse(JSON.stringify(user)).username}
                  </p>

                  {/* Review Input */}
                  <textarea
                    className="w-full mt-3 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    rows="3"
                    placeholder="Write your comment..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>

                  <button
                    className="px-5 py-2 bg-black text-white font-semibold rounded-full shadow-md transition-all duration-200 hover:bg-purple-400"
                    onClick={onComment}
                  >
                    Comment
                  </button>
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
