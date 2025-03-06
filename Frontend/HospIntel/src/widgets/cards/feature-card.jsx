import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import SpotlightCard from "./SpotlightCard";

export function FeatureCard({ color, icon, title, description, link }) {
  const navigate = useNavigate();

  const handleGetReport = () => {
    console.log('Navigating to:', link); // Debug log
    navigate(link, { replace: true });
  };

  return (
    <SpotlightCard 
      className="with-border relative overflow-hidden" 
      spotlightColor={`rgba(${color === 'blue' ? '0, 229, 255' : color === 'green' ? '0, 255, 0' : '128, 128, 128'}, 0.3)`}
    >
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/img/pattern.png')] bg-cover bg-center filter blur-sm opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full text-center">
        <div className="flex-shrink-0 mb-6">
          <IconButton
            variant="gradient"
            size="lg"
            color={color}
            className="pointer-events-none h-20 w-20 rounded-2xl shadow-lg"
          >
            {React.cloneElement(icon, {
              className: "w-10 h-10 text-white",
            })}
          </IconButton>
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto mb-8">
          <Typography variant="h4" className="text-white font-bold mb-4">
            {title}
          </Typography>
          <Typography className="text-base font-normal text-blue-gray-200">
            {description}
          </Typography>
        </div>
        <div>
          <Button
            variant="gradient"
            color={color}
            size="lg"
            className="px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            onClick={handleGetReport}
          >
            Get Report
          </Button>
        </div>
      </div>
    </SpotlightCard>
  );
}

FeatureCard.defaultProps = {
  color: "blue",
};

FeatureCard.propTypes = {
  color: PropTypes.oneOf([
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  link: PropTypes.string.isRequired,
};

FeatureCard.displayName = "/src/widgets/layout/feature-card.jsx";

export default FeatureCard;
