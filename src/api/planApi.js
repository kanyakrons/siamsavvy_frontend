import { fetchData, fetchDataWithAuth } from "./axiosService";

const generatePlanByAi = async(numberOfDay, categories, city) => {
    try {
      const response = await fetchDataWithAuth("POST", `/openai/generate-plan`, {
        "numberOfDay": numberOfDay,
        "categories": categories,
        "city": city
    });
      return response;
    } catch (err) {
      console.log(err);
    }
  };
  
  export { generatePlanByAi };