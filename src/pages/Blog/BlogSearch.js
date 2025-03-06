import { useEffect, useState } from "react";
import { SearchValue } from "./SearchValue";
import Select from "react-select";

const BlogSearch = () => {
  const [searchValue, setSearchValue] = useState(SearchValue);

  useEffect(() => {}, []);

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-center items-center w-full mb-7">
        {/* Search Bar container */}
        <div className="flex gap-4 justify-center items-center bg-white rounded-full shadow-lg px-6 py-3 w-full max-w-[750px]">
          {/* Province Multi-Select */}
          <Select
            isMulti
            placeholder="Filter by Province"
            styles={{
              control: (base) => ({
                ...base,
                width: "200px",
                borderRadius: "9999px",
              }),
            }}
          />

          {/* Search by Place Name */}
          <input
            type="text"
            placeholder="Place Name ..."
            className="w-[200px] p-2 border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Category Multi-Select */}
          <Select
            isMulti
            placeholder="Filter by Category"
            styles={{
              control: (base) => ({
                ...base,
                width: "200px",
                borderRadius: "9999px",
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogSearch;
