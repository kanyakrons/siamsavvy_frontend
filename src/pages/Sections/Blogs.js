import React from "react";
import BlogCard from "../../components/BlogCard";

const Blogs = () => {
  const items = [
    {
      id: 1,
      category: "Cultures",

      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      category: "Cultures",

      pic: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      category: "Activities",

      pic: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      category: "Activities",
      pic: "https://images.unsplash.com/photo-1463725876303-ff840e2aa8d5?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      category: "Food",

      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 6,
      category: "Cultures",

      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 7,
      category: "Food",

      pic: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 8,
      category: "Food",

      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 9,
      category: "Food",

      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 11,
      category: "Food",

      pic: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <section className=" w-full min-h-[90rem]">
      <div className="mx-[8rem] pt-10 ">
        <p className="font-bold text-2xl text-center mb-5"> BLOGS </p>
        <p className="font-bold mb-2"> Recent blog posts</p>

        <div className="min-h-[30rem] w-full  grid grid-cols-2 mt-5 gap-5">
          <div className="h-full">
            <BlogCard blog={items.at(0)} layout="vertical" imageHeight={300} />
          </div>
          <div className=" h-full grid grid-rows-2  gap-5">
            {items.slice(0, 2).map((item) => (
              <div className="h-full width-full">
                <BlogCard blog={item} layout="horizontal" imageHeight={200} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4 min-h-[40rem]">
            {items.slice(2, 8).map((item) => (
              <BlogCard blog={item} layout="vertical" imageHeight={200} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
