import { setStudents, setTeachers, setError } from "../redux/dataService";
import fetchData from "./axiosService";

const getStudents = async (dispatch) => {
  try {
    const data = await fetchData("GET", "/student/all");
    dispatch(setStudents(data));
  } catch (err) {
    console.log(err);
    dispatch(setError("Failed to fetch student data"));
  }
};

const getTeachers = async (dispatch) => {
  try {
    const data = await fetchData("GET", "/student/all");
    dispatch(setTeachers(data));
  } catch (err) {
    console.log(err);
    dispatch(setError("Failed to fetch teacher data"));
  }
};

export { getStudents, getTeachers };
