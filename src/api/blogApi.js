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

const getDetail = async (id) => {
  try {
    const response = await fetchData("GET", `blogs/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { searchBlog, createBlog, getDetail };
