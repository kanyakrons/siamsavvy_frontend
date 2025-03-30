import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Hero = ({ title, description, isHomePage = false }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "https://www.thomascook.com/.imaging/default/dam/uk/holidays/destinations/thailand_main.jpg/jcr:content.jpg", // Add your second image
    "https://images.pexels.com/photos/358229/pexels-photo-358229.jpeg?cs=srgb&dl=pexels-pixabay-358229.jpg&fm=jpg", // Add your third image
    "https://images.locationscout.net/2022/07/bangkok-skywalk-night-view-thailand-wlfq.webp?h=1400&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full min-h-[25rem] pt-10 overflow-hidden">
      {/* Background images with transition */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 mx-40 py-20">
        <p className="text-6xl max-w-[38rem] font-bold text-white">{title}</p>
        <p className="max-w-[40rem] mt-10 text-l text-white">{description}</p>

        {isHomePage && (
          <div className="mt-10">
            <button
              type="button"
              className="text-gray-500 bg-white hover:bg-transparent hover:text-white hover:border-2 hover:border-white font-medium rounded-full text-sm px-10 py-5 text-center inline-flex items-center"
              onClick={() => navigate("/places")}
            >
              Explore Places
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
            <button
              type="button"
              className="text-white hover:bg-white hover:text-gray-500 font-medium rounded-full border-2 border-white text-sm px-10 py-5 text-center inline-flex items-center ml-5"
              onClick={() => navigate("/blogs")}
            >
              Read Blog
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
