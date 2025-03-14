import React from "react";
import PlaceCardvertical from "../../components/PlaceCardVertical";

const Exploration = () => {
  const places = [
    {
      title: "Lorem ipsum dolor sit amet consectetur ",
      description: "description1",
      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: " Lorem ipsum dolor sit amet consectetur",
      description: "description2",
      pic: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: " Lorem ipsum dolor sit amet consectetur",
      description: "description3",
      pic: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: " Lorem ipsum ",
      description: "description4",
      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: " Lorem ipsum dolor sit amet consectetur",
      description: "description5",
      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <div className="w-full min-h-[40rem] pt-8">
      <div className="justify-center items-center flex flex-col">
        <p className="text-2xl font-bold">POPULAR PLACES</p>
        <p className="mt-1 text-purple-400">
          Lorem ipsum dolor sit amet consectetur. Diam eu risus volutpat in.{" "}
        </p>
      </div>
      <div className=" grid grid-cols-3 gap-4 mt-8 mx-20 ">
        {places.slice(0, 3).map((place) => (
          <div>
            <PlaceCardvertical place={place} height={600} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exploration;
