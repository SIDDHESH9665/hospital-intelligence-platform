import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const HospitalReport = () => {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  
  const generateReport = (type) => {
    
    console.log(`Generating ${type} report...`);
    setReportType(type);
    setOpen(true);
    
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Card
      sx={{
        padding: '20px',
        margin: '20px 0',
        backgroundColor: '#f5f5f5',
        boxShadow: 3,
        borderRadius: '8px',
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Generate Reports
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => generateReport('Hospital')}
          >
            Generate Hospital Report
          </Button>
        </Box>
      </CardContent>

      {/* Snackbar to show the success message */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {`${reportType} report generated successfully!`}
        </MuiAlert>
      </Snackbar>
    </Card>
  );
};

export default HospitalReport;
