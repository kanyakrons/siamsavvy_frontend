import { fetchData, fetchDataWithAuth } from "./axiosService";

const searchBlog = async (searchValue) => {
  try {
    const response = await fetchData("POST", "blogs/search", searchValue);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const createBlog = async (blogData) => {
  try {
    const response = await fetchDataWithAuth("POST", "blogs/create", blogData);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const commentBlog = async (request) => {
  try {
    const response = await fetchDataWithAuth("POST", "blogs/comment", request);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getDetail = async (id) => {
  try {
    const response = await fetchData("GET", `blogs/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getSavedBlog = async (searchValue) => {
  try {
    const response = await fetchDataWithAuth(
      "POST",
      "blogs/search/saved",
      searchValue
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { searchBlog, createBlog, getDetail, getSavedBlog, commentBlog };
