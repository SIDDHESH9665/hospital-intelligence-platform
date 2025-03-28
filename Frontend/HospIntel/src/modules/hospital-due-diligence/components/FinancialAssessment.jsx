import React from "react";
import { Box, Typography } from "@mui/material";
import gstIcon from "/img/gst.png";
import panIcon from "/img/pan-card.png";
import epfoIcon from "/img/epfo.png";
import "./FinancialAssessment.css";

const getStatusColor = (status) => {
  if (!status) return "#FFA500"; // orange for undefined/null
  const statusValue = typeof status === 'object' ? status.status : status;
  switch (statusValue.toLowerCase()) {
    case "valid":
    case "valid (active)":
      return "#4CAF50"; // green
    case "invalid":
    case "not found":
      return "#F44336"; // red
    default:
      return "#FFA500"; // orange
  }
};

const FinancialAssessment = ({ data }) => {
  const financialMetrics = [
    {
      icon: gstIcon,
      label: "GST Status",
      status: data?.gst_status,
    },
    {
      icon: panIcon,
      label: "PAN Status",
      status: data?.pan_status,
      type: data?.pan_status?.type,
    },
    {
      icon: epfoIcon,
      label: "EPFO Status",
      status: data?.epfo_status,
    },
  ];

  return (
    <div className="financial-assessment-container">
      <Typography variant="h6" className="financial-assessment-title">
        Financial Assessment
      </Typography>
      <Typography variant="body2" className="financial-assessment-description">
        View the financial metrics and assessment
      </Typography>
      <Box className="financial-metrics-grid">
        {financialMetrics.map((metric, index) => (
          <Box key={index} className="financial-metric-item">
            <img src={metric.icon} alt={metric.label} className="financial-metric-icon" />
            <Typography className="financial-metric-label">{metric.label}</Typography>
            <Typography 
              className="financial-metric-status"
              style={{ color: getStatusColor(metric.status) }}
            >
              {typeof metric.status === 'object' ? metric.status.status : metric.status || 'Not Available'}
            </Typography>
            {metric.type && (
              <Typography
                className="financial-metric-type"
                style={{
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  color: '#22304D',
                  backgroundColor: '#f1f1f1',
                  padding: '2px 4px',
                  borderRadius: 4
                }}
              >
                Type: {metric.type}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default FinancialAssessment;
