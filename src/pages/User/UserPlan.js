import { useEffect, useState } from "react";
import { getFavorite, GetPlanSaved } from "../../api/planApi";
import { useNavigate } from "react-router-dom";
import { Hero } from "../Sections";
import NavBar from "../../components/NavBar";
import CardUserItem from "../../components/CardUserItem";

const UserPlan = () => {
  const [planList, setPlanList] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSerachText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isFav, setIsFav] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isFav) {
          const response = await getFavorite();
          setPlanList(response?.data);
        } else {
          const response = await GetPlanSaved();
          setPlanList(response?.data);
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isFav]);

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
        <div className="flex">
          <p
            className="font-semibold text-3xl my-4 hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={() => {
              setIsFav(false);
            }}
          >
            <p style={{ color: !isFav ? "#b233ff" : "inherit" }}>Your Plans</p>
          </p>
          <p className="font-semibold text-3xl my-4 ml-3">/</p>
          <p
            className="font-semibold text-3xl my-4 ml-2 hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={() => {
              setIsFav(true);
            }}
          >
            <p style={{ color: isFav ? "#b233ff" : "inherit" }}>
              Favorite Plans
            </p>
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3  grid-flow-row gap-4 ">
          {planList && planList.length > 0 ? (
            planList.map((plan, index) => (
              <CardUserItem key={index} item={plan} type={"plans"} />
            ))
          ) : (
            <div>No plans available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPlan;
