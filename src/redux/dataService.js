// src/redux/dataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
  teachers: [],
  error: null,
  //   buildings: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
      state.error = null; // Clear error on successful data fetch
    },
    setTeachers: (state, action) => {
      state.teachers = action.payload;
      state.error = null; // Clear error on successful data fetch
    },
    setError: (state, action) => {
      state.error = action.payload; // Store error message in Redux state
    },
  },
});

export const { setStudents, setTeachers, setError } = dataSlice.actions;
export default dataSlice.reducer;
