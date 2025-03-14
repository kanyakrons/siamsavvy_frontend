import React from "react";

const PlanTrip = () => {
  return (
    <div className="flex px-[8rem] pt-20 bg-blue-50 w-full min-h-[25rem] justify-around">
      <div className="w-2/5 ">
        {" "}
        <p className="font-bold text-3xl">Plan Your Trip</p>
        <button
          type="button"
          class="mt-8 text-white bg-black hover:bg-transparent hover:text-black hover:border-2 hover:border-black font-medium rounded-full text-sm px-10 py-4 text-center inline-flex items-center "
        >
          Explore More
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
      </div>

      <div className="flex flex-col w-3/5">
        <p>
          Lorem ipsum dolor sit amet consectetur. Diam eu risus volutpat in. A
          consequat netus vulputate. A consequat netus vulputate. A consequat
          netus vulputate. A consequat netus vulputate. A consequat netus
          vulputate.
        </p>
        <div className="grid grid-cols-2 gap-5 mt-10">
          <div className="flex flex-col">
            <p className="text-3xl font-bold">77</p>
            <p className="">
              Lorem ipsum dolor sit amet consectetur. Diam eu risus volutpat in.
              A consequat netus vulputate.
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-3xl font-bold">5</p>
            <p>
              {" "}
              Lorem ipsum dolor sit amet consectetur. Diam eu risus volutpat in.
              A consequat netus vulputate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
