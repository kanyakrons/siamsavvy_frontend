import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, getTeachers } from "../api/studentApi";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const teachers = useSelector((state) => state.data.teachers);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student data from the API
    const fetchStudents = async () => {
      const studentData = await getStudents();
      setStudents(studentData);
    };
    fetchStudents();
    // getTeachers(dispatch);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Build Amazing Experiences
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Start your journey with our website
        </p>
        <button
          onClick={() => navigate("/plans/generate")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </main>

      {/* Features Section */}
      <section className="w-full max-w-5xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div
          onClick={() => {
            navigate("/places");
          }}
          className="p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-2">Discover Places</h2>
          <p className="text-gray-600">Find more places for yourself.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">See Blogs For Insights</h2>
          <p className="text-gray-600">
            Many blogs to make use feel more creative.
          </p>
        </div>
        <div
          onClick={() => navigate("/plans/generate")}
          className="p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-2">Plan Your Trip</h2>
          <p className="text-gray-600">Plan your trip for travel lover.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-4xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-700 italic">
            "This platform has transformed the way I work. Highly recommended!"
          </p>
          <span className="block mt-4 text-gray-500">- Alex Johnson</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full p-4 bg-white text-center text-gray-500">
        &copy; 2025 My Website. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
