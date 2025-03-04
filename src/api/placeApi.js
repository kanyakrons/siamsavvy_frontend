import { setError } from "../redux/dataService";
import fetchData from "./axiosService";

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
}

export { getPlaces, getProvinces };
