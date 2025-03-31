import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Quill } from "react-quill";
import NavBar from "../../../components/NavBar";
import { DownOutlined } from "@ant-design/icons";
import { message, Select } from "antd";
import UploadImg from "../../../components/UploadImg";
import Editor from "./Editor";
import BlogValue from "./BlogValue";
import { createBlog } from "../../../api/blogApi";
import { getCategories } from "../../../api/categoryApi";
import { useSearchParams } from "react-router-dom";
import CardUserItem from "../../../components/CardUserItem";
import { GetPlanDetail } from "../../../api/planApi";
import formatDate from "../../../utils/FormatDate";
import { useNavigate } from "react-router-dom";


const MAX_COUNT = 3;
const Delta = Quill.import("delta");

const BlogCreate = () => {
  const navigate = useNavigate();

  const [content, setContent] = useState();
  const [uploadedImages, setUploadedImages] = useState([]);
  const quillRef = useRef();
  const [value, setValue] = useState([]);
  const [blogValue, setBlogValue] = useState(BlogValue);
  const [searchParams] = useSearchParams();
  const [options, setOptions] = useState([]);
  const planId = searchParams.get("planId") ? searchParams.get("planId") : null;
  const [planDetail, setPlanDetail] = useState("");

  const extractImageSrc = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const imgElement = doc.querySelector("img"); // Get the first <img>
    return imgElement ? imgElement.src : "";
  };

  const formatJson = (string) => {
    try {
      return JSON.parse(string);
    } catch (error) {
      console.error("Invalid JSON string", error);
      return {};
    }
  };

  const getPlanDetail = async () => {
    const response = await GetPlanDetail(planId);
    setPlanDetail(response.data);
  };

  const handlePublish = async () => {
    const htmlContent = quillRef.current.root.innerHTML;
    const imageUrl = extractImageSrc(htmlContent);
    // setBlogValue({
    //   ...blogValue,
    //   content: htmlContent,
    //   categories: value,
    // }); this rely on state calling createBlog(blogValue) might not work as expected

    const updatedBlogValue = {
      ...blogValue,
      content: htmlContent,
      categories: value, // try to set it manually with normal const
      imageUrl: imageUrl,
      planId: planId,
    };

    const response = await createBlog(updatedBlogValue);

    navigate("/blogs/saved");
  };

  const suffix = (
    <>
      <span>
        {value.length} / {MAX_COUNT}
      </span>
      <DownOutlined />
    </>
  );

  useEffect(() => {
    const getCategoriesOptions = async () => {
      try {
        const response = await getCategories();
        const categoryOptions = response.data;

        // Ensure the response is an array and map it
        if (Array.isArray(categoryOptions)) {
          setOptions(
            categoryOptions.map((option) => ({
              value: option.id,
              label: option.name,
            }))
          );
        } else {
          message.error("Failed to load categories. Please try again.");
        }
      } catch (e) {
        console.log(e);
      }
    };
    getCategoriesOptions();
    if (planId) {
      getPlanDetail();
    }
  }, []);

  return (
    <>
      <NavBar variant={"black"} />
      <div className="w-full h-screen pt-40">
        <div className="mx-40 mb-[20px]">
          {/* Title */}
          <div className="flex  mb-[20px]">
            <div className="flex flex-col w-1/2 mr-5">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="mb-6">
                    <label
                      htmlFor="default-input"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="default-input"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      onChange={(e) => {
                        setBlogValue({ ...blogValue, title: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Categories */}
              <div className="w-full">
                <label
                  htmlFor="default-input"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Categories
                </label>
                <Select
                  mode="multiple"
                  maxCount={MAX_COUNT}
                  value={value}
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    height: "50px",
                  }}
                  onChange={(selectedOption) => {
                    setValue(selectedOption);
                  }}
                  suffixIcon={suffix}
                  placeholder="Select Categories"
                  options={options}
                />
              </div>
            </div>
            <div className="w-1/2">
              {planId && planDetail && (
                <>
                  <p className="font-bold px-3">Plan</p>
                  <div className=" px-5 py-5 border-2 shadow-lg rounded-xl">
                    <div className="flex">
                      <p className="font-bold text-lg"> {planDetail.name}</p>
                      <p className="ms-auto text-sm text-gray-800">
                        {formatDate(planDetail?.createdAt)}
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
                        {formatJson(planDetail.detail).trip?.destination}
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
                        {formatJson(planDetail.detail).trip?.duration} day(s)
                      </p>{" "}
                    </div>
                    <p className="text-right">{planDetail?.user.displayName}</p>{" "}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Editor */}
          <div>
            <Editor
              ref={quillRef}
              onImageUpload={(imageUrl) =>
                setUploadedImages((prev) => [...prev, imageUrl])
              }
              defaultValue={new Delta()
                .insert("Hello")
                .insert("\n", { header: 1 })
                .insert("Some ")
                .insert("initial", { bold: true })
                .insert(" ")
                .insert("content", { underline: true })
                .insert("\n")}
            />
            <div className="controls">
              <button
                className="controls-right"
                type="button"
                onClick={handlePublish}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogCreate;
