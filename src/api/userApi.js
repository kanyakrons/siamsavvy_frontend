import { fetchData, fetchDataWithAuth } from "./axiosService";

const loginApi = async (data) => {
  try {
    const response = await fetchData("POST", "auth/login", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const signupApi = async (data) => {
  try {
    const response = await fetchData("POST", "auth/signup", data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const isLikedBlog = async (id) => {
  try {
    const response = await fetchDataWithAuth("GET", `users/blog/liked/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const likeBlog = async (id) => {
  try {
    const response = await fetchDataWithAuth("POST", `users/blog/like/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const likeBlogList = async () => {
  try {
    const response = await fetchDataWithAuth("GET", `users/blog/liked`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { loginApi, isLikedBlog, likeBlog, likeBlogList, signupApi };
