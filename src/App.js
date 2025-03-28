import React, { useState, useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Place from "./pages/Place/Place";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import PlaceDetail from "./pages/Place/PlaceDetail";
import PlanGenerate from "./pages/Plan/PlanGenerate";
import PlanDetail from "./pages/Plan/PlanDetail";
import UserPlan from "./pages/User/UserPlan";
import UserProfile from "./pages/User/UserProfile";
import BlogSearch from "./pages/Blog/BlogSearch";
import UserBlog from "./pages/User/UserBlog";
import BlogCreate from "./pages/Blog/CreateBlog/BlogCreate";
import BlogDetail from "./pages/Blog/BlogDetail";
import SignUpPage from "./pages/SingUp";

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
          <Route path="/plans/:planId" element={<PlanDetail />} />
          <Route path="/plans/saved" element={<UserPlan />} />

          <Route path="/profile" element={<UserProfile />} />
          <Route path="/blogs" element={<BlogSearch />} />
          <Route path="/blogs/create" element={<BlogCreate />} />
          <Route path="/blogs/saved" element={<UserBlog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* <Route path="/plans/:id" element={<Home />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
