import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <main className="relative">
      {loading && <Loading loading={loading} />}
      <NavBar />

      <section>
        <Hero
          title={"SiamSavvy"}
          description={
            "A next-gen travel platform where AI designs your perfect itinerary, while real users share their experiences. Publish blogs with tips, and let AI optimize routes, and hidden gems—all in one place."
          }
          isHomePage={true}
        />
      </section>

      <motion.section
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Blogs />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <PlanTrip />
      </motion.section>

      {/* Add similar motion wrappers to other sections */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <PopularPlaces />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Exploration />
      </motion.section>

      <section>
        <Footer />
      </section>
    </main>
  );
};

export default Home;
