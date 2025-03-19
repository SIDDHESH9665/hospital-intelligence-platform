import React from "react";
import { Box, Typography } from "@mui/material";
import "./AccreditationStatus.css";

const AccreditationStatus = ({ data }) => {
  const accreditations = [
    {
      icon: "/img/jci.png",
      label: "JCI",
      status: data?.jci_status || "Not Available",
    },
    {
      icon: "/img/nabh.png",
      label: "NABH",
      status: data?.nabh_status || "Not Available",
    },
    {
      icon: "/img/rohini.png",
      label: "ROHINI",
      status: data?.rohini_status || "Not Available",
    },
  ];

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "accredited") return "accredited";
    if (statusLower === "not accredited") return "not-accredited";
    return "pending";
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
        <div className="accreditation-item">
          <img src="/img/jci.png" alt="JCI" className="accreditation-icon" />
          <Typography variant="subtitle2" className="accreditation-label">
            JCI
          </Typography>
          <Typography variant="body2" className="accreditation-status status-pending">
            Not Available
          </Typography>
        </div>
        <div className="accreditation-item">
          <img src="/img/nabh.png" alt="NABH" className="accreditation-icon" />
          <Typography variant="subtitle2" className="accreditation-label">
            NABH
          </Typography>
          <Typography variant="body2" className="accreditation-status status-pending">
            Not Available
          </Typography>
        </div>
        <div className="accreditation-item">
          <img src="/img/rohini.png" alt="ROHINI" className="accreditation-icon" />
          <Typography variant="subtitle2" className="accreditation-label">
            ROHINI
          </Typography>
          <Typography variant="body2" className="accreditation-status status-pending">
            Not Available
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default AccreditationStatus;
