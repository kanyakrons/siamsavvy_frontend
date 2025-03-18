import { fetchData, fetchDataWithAuth } from "./axiosService";

const searchBlog = async (searchValue) => {
  try {
    const response = await fetchData("POST", "blogs/search", searchValue);
    console.log("🚀 ~ searchBlog ~ response:", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const createBlog = async (blogData) => {
  console.log("🚀 ~ createBlog ~ blogData:", blogData);
  try {
    const response = await fetchDataWithAuth("POST", "blogs/create", blogData);
    console.log("🚀 ~ searchBlog ~ response:", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getDetail = async (id) => {
  console.log("🚀 ~ getDetail ~ id:", id);
  try {
    const response = await fetchData("GET", `blogs/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { searchBlog, createBlog, getDetail };
