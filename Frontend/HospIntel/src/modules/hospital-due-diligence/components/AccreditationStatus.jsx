import React from "react";
import { Box, Typography } from "@mui/material";
import "./AccreditationStatus.css";

const AccreditationStatus = ({ data = {} }) => {
  console.log('AccreditationStatus component data:', data);

  const accreditations = [
    {
      icon: "/img/jci.png",
      label: "JCI",
      status: data.jci?.status || 'Not Available',
    },
    {
      icon: "/img/nabh.png",
      label: "NABH",
      status: data.nabh?.status || 'Not Available',
    },
    {
      icon: "/img/rohini.png",
      label: "ROHINI",
      status: data.rohini?.status || 'Not Available',
    },
  ];

  const getStatusClass = (status) => {
    if (!status || typeof status !== 'string') return "status-pending";
    const statusLower = status.toLowerCase();
    if (statusLower === "accredited") return "status-accredited";
    if (statusLower === "not accredited") return "status-not-accredited";
    return "status-pending";
  };

  const getStatusText = (status) => {
    if (!status || typeof status !== 'string') return "Not Available";
    const statusLower = status.toLowerCase();
    if (statusLower === "accredited") return "Accredited";
    if (statusLower === "not accredited") return "Not Accredited";
    return "Not Available";
  };

  return (
    <div className="accreditation-status-container">
      <Typography variant="h6" className="accreditation-status-title">
        Accreditation Status
      </Typography>
      <Typography variant="body2" className="accreditation-status-description">
        Check hospital accreditation status
      </Typography>
      <div className="accreditation-grid">
        {accreditations.map((accreditation) => (
          <div key={accreditation.label} className="accreditation-item">
            <img src={accreditation.icon} alt={accreditation.label} className="accreditation-icon" />
            <Typography variant="subtitle2" className="accreditation-label">
              {accreditation.label}
            </Typography>
            <Typography 
              variant="body2" 
              className={`accreditation-status ${getStatusClass(accreditation.status)}`}
            >
              {getStatusText(accreditation.status)}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccreditationStatus;
