import { Token } from "@mui/icons-material";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8095",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => localStorage.getItem("token");

const fetchDataWithAuth = async (method, url, data = null) => {
  const token = getAuthToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    let response;
    if (method.toUpperCase() === "GET") {
      response = await axiosInstance.get(url, { headers });
    } else if (method.toUpperCase() === "POST") {
      response = await axiosInstance.post(url, JSON.stringify(data), {
        headers,
      });
    } else {
      throw new Error("Invalid HTTP method");
    }
    return response;
  } catch (error) {
    console.error("There was an error fetching the data:", error);
    throw error;
  }
};

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
    return response;
  } catch (error) {
    console.error("There was an error fetching the data:", error);
    throw error;
  }
};

export { fetchDataWithAuth, fetchData };
