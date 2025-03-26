import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import "./NegativeLegal.css";
import criminal from '/img/criminal.png';
import civil from '/img/civil.png';
import blacklist from '/img/blacklist.png';
import pmjay from '/img/pmjay.png';

const NegativeLegal = ({ data }) => {
  const [error, setError] = useState(null);
  console.log('NegativeLegal component data:', data);
  console.log('Blacklist Data:', data.blacklist);
  console.log('PMJAY Status:', data.pmjay_status);
  console.log('Criminal Case:', data.legal_status.criminal_case);
  console.log('Civil Case:', data.legal_status.civil_case);

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="body2" color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Typography variant="body2">Loading...</Typography>
      </Box>
    );
  }

  const getStatusInfo = (status, count = 0, severity = '') => {
    if (severity.toLowerCase() === 'low') {
      return {
        icon: <WarningIcon style={{ color: '#22c55e' }} />,
        color: '#22c55e',
        text: `Blacklist Count: ${count}`,
        severity: 'Severity: Low'
      };
    }
    if (severity.toLowerCase() === 'moderate') {
      return {
        icon: <WarningIcon style={{ color: '#FFA500' }} />,
        color: '#FFA500',
        text: `Blacklist Count: ${count}`,
        severity: 'Severity: Moderate'
      };
    }
    if (severity.toLowerCase() === 'high') {
      return {
        icon: <WarningIcon style={{ color: '#F44336' }} />,
        color: '#F44336',
        text: `Blacklist Count: ${count}`,
        severity: 'Severity: High'
      };
    }
    
    
    if (status === 'Accredited') {
      return {
        icon: <CheckCircleIcon style={{ color: '#4CAF50' }} />,
        color: '#4CAF50',
        text: status
      };
    }
    
    if (status?.includes('Active Lawsuit')) {
      return {
        icon: <ErrorIcon style={{ color: '#F44336' }} />,
        color: '#F44336',
        text: status
      };
    }

    if (status?.includes('Regulatory Warning')) {
      return {
        icon: <WarningIcon style={{ color: '#FFA500' }} />,
        color: '#FFA500',
        text: status
      };
    }
    
    return {
      icon: <WarningIcon style={{ color: '#757575' }} />,
      color: '#757575',
      text: 'Not Available'
    };
  };

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="body2" color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Typography variant="body2">Loading...</Typography>
      </Box>
    );
  }

  const negativeItems = [
    {
      logo: blacklist,
      title: 'Negative Status',
      status: data.blacklist.severity,
      count: data.blacklist.count,
      severity: data.blacklist.severity,
      details: []
    },
    {
      logo: pmjay,
      title: 'PMJAY Status',
      status: data.pmjay_status,
      details: []
    },
    {
      logo: criminal,
      title: 'Criminal Case',
      status: data.legal_status.criminal_case.status,
      details: [data.legal_status.criminal_case.details]
    },
    {
      logo: civil,
      title: 'Civil Case',
      status: data.legal_status.civil_case.status,
      details: [data.legal_status.civil_case.details]
    }
  ];

  return (
    <div className="negative-legal-container">
      <Box className="negative-legal-header">
        <Typography variant="h6" className="negative-legal-title">
          Blacklist & Legal
        </Typography>
        <Typography variant="body2" className="negative-legal-description">
          Check for negative and legal issues associated with the hospital.
        </Typography>
      </Box>
      
      <div className="negative-legal-content">
        {negativeItems.map((item, index) => {
          const statusInfo = getStatusInfo(item.status, item.count, item.severity);
          
            return (
            <div key={index} className="negative-legal-item">
              <div className="negative-legal-item-main">
                <img 
                  src={item.logo} 
                  alt={item.title} 
                  className={`negative-legal-logo ${item.title === 'PMJAY Status' ? 'pmjay-logo' : ''}`}
                />
                <div className="negative-legal-details">
                  <Typography variant="subtitle2" className="negative-legal-item-title">
                    {item.title}
                  </Typography>
                  {item.count > 0 && (
                    <Typography className="negative-legal-count" style={{ color: statusInfo.color }}>
                      {statusInfo.text}
                    </Typography>
                  )}
                  {item.severity && (
                    <Typography className="negative-legal-severity" style={{ color: statusInfo.color }}>
                      {statusInfo.severity}
                    </Typography>
                  )}
                  {!item.count && !item.severity && (
                    <Typography className="negative-legal-status-text" style={{ color: statusInfo.color }}>
                      {statusInfo.text}
                    </Typography>
                  )}
                </div>
              </div>
              {item.details && item.details.length > 0 && (
                <div className={`negative-legal-details-box ${item.status.toLowerCase().includes('warning') ? 'warning' : 'error'}`}>
                  {item.details.map((detail, idx) => (
                    <Typography key={idx} className="negative-legal-detail-text">
                      {detail}
                    </Typography>
                  ))}
                </div>
              )}
              </div>
            );  
          })}
      </div>
    </div>
  );
};

export default NegativeLegal;