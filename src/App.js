import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <Router>
        <nav>
        <div className="navbar-left">
          <Link to="/" className="logo">
            SiamSavvy
          </Link>
        </div>
        <div className="navbar-center">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">Blogs</Link>
            </li>
            <li>
              <Link to="/">Places</Link>
            </li>
            <li>
              <Link to="/">Trip planner</Link>
            </li>
          </ul>
          </div>
          <div className="navbar-right">
          <img
            src="https://media.istockphoto.com/id/470100848/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/%E0%B9%84%E0%B8%AD%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%84%E0%B8%9F%E0%B8%A5%E0%B9%8C%E0%B8%8A%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B5%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%9A%E0%B8%99%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B5%E0%B8%99%E0%B9%89%E0%B9%8D%E0%B8%B2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99.jpg?s=2048x2048&w=is&k=20&c=1BqfEAXa3GO2H-aNv5Sao3EnR0PTicWJpKN1Sm0u-hI="
            alt="Profile"
            className="profile-pic"
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className="dropdown-menu">
              <ul>
                <li>
                  <Link to="/">Profile</Link>
                </li>
                <li>
                  <Link to="/">Blogs</Link>
                </li>
                <li>
                  <Link to="/">Plans</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
    </Router>
  );
}

export default App;
