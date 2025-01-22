import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8095",
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchData = async (method, url, data = null) => {
  try {
    let response;
    if (method.toUpperCase() === "GET") {
      response = await axiosInstance.get(url);
    } else if (method.toUpperCase() === "POST") {
      response = await axiosInstance.post(url, data);
    } else {
      throw new Error("Invalid HTTP method");
    }
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the data:", error);
    throw error;
  }
};

export default fetchData;
