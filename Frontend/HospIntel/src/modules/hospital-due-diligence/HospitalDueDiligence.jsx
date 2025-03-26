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
import HospitalRegistrationForm from './components/HospitalRegistrationForm';
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

  const searchHospitalById = async () => {
    const hospitalId = parseInt(search);
    if (isNaN(hospitalId)) {
      return showSnackbar("Please enter a valid Hospital ID.", "error");
    }
    setIsLoading(true);
    await fetchHospitalById(hospitalId);
  };

  const searchHospitalByName = async () => {
    if (!search.trim()) {
      showSnackbar("Please enter a valid hospital name.", "error");
      return;
    }

    const foundHospital = hospitals.find((h) => {
      const hospitalName = h.hospital_info.HOSPITAL.toLowerCase().trim();
      const searchValue = search.toLowerCase().trim();
      return hospitalName.includes(searchValue);
    });

    if (foundHospital) {
      setHospital(foundHospital);
      setError("");
      showSnackbar("Hospital found successfully", "success");
    } else {
      setHospital(null);
      setError(`Hospital with name "${search}" not found.`);
    }
  };

  const searchHospital = async () => {
    if (!search.trim()) {
      showSnackbar("Please enter a valid hospital name or ID.", "error");
      return;
    }
    
    const hospitalId = parseInt(search);
    if (!isNaN(hospitalId)) {
      return searchHospitalById(); // Search by ID
    }

    await searchHospitalByName(); // Search by name
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
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="hospital-due-diligence-container">
      <Box className="hospital-due-diligence-header">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArrowBackIcon sx={{ cursor: "pointer", color: "#666", marginRight: 2 }} onClick={() => navigate("/")} />
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
          <Button className="hospital-due-diligence-search-button" onClick={searchHospital} sx={{ color: '#666' }}>
            <SearchIcon />
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
            <Typography className="error-message-details">Hospital with ID {search} not found. Please check the ID and try again.</Typography>
            <Box className="not-found-actions">
              <Button variant="outlined" onClick={() => setSearch("")}>Clear Search</Button>
              <Button variant="contained" onClick={handleGoToDefault} color="primary">Go to Default</Button>
              <Button variant="contained" onClick={() => setRegistrationFormOpen(true)} sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #00BCD4 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #00ACC1 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
                }
              }}>Submit Request</Button>
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

      <HospitalRegistrationForm open={registrationFormOpen} onClose={() => setRegistrationFormOpen(false)} title="Submit Request" />
    </div>
  );
};

export default HospitalDueDiligence;
