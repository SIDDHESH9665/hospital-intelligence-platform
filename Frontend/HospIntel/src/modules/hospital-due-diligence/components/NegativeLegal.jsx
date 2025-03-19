import React from "react";
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
  const getStatusInfo = (status, count = 0, severity = '') => {
    if (severity.toLowerCase() === 'moderate') {
      return {
        icon: <WarningIcon style={{ color: '#FFA500' }} />,
        color: '#FFA500',
        text: `Blacklist Count: ${count}`,
        severity: 'Severity: Moderate'
      };
    }
    
    if (status === 'Active') {
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

  const negativeItems = [
    {
      logo: blacklist,
      title: 'Negative Status',
      status: 'Moderate',
      count: 2,
      severity: 'Moderate',
      details: []
    },
    {
      logo: pmjay,
      title: 'PMJAY Status',
      status: 'Active',
      details: []
    },
    {
      logo: criminal,
      title: 'Criminal Case',
      status: 'Active Lawsuit (2)',
      details: [
        'Medical malpractice case filed on Jan 15, 2024',
        'Emergency service delivery violations'
      ]
    },
    {
      logo: civil,
      title: 'Civil Case',
      status: 'Regulatory Warning',
      details: [
        'Compliance warning issued by State Board',
        'Due for review in March 2024'
      ]
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