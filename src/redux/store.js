// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./dataService";

const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});

export default store;
