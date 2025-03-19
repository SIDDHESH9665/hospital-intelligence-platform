import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HospitalRegistrationForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    pan: '',
    gstin: '',
    hospitalName: '',
    address: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          pan: '',
          gstin: '',
          hospitalName: '',
          address: '',
          pincode: '',
        });
      }, 2000);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>
        Submit Request
      </DialogTitle>
      <DialogContent>
        {success ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Request Submitted Successfully!
            </Typography>
            <Typography color="textSecondary">
              We will process your request shortly.
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="PAN Number"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="GSTIN"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Hospital Name"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={3}
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              disabled={loading}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #00BCD4 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #00ACC1 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
              boxShadow: 'none'
            }
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HospitalRegistrationForm; 