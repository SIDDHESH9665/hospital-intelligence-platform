import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Card, CardContent, TextField, Snackbar, Rating, Stack, Alert, Typography, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import AccreditationStatus from "./components/AccreditationStatus";
import FinancialAssessment from "./components/FinancialAssessment";
import HospitalScore from "./components/HospitalScore";
import NegativeScore from "./components/NegativeLegal";
import Supplimentry from "./components/Supplimentry";
import ReportGenerator from "./components/ReportGenerator";
import { useNavigate } from "react-router-dom";
import "./HospitalDueDiligence.css";
import "./components/components.css";
import ReportRequestForm from '@/components/ReportRequestForm';
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from '@mui/icons-material/Layers';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';

const HospitalDueDiligence = () => {  
  const [hospitals, setHospitals] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [registrationFormOpen, setRegistrationFormOpen] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showNotFoundPopup, setShowNotFoundPopup] = useState(false);

  const fetchHospitals = useCallback(async () => {
    try {
      console.log('Fetching hospitals...');
      const response = await fetch('/api/due-diligence/hospitals');
      const data = await response.json();
      console.log('Hospitals response:', data);
      setHospitals(data);
      if (data.length > 0) {
        setHospital(data[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError("Failed to fetch hospital data.");
      setIsLoading(false);
      showSnackbar("Failed to fetch hospital data", "error");
    }
  }, []);

  const fetchHospitalById = useCallback(async (hospitalId) => {
    try {
      const response = await fetch(`/api/due-diligence/hospital/${hospitalId}`);
      if (!response.ok) {
        throw new Error(`Hospital with ID ${hospitalId} not found.`);
      }
      const data = await response.json();
      console.log('Fetched hospital data:', data);
      setHospitalData({
        hospital_info: { ...data.hospital_info },
        hospital_score: { ...data.hospital_score },
        financial_assessment: { ...data.financial_assessment },
        negative_legal: { ...data.negative_legal },
        accreditation_status: { ...data.accreditation_status }
      });
      console.log('Structured hospitalData:', {
        hospital_info: { ...data.hospital_info },
        hospital_score: { ...data.hospital_score },
        financial_assessment: { ...data.financial_assessment },
        negative_legal: { ...data.negative_legal },
        accreditation_status: { ...data.accreditation_status }
      });
      console.log('Negative Legal Data:', data.negative_legal);
      setError("");
      showSnackbar("Hospital found successfully", "success");
    } catch (error) {
      console.error('Error fetching hospital by ID:', error);
      setHospitalData(null);
      setError(error.message || "An error occurred while fetching the hospital.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchHospital = async () => {
    if (!search.trim()) {
      showSnackbar("Please enter a valid hospital name or ID.", "error");
      return;
    }
    
    const hospitalId = parseInt(search);
    if (!isNaN(hospitalId)) {
      // Search by ID - check if exists in hospitals list first
      const found = hospitals.find(h => h.hospital_info.ID === hospitalId);
      if (!found) {
        setPopupMessage(`Hospital with ID ${search} not found. Please check the ID and try again.`);
        setShowNotFoundPopup(true);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/due-diligence/hospital/${hospitalId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Hospital with ID ${hospitalId} not found. Please check the ID and try again.`);
          }
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (!data || !data.hospital_info) {
          throw new Error(`No data found for Hospital with ID ${hospitalId}`);
        }
        setHospitalData({
          hospital_info: { ...data.hospital_info },
          hospital_score: { ...data.hospital_score },
          financial_assessment: { ...data.financial_assessment },
          negative_legal: { ...data.negative_legal },
          accreditation_status: { ...data.accreditation_status }
        });
        setError(null);
        showSnackbar("Hospital found successfully", "success");
      } catch (error) {
        console.error('Error fetching hospital by ID:', error);
        setHospitalData(null);
        setError(error.message || "An error occurred while fetching the hospital.");
        setRegistrationFormOpen(false);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Search by name
    const searchValue = search.toLowerCase().trim();
    const foundByName = hospitals.find((h) => {
      const hospitalName = h.hospital_info.HOSPITAL.toLowerCase().trim();
      return hospitalName.includes(searchValue);
    });

    if (!foundByName) {
      setPopupMessage(`Hospital with name "${search}" not found. Please check the name and try again.`);
      setShowNotFoundPopup(true);
      return;
    }

    if (foundByName) {
      setHospital(foundByName);
      setError(null);
      showSnackbar("Hospital found successfully", "success");
    } else {
      setHospital(null);
      setError(`Hospital with name "${search}" not found. Would you like to request a report for this hospital?`);
      setRegistrationFormOpen(false);
    }
  };

  const showSnackbar = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const navigate = useNavigate();

  const handleGoToDefault = () => {
    if (hospitals.length > 0) {
      setHospital(hospitals[0]);
      setError("");
      setSearch("");
    }
  };

  // Change this useEffect to prevent the loop
  useEffect(() => {
    if (hospital && !hospitalData) {  // Only fetch if we don't have data yet
      const fetchData = async () => {
        try {
          setIsLoading(true);
          await fetchHospitalById(hospital.hospital_info.ID);
        } catch (err) {
          setError(err.message || "Failed to load hospital data");
          showSnackbar("Failed to load hospital data", "error");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [hospital, fetchHospitalById, hospitalData]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Multi-Specialty':
        return 'rgba(255, 87, 34, 0.7)'; // Subtle orange
      case 'Single-Specialty':
        return 'rgba(76, 175, 80, 0.7)'; // Subtle green
      default:
        return 'rgba(158, 158, 158, 0.7)'; // Subtle gray
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Primary':
        return 'rgba(33, 150, 243, 0.7)'; // Subtle blue
      case 'Secondary':
        return 'rgba(255, 193, 7, 0.7)'; // Subtle yellow
      case 'Tertiary':
        return 'rgba(103, 58, 183, 0.7)'; // Subtle purple
      default:
        return 'rgba(158, 158, 158, 0.7)'; // Subtle gray
    }
  };

  console.log('HospitalData before rendering NegativeLegal:', hospitalData);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Hospital Not Found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleGoToDefault}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Default Hospital
            </button>
            <button 
              onClick={() => {
                setSearch('');
                setError(null);
              }}
              className="px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Try Another ID
            </button>
            <button 
              onClick={() => setRegistrationFormOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md"
            >
              Request Report
            </button>
          </div>
        </div>
        <ReportRequestForm 
          isOpen={registrationFormOpen}
          onClose={() => setRegistrationFormOpen(false)}
          hospitalId={search}
          title="Submit Request"
        />
      </div>
    );
  }

  return (
    <div className="hospital-due-diligence-container">
      <Box className="hospital-due-diligence-header">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArrowBackIcon sx={{ cursor: "pointer", color: "#666", marginRight: 2 }} onClick={() => navigate("/home")} />
          <img src="/img/bajaj-logo2.png" alt="bajaj-logo" className="hospital-due-diligence-logo" />
        </Box>
        <Box className="hospital-due-diligence-search">
          <input
            type="text"
            placeholder="Search by Hospital ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchHospital()}
          />
          <Button className="hospital-due-diligence-search-button" onClick={searchHospital} sx={{ color: '#666', ml: 1 }}>
            <SearchIcon />
            Search
          </Button>
        </Box>
      </Box>

      <Box className="hospital-due-diligence-hero">
        <Box className="hospital-due-diligence-hero-content">
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>Hospital Due Diligence</Typography>
          <Typography variant="body1">Search and analyze hospital infrastructure and financial status</Typography>
        </Box>
      </Box>

      <main className="hospital-due-diligence-main">
        {error ? (
          <Box className="not-found-container">
            <Typography variant="h5" className="error-message-title" gutterBottom>
              Oops! Hospital Not Found
            </Typography>
            <Typography className="error-message-details">{error}</Typography>
            <Box className="not-found-actions">
              <Button variant="outlined" onClick={() => setSearch("")}>Clear Search</Button>
              <Button variant="contained" onClick={handleGoToDefault} color="primary">Go to Default</Button>
              <Button 
                variant="contained" 
                onClick={() => setRegistrationFormOpen(true)} 
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #00BCD4 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #00ACC1 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
                  }
                }}
              >
                Request Report
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <section>
              <Card className="hospital-due-diligence-card">
                <CardContent>
                  <Box className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
                    <Grid container spacing={2} alignItems="center">
                      {hospitalData && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h4" className="text-xl sm:text-3xl font-bold text-gray-800">{hospitalData.hospital_info.HOSPITAL}</Typography>
                          <Box className="mt-2 text-sm sm:text-base text-gray-600 space-y-1">
                            <Box className="flex items-center gap-2">
                              <LocationOnIcon className="text-gray-500" />
                              <Typography variant="body1">{hospitalData.hospital_info.ADDRESS}</Typography>
                            </Box>
                            <Box className="flex items-center gap-2">
                              <Typography variant="body1" sx={{ color: 'black', fontSize: { xs: '0.75rem', sm: '1rem' } }}>Category: </Typography>
                              <Typography variant="body1" sx={{
                                backgroundColor: getCategoryColor(hospitalData.hospital_info.CATEGORY),
                                borderRadius: '4px',
                                padding: '4px 12px',
                                color: 'white',
                                border: '1px solid transparent',
                                fontSize: { xs: '0.75rem', sm: '1rem' },
                                '&:hover': {
                                  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
                                }
                              }}>{hospitalData.hospital_info.CATEGORY}</Typography>
                              <Typography variant="body1" sx={{ color: 'black', fontSize: { xs: '0.75rem', sm: '1rem' } }}>Tier: </Typography>
                              <Typography variant="body1" sx={{
                                backgroundColor: getTierColor(hospitalData.hospital_info.TIER),
                                borderRadius: '4px',
                                padding: '4px 12px',
                                color: 'white',
                                border: '1px solid transparent',
                                fontSize: { xs: '0.75rem', sm: '1rem' },
                                '&:hover': {
                                  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
                                }
                              }}>{hospitalData.hospital_info.TIER}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={12} sm={6} className="flex flex-col items-end justify-end h-full">
                        {hospitalData && <ReportGenerator hospital={hospitalData} />}
                      </Grid>
                    </Grid>
                  </Box>
                  <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>{snackbarMessage}</Alert>
                  </Snackbar>
                </CardContent>
              </Card>
            </section>
            <div className="due-diligence-grid">
              <div className="due-diligence-grid-item">
                <Card><CardContent><HospitalScore data={hospitalData?.hospital_score} /></CardContent></Card>
              </div>
              <div className="due-diligence-grid-item">
                <Card><CardContent><FinancialAssessment data={hospitalData?.financial_assessment} /></CardContent></Card>
              </div>
              <div className="due-diligence-grid-item">
                <Card><CardContent>{hospitalData?.negative_legal && <NegativeScore data={hospitalData.negative_legal} />}</CardContent></Card>
              </div>
              <div className="due-diligence-grid-item">
                <Card><CardContent><AccreditationStatus data={hospitalData?.accreditation_status} /></CardContent></Card>
              </div>
            </div>
          </>
        )}
      </main>
      <div><Supplimentry hospitalData={hospitalData} /></div>
      <footer className="hospital-due-diligence-footer">
        <p>2025 Hospital Due Diligence All Rights Reserved</p>
      </footer>

      <ReportRequestForm 
        isOpen={registrationFormOpen}
        onClose={() => setRegistrationFormOpen(false)}
        hospitalId={search}
        title="Submit Request"
      />
      
      {showRequestForm && (
        <ReportRequestForm isOpen={showRequestForm} onClose={() => setShowRequestForm(false)} />
      )}
      
      {showNotFoundPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Hospital Not Found</h3>
            <p className="text-gray-600 mb-6">{popupMessage || `Hospital with ID or Name ${search} not found. Please check and try again.`}</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setShowNotFoundPopup(false); setShowRequestForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded">Request Report</button>
              <button onClick={() => { setShowNotFoundPopup(false); setSearch(hospitals[0]?.hospital_info?.ID?.toString() || ''); handleGoToDefault(); }} className="px-4 py-2 bg-green-600 text-white rounded">Try Default ID</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDueDiligence;