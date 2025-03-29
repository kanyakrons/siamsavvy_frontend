import React from "react";

const Footer = () => {
  return (
    <footer class="bg-slate-500 w-full py-5 mt-10 ">
      <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-white ">
              SiamSavvy
            </span>
          </a>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span class="block text-sm text-white sm:text-center ">
          © 2023{" "}
          <a href="https://flowbite.com/" class="hover:underline">
            SiamSavvy
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
