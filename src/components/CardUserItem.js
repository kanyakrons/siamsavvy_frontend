import React from "react";
import { useNavigate } from "react-router-dom";
import formatDate from "../utils/FormatDate";

const CardUserItem = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div>
      <img
        src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="w-full object-cover h-[400px] rounded-2xl"
        onClick={() => navigate(`/plans/${item?.id}`)}
      />
      <div className="pl-3 py-3">
        {" "}
        <p className="text-lg py-2 ">{item?.name}</p>
        <p>{formatDate(item?.createdAt)}</p>{" "}
      </div>
    </div>
  );
};

export default CardUserItem;
