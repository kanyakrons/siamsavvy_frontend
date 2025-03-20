import { useEffect, useState } from "react";
import { GetPlanSaved } from "../../api/planApi";
import { useNavigate } from "react-router-dom";
import { Hero } from "../Sections";
import NavBar from "../../components/NavBar";
import CardUserItem from "../../components/CardUserItem";

const UserBlog = () => {
  const [planList, setPlanList] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSerachText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetPlanSaved();
        setPlanList(response?.data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full">
      <NavBar variant={"black"} />
      <div className="mx-60 pt-20">
        <p className=" font-semibold text-3xl my-4">Your Blogs</p>
        <div>
          <form className="w-full mx-auto">
            <div className="flex">
              {/* Dropdown Button */}
              <button
                id="dropdown-button"
                className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 "
                type="button"
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
              >
                {selectedCategory}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  id="dropdown"
                  className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 mt-12"
                >
                  <ul className="py-2 text-sm text-gray-700">
                    {[
                      "Mockups",
                      "Templates",
                      "Design",
                      "Logos",
                      "All Categories",
                    ].map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          className="inline-flex w-full px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-gray-100"
                          onClick={() => {
                            setSelectedCategory(item);
                            setIsOpen(false);
                          }}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Search Input */}
              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
                  placeholder="Search Mockups, Logos, Design Templates..."
                  onChange={(e) => setSerachText(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-gray-600 rounded-e-lg border"
                  onClick={handleSearch}
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-10 grid grid-cols-3  grid-flow-row gap-4 ">
          {planList && planList.length > 0 ? (
            planList.map((plan, index) => (
              <CardUserItem key={index} item={plan} />
            ))
          ) : (
            <div>No plans available</div>
          )}
        </div>
        <div className="my-10 pt-5 w-full h-[100px] flex flex-col items-center ">
          <div class="flex flex-col items-center">
            <span class="text-sm text-gray-700 ">
              Showing <span class="font-semibold text-gray-900 ">1</span> to{" "}
              <span class="font-semibold text-gray-900 ">10</span> of{" "}
              <span class="font-semibold text-gray-900 ">100</span> Entries
            </span>

            <div class="inline-flex mt-2 ">
              <button class="flex items-center justify-center px-10 py-5 h-8 text-sm font-medium text-white bg-gray-800 rounded-s-lg hover:bg-gray-900 ">
                Prev
              </button>
              <button class="flex items-center justify-center ml-0.5 px-10 py-5 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e-lg hover:bg-gray-900 ">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBlog;
