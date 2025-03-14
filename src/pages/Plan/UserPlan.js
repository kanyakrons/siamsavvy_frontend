import { useEffect, useState } from "react";
import { GetPlanSaved } from "../../api/planApi";
import { useNavigate } from "react-router-dom";
import { Hero } from "../Sections";

const UserPlan = () => {
  const [planList, setPlanList] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetPlanSaved();
        console.log("🚀 ~ fetchData ~ response:", response.data);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full mx-auto">
      <Hero />
      <div className="p-5">
        <p className=" font-semibold text-3xl my-4">Your Plans</p>
        {planList && planList.length > 0 ? (
          planList.map((plan, index) => (
            <div
              key={index}
              onClick={() => navigate(`/plans/${plan.id}`)}
              className="px-6 py-4 rounded-xl mb-3 border border-gray-200 shadow-lg hover:border-purple-400 hover:border-2"
            >
              <p className="font-semibold text-xl mb-1">{plan.name}</p>
              <p className="text-gray-500 text-sm">
                {formatDate(plan.createdAt)}
              </p>
            </div>
          ))
        ) : (
          <div>No plans available</div>
        )}
      </div>
    </div>
  );
};

export default UserPlan;
