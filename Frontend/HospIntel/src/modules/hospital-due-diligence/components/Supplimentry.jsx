import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LanguageIcon from "@mui/icons-material/Language";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CategoryIcon from "@mui/icons-material/Category";

function Supplimentry({ hospitalData }) {
  const [selectedCard, setSelectedCard] = React.useState(0);
  
  if (!hospitalData) {
    return null; // Render nothing if hospitalData is not available
  }

  const cards = [
    {
      id: 1,
      title: "Hospital Age",
      description: `${hospitalData.hospital_info.Hospital_Age} years`,
      subtext: "Well-established healthcare provider",
      icon: <LocalHospitalIcon />,
    },
    {
      id: 2,
      title: "Digital Presence",
      description: hospitalData.hospital_info.Hospital_Website || 'N/A',
      subtext: "Active online presence with telemedicine services",
      icon: <LanguageIcon />,
    },
    {
      id: 3,
      title: "Infrastructure Score",
      description: `${hospitalData.hospital_info.INFRA_SCORE}/5.0`,
      subtext: "Modern facilities with latest medical equipment",
      icon: <AssessmentIcon />,
    },
    {
      id: 4,
      title: "Patient Reviews",
      description: `${hospitalData.hospital_info.Patient_Reviews} reviews`,
      subtext: "High patient satisfaction rate",
      icon: <RateReviewIcon />,
    },
  ];

  return (
    <div className="supplementary-strip">
      <Box className="supplementary-grid">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            className={`supplementary-card ${selectedCard === index ? "selected" : ""}`}
            onClick={() => setSelectedCard(index)}
          >
            <CardActionArea sx={{ height: "100%", "&:focus": { outline: "none" } }}>
              <CardContent>
                <Box sx={{ textAlign: "center" }}>
                  {card.icon}
                  <Typography variant="h6" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" color="primary" gutterBottom>
                    {card.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.subtext}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </div>
  );
}

export default Supplimentry;
