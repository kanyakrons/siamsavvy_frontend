import React, { useState, useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import GeneratePlan from "./pages/GeneratePlan";
import Place from "./pages/Place";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import NavBar from "./components/NavBar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Place />} />
          <Route path="/plans/generate" element={<GeneratePlan />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/plans/:id" element={<Home />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
