import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Snackbar,
  Rating,
  Stack,
  Alert,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccreditationStatus from "./components/AccreditationStatus";
import FinancialAssessment from "./components/FinancialAssessment";
import HospitalScore from "./components/HospitalScore";
import NegativeScore from "./components/NegativeLegal";
import Supplimentry from "./components/Supplimentry";
import ReportGenerator from "./components/ReportGenerator";
import { useNavigate } from "react-router-dom";
import { makeAPIRequest } from "../../config/api";
import "./HospitalDueDiligence.css";
import "./components/components.css";
import HospitalRegistrationForm from './components/HospitalRegistrationForm';
import SearchIcon from "@mui/icons-material/Search";

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

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      console.log('Fetching hospitals...');
      const data = await makeAPIRequest('/api/due-diligence/hospitals');
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
  };

  const navigate = useNavigate();

  const handleGoToDefault = () => {
    if (hospitals.length > 0) {
      setHospital(hospitals[0]);
      setError("");
      setSearch("");
    }
  };

  const searchHospital = async () => {
    if (!search.trim()) {
      showSnackbar("Please enter a valid hospital name or ID.", "error");
      return;
    }

    try {
      setIsLoading(true);
      // Try to find by ID first
      const hospitalId = parseInt(search);
      if (!isNaN(hospitalId)) {
        const response = await makeAPIRequest(`/api/due-diligence/hospital/${hospitalId}`);
        if (!response || !response.hospital_info) {
          throw new Error(`Hospital with Partner ID ${hospitalId} not found. Please check the ID and try again.`);
        }
        setHospital(response);
        setError("");
        showSnackbar("Hospital found successfully", "success");
        return;
      }

      // If not an ID, search by name
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
        setError(`Hospital with name "${search}" not found. Please check the name and try again.`);
      }
    } catch (error) {
      console.error('Error searching hospital:', error);
      setHospital(null);
      setError(error.message || "An error occurred while searching for the hospital.");
    } finally {
      setIsLoading(false);
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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await makeAPIRequest('/api/due-diligence/hospitals');
        if (response && response.length > 0) {
          const hospitalData = response[0];
          setHospital(hospitalData);
          
          // Transform data for components
          setHospitalData({
            score: {
              score: hospitalData.hospital_score.score
            },
            financial: hospitalData.financial_assessment,
            legal: hospitalData.negative_legal,
            accreditation: {
              jci_status: hospitalData.accreditation_status.jci.status,
              nabh_status: hospitalData.accreditation_status.nabh.status,
              rohini_status: hospitalData.accreditation_status.rohini.status
            }
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load hospital data");
        showSnackbar("Failed to load hospital data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <ArrowBackIcon
            sx={{ cursor: "pointer", color: "#666", marginRight: 2 }}
            onClick={() => navigate("/")}
          />
          <img
            src="/img/bajaj-logo2.png"
            alt="bajaj-logo"
            className="hospital-due-diligence-logo"
          />
        </Box>
        <Box className="hospital-due-diligence-search">
          <input
            type="text"
            placeholder="Search by Hospital ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchHospital()}
          />
          <Button
            className="hospital-due-diligence-search-button"
            onClick={searchHospital}
            sx={{ color: '#666' }}
          >
            <SearchIcon />
          </Button>
        </Box>
      </Box>

      <Box className="hospital-due-diligence-hero">
        <Box className="hospital-due-diligence-hero-content">
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Hospital Due Diligence
          </Typography>
          <Typography variant="body1">
            Search and analyze hospital infrastructure and financial status
          </Typography>
        </Box>
      </Box>

      <main className="hospital-due-diligence-main">
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="not-found-container">
            <Typography variant="h5" className="error-message-title" gutterBottom>
              Oops! Hospital Not Found
            </Typography>
            <Typography className="error-message-details">
              Hospital with ID {search} not found. Please check the ID and try again.
            </Typography>
            <Box className="not-found-actions">
              <Button
                variant="outlined"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
              <Button
                variant="contained"
                onClick={handleGoToDefault}
                color="primary"
              >
                Go to Default
              </Button>
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
                Submit Request
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <section>
              <Card className="hospital-due-diligence-card">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                      flexWrap: "wrap",
                      gap: "10px"
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Hospital Information
                    </Typography>
                    {hospital && <ReportGenerator hospital={hospital} />}
                  </Box>
                  {isLoading && (
                    <Typography variant="body2">
                      Loading hospital data...
                    </Typography>
                  )}
                  {error && (
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  )}
                  {hospital && (
                    <Box className="hospital-due-diligence-hospital-info">
                      <img
                        className="hospital-due-diligence-hospital-logo"
                        src="/img/hospital0.png"
                        alt="Hospital Logo"
                      />
                      <Box className="hospital-due-diligence-hospital-details">
                        <Typography className="hospital-due-diligence-hospital-name">
                          {hospital.hospital_info.HOSPITAL}
                        </Typography>
                        <Typography className="hospital-due-diligence-hospital-address">
                          Address: {hospital.hospital_info.ADDRESS}
                        </Typography>
                        <Typography
                          className={`hospital-due-diligence-badge hospital-due-diligence-badge-category`}
                        >
                          {hospital.hospital_info.CATEGORY || "No Category"}
                        </Typography>
                        <Typography className="hospital-due-diligence-badge hospital-due-diligence-badge-tier">
                          {hospital.hospital_info.TIER || "No Tier"}
                        </Typography>
                        <Stack spacing={1} style={{ margin: "2px" }}>
                          <Rating
                            name="half-rating-read"
                            defaultValue={hospital.hospital_info.INFRA_SCORE}
                            precision={0.5}
                            readOnly
                          />
                        </Stack>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </section>
            <div className="due-diligence-grid">
              <div className="due-diligence-grid-item">
                <Card>
                  <CardContent>
                    <HospitalScore data={hospitalData?.score} />
                  </CardContent>
                </Card>
              </div>
              <div className="due-diligence-grid-item">
                <Card>
                  <CardContent>
                    <FinancialAssessment data={hospitalData?.financial} />
                  </CardContent>
                </Card>
              </div>
              <div className="due-diligence-grid-item">
                <Card>
                  <CardContent>
                    <NegativeScore data={hospitalData?.legal} />
                  </CardContent>
                </Card>
              </div>
              <div className="due-diligence-grid-item">
                <Card>
                  <CardContent>
                    <AccreditationStatus data={hospitalData?.accreditation} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
      <div>
        <Supplimentry />
      </div>
      <footer className="hospital-due-diligence-footer">
        <p>2025 Hospital Due Diligence All Rights Reserved</p>
      </footer>

      <HospitalRegistrationForm
        open={registrationFormOpen}
        onClose={() => setRegistrationFormOpen(false)}
        title="Submit Request"
      />
    </div>
  );
};

export default HospitalDueDiligence;
