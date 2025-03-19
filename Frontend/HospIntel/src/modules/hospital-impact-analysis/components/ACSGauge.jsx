import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Activity } from 'lucide-react';

// Color mapping for Tailwind classes
const tailwindColorMap = {
  'bg-red-500': '#EF4444',
  'bg-orange-500': '#F97316',
  'bg-yellow-500': '#EAB308',
  'bg-green-500': '#22C55E'
};

const ACSGauge = ({ 
  averageClaimSizeData = [], 
  alternativeHospitals = [] 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Extract ACS values, defaulting to 0 if no data
  const acsValue = averageClaimSizeData.length > 0 
    ? averageClaimSizeData[0].total_acs 
    : 0;

  const medicalAcsValue = averageClaimSizeData.length > 0 
    ? averageClaimSizeData[0].medical_acs 
    : 0;

  const surgicalAcsValue = averageClaimSizeData.length > 0 
    ? averageClaimSizeData[0].surgical_acs 
    : 0;

  // Panel data configuration
  const panelData = [
    { label: 'Current ACS', value: acsValue },
    { label: 'Medical ACS', value: medicalAcsValue },
    { label: 'Surgical ACS', value: surgicalAcsValue }
  ];

  // Effect for auto-sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % panelData.length);
        setIsTransitioning(false);
      },0);
    }, 5000);

    return () => clearInterval(interval);
  }, [panelData.length]);

  // Comprehensive threshold configuration
  const thresholds = {
    levels: [
      {
        name: 'CRITICAL',
        minValue: 150000,
        maxValue: 210000,
        colors: {
          background: 'bg-red-100',
          text: 'text-red-700',
          dot: 'bg-red-500'
        },
        description: 'Significantly above network average'
      },
      {
        name: 'HIGH RISK',
        minValue: 100000,
        maxValue: 150000,
        colors: {
          background: 'bg-orange-100',
          text: 'text-orange-700',
          dot: 'bg-orange-500'
        },
        description: 'Above network average'
      },
      {
        name: 'MODERATE',
        minValue: 60000,
        maxValue: 100000,
        colors: {
          background: 'bg-yellow-100',
          text: 'text-yellow-700',
          dot: 'bg-yellow-500'
        },
        description: 'Approaching network average'
      },
      {
        name: 'GOOD',
        minValue: 0,
        maxValue: 60000,
        colors: {
          background: 'bg-green-100',
          text: 'text-green-700',
          dot: 'bg-green-500'
        },
        description: 'Below network average'
      }
    ]
  };

  const getCurrentThresholdLevel = (value) => {
    return thresholds.levels.find(level => 
      value >= level.minValue && value < level.maxValue
    ) || thresholds.levels[thresholds.levels.length - 1];
  };

  const getPercentage = (value) => {
    const max = 210000;
    const min = 0;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };

  const currentLevel = getCurrentThresholdLevel(panelData[activeIndex].value);
  const percentage = getPercentage(panelData[activeIndex].value);

  const pieData = [
    { name: 'Filled', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  const fillColor = tailwindColorMap[currentLevel.colors.dot] || '#EF4444';

  return (
    <div className="bg-white rounded-lg shadow-sm col-span-3">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Average Claim Size (ACS) Benchmark</h3>
            <p className="text-sm text-gray-500 mt-1">Comparison with similar hospitals in your network</p>
          </div>
          <Activity className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* ACS Score Section */}
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl ml-4 relative overflow-hidden">
            <div 
              className={`text-center w-full transition-transform duration-300 ease-in-out ${
                isTransitioning ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              <div className="text-4xl font-bold text-gray-900 mb-2 ml-4">
                ₹{panelData[activeIndex].value.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-500 mb-4">
                {panelData[activeIndex].label}
                </div>
              
              <div className="flex justify-center items-center w-full">
                <PieChart width={250} height={250}>
                  <Pie
                    data={pieData}
                    cx={125}
                    cy={125}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    <Cell key="filled" fill={fillColor} />
                    <Cell key="remaining" fill="#E5E7EB" />
                  </Pie>
                </PieChart>
              </div>

              <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
                <span className={`px-2 py-0.5 text-xxs font-medium rounded-full ${currentLevel.colors.background} ${currentLevel.colors.text} flex items-center gap-0.5`}>
                  <div className={`w-1 h-1 rounded-full ${currentLevel.colors.dot}`}></div>
                  {currentLevel.name}
                </span>
                <span className="px-2 py-0.5 text-xxs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center gap-0.5">
                  <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                  Top 25%
                </span>
              </div>
              <p className="text-xxs text-gray-500 mt-0.5">{currentLevel.description}</p>
            </div>
          </div>

          {/* Similar Hospitals Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">Similar Hospitals</h4>
              <span className="text-xs text-gray-500">Based on specialization & location</span>
            </div>
            <div className="space-y-3 flex-1">
              {alternativeHospitals.length > 0 ? (
                alternativeHospitals.map((hospital) => (
                  <div 
                    key={hospital.name} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
              <div className="flex items-center gap-3">
                {/* Risk Level Dot - Dynamically Colored */}
                <div className={`w-2 h-2 rounded-full ${
                  (() => {
                    const riskLevel = thresholds.levels.find(
                      level => hospital.avgCost >= level.minValue && hospital.avgCost < level.maxValue
                    ) || thresholds.levels[0]; // Default to first if not found
                    
                    return riskLevel.colors.dot; // Use the corresponding risk color dot
                  })()
                }`}></div>

                {/* Hospital Info */}
                <div>
                  <span className="text-sm font-medium text-gray-900">{hospital.name}</span>
                  
                  {/* Distance & Hospital Type */}
                  <div className="text-xs text-gray-500 mt-0.5 flex gap-x-2">
                    <span>Distance: {hospital.distance}</span>
                    <span>Hospital Type: {hospital.hosp_type}</span>
                  </div>
                </div>

                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-900">₹{hospital.avgCost?.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                        hospital.rating === 'Good' ? 'bg-green-100 text-green-700' :
                        hospital.rating === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {hospital.rating}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hospitals available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ACSGauge;