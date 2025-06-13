import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import Home from "./pages/home";
import SignIn from "./pages/SignIn";
import HospitalProfiling from "./modules/hospital-profiling/HospitalProfiling";
import HospitalImpactAnalysis from "./modules/hospital-impact-analysis/HospitalImpactAnalysis";
import HospitalDueDiligence from "./modules/hospital-due-diligence/HospitalDueDiligence";
import { initializeAPI } from "./config/api";

const routes = [
  {
    name: "Home",
    path: "/home",
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
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage/sessionStorage for persistence
    const stored = localStorage.getItem('hospintel_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Persist user state
  useEffect(() => {
    if (user) {
      localStorage.setItem('hospintel_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hospintel_user');
    }
  }, [user]);

  useEffect(() => {
    // Initialize API when the app starts
    initializeAPI();
  }, []);

  useEffect(() => {
    // Only show navbar on /home
    setShowNavbar(location.pathname === '/home');
  }, [location.pathname]);

  // Handle direct routes and refreshes
  useEffect(() => {
    const handleDirectAccess = async () => {
      const path = window.location.pathname;
      
      // Initialize API for specific routes
      if (path.includes('hospital-')) {
        try {
          await initializeAPI();
        } catch (error) {
          console.error('Failed to initialize API:', error);
          // Optionally redirect to home on error
          // navigate('/');
        }
      }
    };

    handleDirectAccess();

    // Add event listener for page refresh
    const handleBeforeUnload = () => {
      sessionStorage.setItem('lastPath', location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Check if we're coming back from a refresh
    const lastPath = sessionStorage.getItem('lastPath');
    if (lastPath && lastPath === location.pathname) {
      handleDirectAccess();
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname, navigate]);

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {showNavbar && <Navbar routes={routes} user={user} onLogout={handleLogout} />}
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<SignIn setUser={setUser} />} />
=======
        <Route path="/" element={<SignIn />} />
>>>>>>> 9fc4227303c662db14472e8de2a3c50914ab62ce
        <Route path="/home" element={<Home />} />
        <Route path="/hospital-profiling" element={<HospitalProfiling />} />
        <Route path="/hospital-profiling/:partnerId" element={<HospitalProfiling />} />
        <Route path="/hospital-impact-analysis" element={<HospitalImpactAnalysis />} />
        <Route path="/hospital-impact-analysis/:partnerId" element={<HospitalImpactAnalysis />} />
        <Route path="/hospital-due-diligence/*" element={<HospitalDueDiligence />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-4">The page you're looking for doesn't exist or has been moved.</p>
              <button 
<<<<<<< HEAD
                onClick={() => navigate('/')} 
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
=======
                onClick={() => navigate('/home')} 
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
>>>>>>> 9fc4227303c662db14472e8de2a3c50914ab62ce
                Go Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;
