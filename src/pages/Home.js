import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudents, getTeachers } from "../api/studentApi";
import { useNavigate } from "react-router-dom";
import {
  Hero,
  Blogs,
  Exploration,
  PopularPlaces,
  PlanTrip,
  Footer,
} from "./Sections";
import NavBar from "../components/NavBar";

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
    <main className="relative">
      {" "}
      <NavBar />
      <section className="  ">
        <Hero
          title={"Home page"}
          description={"Home page drescription"}
          isHomePage={true}
        />
      </section>
      <section className="">
        <Blogs />
      </section>
      <section className=" ">
        <PlanTrip />
      </section>
      <section className=" ">
        <PopularPlaces />
      </section>
      <section className=" ">
        <Exploration />
      </section>{" "}
      <section className=" ">
        <Footer />
      </section>{" "}
    </main>
  );
};

export default Home;
