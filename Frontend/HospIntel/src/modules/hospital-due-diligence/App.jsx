import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import HospitalDashboard from "./components/hospitalDashboard/HospitalDashboard";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<HospitalDashboard />} />
    </Routes>
  </Router>
);

export default App;
