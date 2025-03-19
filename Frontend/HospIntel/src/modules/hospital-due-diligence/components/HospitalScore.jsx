import React from 'react';
import { Typography, Box } from '@mui/material';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const HospitalScore = ({ data }) => {
  // Convert percentage score to score out of 10
  const percentageScore = data?.score || 0;
  const score = (percentageScore / 10).toFixed(1);

  // Determine rating and color based on score
  const getRatingInfo = (score) => {
    if (score >= 8) return { text: 'Excellent', color: '#4CAF50' };
    if (score >= 6.5) return { text: 'Good', color: '#2196F3' };
    if (score >= 5) return { text: 'Average', color: '#FFC107' };
    return { text: 'Needs Improvement', color: '#f44336' };
  };

  const { text: ratingText, color: ratingColor } = getRatingInfo(score);
  const data_score = [{ value: percentageScore }];

  return (
    <div className="score-container">
      <Typography variant="h6" className="score-title">
        Hospital Score
      </Typography>
      <Typography variant="body2" className="score-description">
        Overall hospital performance score based on multiple parameters
      </Typography>
      
      <div className="gauge-container">
        <RadialBarChart
          width={400}
          height={240}
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="100%"
          barSize={18}
          data={data_score}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            clockWise
            dataKey="value"
            cornerRadius={15}
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F26E88" />
              <stop offset="100%" stopColor="#245FE6" />
            </linearGradient>
          </defs>
        </RadialBarChart>
        
        <div className="score-value">
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
            <Typography 
              variant="h4" 
              className="score-number"
              sx={{ 
                color: ratingColor,
                fontSize: {
                  xs: '1.5rem',
                  sm: '1.5rem',
                  md: '1.5rem'
                },
                lineHeight: 1,
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}
            >
              {score}
            </Typography>
            <Typography 
              variant="h6"
              sx={{
                color: ratingColor,
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem',
                  md: '1.125rem'
                },
                fontWeight: 500,
                marginLeft: '4px',
                marginTop: '8px'
              }}
            >
              /10
            </Typography>
          </Box>
          <Typography 
            variant="body2"
            sx={{
              color: ratingColor,
              fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '0.875rem'
              },
              fontWeight: 500,
              letterSpacing: '0.5px',
              marginTop: '4px'
            }}
          >
            {ratingText}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default HospitalScore;