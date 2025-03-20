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

const searchPlace = async (searchValue) => {
  try {
    const data = await fetchData("POST", "/places/search", searchValue);
    return data;
  } catch (error) {
    console.log(error);
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

const getPlacePhoto = async (placeId) => {
  try {
    const data = await fetchData("GET", `/places/${placeId}/photos`);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const reviewPlace = async (placeId, score, content) => {
  try {
    const response = await fetchDataWithAuth("POST", `/review`, {
      placeId: parseInt(placeId, 10),
      content: content,
      score: parseFloat(score),
    });

    return response;
  } catch (err) {
    console.log(err);
  }
};

const checkIfFavorited = async (placeId) => {
  try {
    const response = await fetchDataWithAuth(
      "GET",
      `/favoritePlace/check/${placeId}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

const toggleFavorite = async (placeId) => {
  try {
    const response = await fetchDataWithAuth(
      "POST",
      `/places/${placeId}/toggle-favorite`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};

export {
  getPlaces,
  getPlacePhoto,
  getProvinces,
  getPlaceDetail,
  reviewPlace,
  checkIfFavorited,
  toggleFavorite,
  searchPlace,
};
