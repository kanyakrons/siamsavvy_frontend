import { setError } from "../redux/dataService";
import { fetchData, fetchDataWithAuth } from "./axiosService";

const getPlaces = async () => {
  try {
    const data = await fetchData("GET", "/places");
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getProvinces = async () => {
  try {
    const data = await fetchData("GET", "/places/provinces");
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getPlaceDetail = async (placeId) => {
  try {
    const data = await fetchData("GET", `/places/${placeId}`);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const reviewPlace = async (placeId, score, content) => {
  try {
    const response = await fetchDataWithAuth("POST", `/review`, {
      "placeId": parseInt(placeId, 10),
      "content": content,
      "score": parseFloat(score)
    });

    return response;
  } catch (err) {
    console.log(err);
  }
};

const checkIfLiked = async(placeId) => {
  try {
    const response = await fetchDataWithAuth("GET", `/favoritePlace/check/${placeId}`);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export { getPlaces, getProvinces, getPlaceDetail, reviewPlace, checkIfLiked };
