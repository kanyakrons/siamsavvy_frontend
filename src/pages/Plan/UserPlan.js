import { useEffect, useState } from "react";
import { GetPlanSaved } from "../../api/planApi";
import { useNavigate } from "react-router-dom";

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

  return (
    <>
      {planList && planList.length > 0 ? (
        planList.map((plan, index) => (
          <div
            key={index}
            onClick={() => navigate(`/plans/${plan.id}`)} // Wrap navigate in a function
          >
            {plan.name}
          </div>
        ))
      ) : (
        <div>No plans available</div>
      )}
    </>
  );
};

export default UserPlan;
