import React, { useEffect, useState } from "react";
import { getDetail } from "../../api/blogApi";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { Hero } from "../Sections";
import formatDate from "../../utils/FormatDate";

const BlogDetail = () => {
  const [blog, setBlog] = useState("");
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
        <div className="mt-10 mx-20 h-screen">
          <img
            src="https://siamsavvy.s3.amazonaws.com/1742222088975_music-poster-with-light-effect_23-2148353360.jpg"
            className="object-cover h-[550px]  w-full"
          />
          <div className="w-full flex flex-col">
            <div className="w-1/2 ">
              {" "}
              <div>blog?.createdAt</div>
              <div></div>
            </div>

            <div
              className="w-1/2"
              dangerouslySetInnerHTML={{ __html: blog?.content }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
