import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import Loading from "../components/Loading";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    setLoading(false);
  }, []);

  return (
    <main className="relative">
      {loading && <Loading loading={loading}></Loading>} <NavBar />
      <section className="  ">
        <Hero
          title={"SiamSavvy"}
          description={
            "A next-gen travel platform where AI designs your perfect itinerary, while real users share their experiences. Publish blogs with tips, and let AI optimize routes, and hidden gems—all in one place."
          }
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
