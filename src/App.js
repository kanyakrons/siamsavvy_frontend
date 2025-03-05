import React, { useState, useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Place from "./pages/Place";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import PlaceDetail from './pages/PlaceDetail';
import PlanGenerate from "./pages/PlanGenerate";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Place />} />
          <Route path="/places/:placeId" element={<PlaceDetail />} />
          <Route path="/plans/generate" element={<PlanGenerate />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/plans/:id" element={<Home />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
