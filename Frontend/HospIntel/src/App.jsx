import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import Home from "./pages/home";
import HospitalProfiling from "./modules/hospital-profiling/HospitalProfiling";
import HospitalImpactAnalysis from "./modules/hospital-impact-analysis/HospitalImpactAnalysis";
import HospitalDueDiligence from "./modules/hospital-due-diligence/HospitalDueDiligence";
import { initializeAPI } from "./config/api";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Services",
    path: "#",
  },
  {
    name: "Contact Us",
    href: "#contact",
  },
  {
    name: "About Us",
    href: "#about",
  },
];

export function App() {
  const location = useLocation();
  const showNavbar = !location.pathname.includes('/hospital-impact-analysis');

  useEffect(() => {
    // Initialize API when the app starts
    initializeAPI();
  }, []);

  return (
    <>
      {showNavbar && <Navbar routes={routes} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospital-profiling" element={<HospitalProfiling />} />
        <Route path="/hospital-impact-analysis" element={<HospitalImpactAnalysis />} />
        <Route path="/due-diligence" element={<HospitalDueDiligence />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
