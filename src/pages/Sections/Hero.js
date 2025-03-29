import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = ({ title, description, isHomePage = false }) => {
  const navigate = useNavigate();
  return (
    <>
      <section className="flex flex-col justify-center bg-slate-500 w-full min-h-[25rem] pt-10">
        <div className="mx-40">
          <p className="text-6xl max-w-[38rem] font-bold text-white">{title}</p>
          <p className="max-w-[40rem] mt-10 text-xl text-white">
            {description}
          </p>
          {isHomePage && (
            <div className="mt-10">
              <button
                type="button"
                class="text-gray-500 bg-white hover:bg-transparent hover:text-white hover:border-2 hover:border-white font-medium rounded-full text-sm px-10 py-5 text-center inline-flex items-center "
                onClick={() => {
                  navigate("/places");
                }}
              >
                Explore Places
                <svg
                  class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="text-white hover:bg-white hover:text-gray-500 font-medium rounded-full border-2 border-white text-sm px-10 py-5 text-center inline-flex items-center ml-5"
                onClick={() => {
                  navigate("/blogs");
                }}
              >
                Read Blog
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Hero;
