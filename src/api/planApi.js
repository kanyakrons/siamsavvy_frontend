import { fetchData, fetchDataWithAuth } from "./axiosService";

const generatePlanByAi = async (
  numberOfDay,
  categories,
  city,
  startLocation,
  distance
) => {
  try {
    const response = await fetchDataWithAuth("POST", `/plans/generate-plan`, {
      numberOfDay: numberOfDay,
      categories: categories,
      city: city,
      startLocation: startLocation,
      distance: distance,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

const CreatePlan = async (planDetails) => {
  try {
    const response = await fetchDataWithAuth("POST", "/plans/create", {
      name: planDetails.name,
      detail: JSON.stringify(planDetails.detail),
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

const GetPlanDetail = async (planId) => {
  try {
    const response = await fetchData("GET", `/plans/${planId}`);
    return response;
  } catch (err) {
    console.log(err);
  }
};

const GetPlanSaved = async () => {
  try {
    const response = await fetchDataWithAuth("GET", "/plans/saved");
    return response;
  } catch (err) {
    console.log(err);
  }
};

const toggleFavorite = async (planId) => {
  try {
    const response = await fetchDataWithAuth(
      "POST",
      `/plans/${planId}/toggle-favorite`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

const getFavorite = async () => {
  try {
    const response = await fetchDataWithAuth("GET", `/plans/favorite`);
    return response;
  } catch (err) {
    console.log(err);
  }
};

const checkIfFavorited = async (placeId) => {
  try {
    const response = await fetchDataWithAuth(
      "GET",
      `/plans/isLiked/${placeId}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

export {
  generatePlanByAi,
  CreatePlan,
  GetPlanDetail,
  GetPlanSaved,
  toggleFavorite,
  checkIfFavorited,
  getFavorite,
};
