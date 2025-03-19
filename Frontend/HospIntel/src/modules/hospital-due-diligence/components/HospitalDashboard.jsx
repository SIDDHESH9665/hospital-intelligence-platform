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
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AccreditationStatus from "../accreditation/AccreditationStatus";
import FinancialAssessment from "../financialAss/FinancialAssessment";
import HospitalScore from "../hospitalScore/HospitalScore";
import NegativeScore from "../negativeLegal/NegativeLegal";
import "../styles/dashboard.css";
import Supplimentry from "../Supplimentry/Supplimentry";
import ReportGenerator from "../pdfGenerator/ReportGenerator";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    axios
      .get("/hospitals")
      .then((response) => {
        setHospitals(response.data);
        setHospital(response.data[0]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch hospital data.");
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  const searchHospital = () => {
    if (!search.trim()) {
      showSnackbar("Please enter a valid hospital name or ID.");
      return;
    }

    const foundHospital = hospitals.find((h) => {
      const hospitalName = h.hospital_info.HOSPITAL.toLowerCase().trim();
      const hospitalID = h.hospital_info.ID.toString().trim();
      const searchValue = search.toLowerCase().trim();

      return hospitalName === searchValue || hospitalID === searchValue;
    });

    if (foundHospital) {
      setHospital(foundHospital);
      setError("");
    } else {
      showSnackbar("Hospital not found. Please try again.");
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="container">
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "21px",
          backgroundColor: "#F9F9F9",
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArrowBackIcon
            sx={{ cursor: "pointer", color: "#000" }}
            onClick={() => navigate("/")}
          />
          <img
            src="bajaj-logo2.png"
            alt="bajaj-logo"
            style={{ height: "85px", marginLeft: "10px" }}
          />
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ color: "#000", marginLeft: "auto", marginRight: "auto" }}
        ></Typography>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url(navbg.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(6px)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 2,
          }}
        />
        <Card
          sx={{
            position: "relative",
            padding: "15px",
            backgroundColor: "transparent",
            // boxShadow: 3,
            borderRadius: "8px",
            zIndex: 2,
          }}
        >
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
              Hospital Due Diligence
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#fff", marginTop: "10px", textAlign: "center" }}
            >
              Search and analyze hospital infrastructure and financial status
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <main>
        <section
          style={{
            position: "relative",
          }}
        >
          <Card
            sx={{
              padding: "10px",
              margin: "10px 0",
              backgroundColor: "#f5f5f5",
              boxShadow: 3,
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Hospital Information
                </Typography>
              </Box>
              {loading && (
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
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <img
                        className="hospital"
                        src="/hospital0.png"
                        alt="Hospital Logo"
                        style={{
                          height: "80px",
                          width: "80px",
                          marginRight: "10px",
                        }}
                      />
                      <Box>
                        <Typography
                          fontSize="20px"
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          {hospital.hospital_info.HOSPITAL}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{
                            margin: "2px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Address: {hospital.hospital_info.ADDRESS}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: hospital.hospital_info.CATEGORY
                              ? hospital.hospital_info.CATEGORY.toLowerCase().includes(
                                  "multi"
                                )
                                ? "#CCF8E0"
                                : "#FFF8DC"
                              : "#FFECEC",
                            color: "black",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontWeight: 600,
                            display: "inline-block",
                          }}
                        >
                          {hospital.hospital_info.CATEGORY || "No Category"}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: "#FDF2B4",
                            color: "black",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            fontWeight: 600,
                            display: "inline-block",
                          }}
                        >
                          {hospital.hospital_info.TIER || "No Tier"}
                        </Typography>
                        <Stack
                          spacing={1}
                          style={{
                            margin: "2px",
                          }}
                        >
                          <Rating
                            name="half-rating-read"
                            defaultValue={3.7}
                            precision={0.5}
                            readOnly
                          />
                        </Stack>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "40%",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          padding: "20px",
                        }}
                      >
                        <ReportGenerator hospital={hospital} />
                      </Box>

                      <TextField
                        fullWidth
                        label="Search by hospital name or ID"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchHospital()}
                        sx={{ marginRight: "5px", height: "50px" }}
                        InputProps={{
                          sx: { padding: "10px", height: "50px" },
                        }}
                      />
                      <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        onClick={searchHospital}
                      >
                        Search
                      </Button>
                    </Box>
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
              severity="error"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </section>
        <div
          className="grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <div
            className="card"
            style={{
              flex: "1 1 calc(25% - 20px)",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            {hospital && (
              <CardContent>
                <HospitalScore
                  score={hospital.hospital_info.INFRA_SCORE || 0}
                />
              </CardContent>
            )}
          </div>
          <div
            className="card"
            style={{
              padding: "0px",
              flex: "1 1 calc(25% - 20px)",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            {hospital && (
              <CardContent>
                <FinancialAssessment data={hospital.financial_assessment} />
              </CardContent>
            )}
          </div>
          <div
            className="card"
            style={{
              padding: "0px",
              flex: "1 1 calc(25% - 20px)",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            {hospital && (
              <CardContent>
                <NegativeScore data={hospital.negative_legal} />
              </CardContent>
            )}
          </div>
          <div
            className="card"
            style={{
              padding: "0px",
              flex: "1 1 calc(25% - 20px)",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            {hospital && (
              <CardContent>
                <AccreditationStatus data={hospital.accreditation_status} />
              </CardContent>
            )}
          </div>
        </div>
      </main>
      <div>
        <Supplimentry />
      </div>
      <footer>
        <p>2025 Hospital Due Diligence All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HospitalDashboard;
