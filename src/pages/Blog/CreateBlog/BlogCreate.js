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

const MAX_COUNT = 3;
const Delta = Quill.import("delta");

const BlogCreate = () => {
  const [content, setContent] = useState();
  const [uploadedImages, setUploadedImages] = useState([]);
  const quillRef = useRef();
  const [value, setValue] = useState([]);
  const [blogValue, setBlogValue] = useState(BlogValue);

  const [options, setOptions] = useState([]);

  const handlePublish = async () => {
    const htmlContent = quillRef.current.root.innerHTML;
    // setBlogValue({
    //   ...blogValue,
    //   content: htmlContent,
    //   categories: value,
    // }); this rely on state calling createBlog(blogValue) might not work as expected

    const updatedBlogValue = {
      ...blogValue,
      content: htmlContent,
      categories: value, // try to set it manually with normal const
    };

    const response = await createBlog(updatedBlogValue);
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
  }, []);

  return (
    <>
      <NavBar variant={"black"} />
      <div className="w-full h-screen pt-40">
        <div className="mx-40">
          {/* Title */}
          <div>
            <div className="flex flex-col gap-4">
              <UploadImg />
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-1/2 p-2.5"
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
                  width: "50%",
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
