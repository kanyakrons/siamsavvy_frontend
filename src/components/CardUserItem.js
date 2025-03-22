import React from "react";
import { useNavigate } from "react-router-dom";
import formatDate from "../utils/FormatDate";

const CardUserItem = ({ item, type }) => {
  const navigate = useNavigate();

  return (
    <div>
      <img
        src={type == "blogs" ? item?.image?.url : ""}
        className="w-full object-cover h-[400px] rounded-2xl"
        onClick={() => navigate(`/${type}/${item?.id}`)}
      />
      <div className="pl-3 py-3">
        {" "}
        <p className="text-lg py-2 whitespace-nowrap truncate">
          {type == "places" ? item?.name : item.title}
        </p>
        <p>{formatDate(item?.createdAt)}</p>{" "}
      </div>
    </div>
  );
};

export default CardUserItem;
