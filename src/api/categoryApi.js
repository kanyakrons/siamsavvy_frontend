import { setError } from "../redux/dataService";
import { fetchData } from "./axiosService";

const getCategories = async () => {
  try {
    const data = await fetchData("GET", "/categories");
    return data;
  } catch (err) {
    console.log(err);
  }
};

export { getCategories };
