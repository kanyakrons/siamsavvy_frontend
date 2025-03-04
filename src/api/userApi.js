import { fetchData } from "./axiosService";

const loginApi = async (data) => {
  try {
    const response = await fetchData("POST", "auth/login", data);
    return response;
  } catch (error) {
    console.log(err);
  }
};

export { loginApi };
