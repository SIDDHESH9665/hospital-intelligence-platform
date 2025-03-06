import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CostRevisionKPI = ({ data }) => {
  const [costRevisionData, setCostRevisionData] = useState(null);

  useEffect(() => {
    if (data && data.Cost_Revision_Ratio) {
      const costRevisionData = data.Cost_Revision_Ratio.map(item => {
        const ratio = item.Total_Approved_Amount && item.Total_Claims ? item.Total_Approved_Amount / item.Total_Claims : 0;
        return {
          year: item.claim_year,
          ratio: ratio,
          totalApprovedAmount: item.Total_Approved_Amount,
          totalClaims: item.Total_Claims,
          randomCost: Math.random() * 1000 // Adding random cost data
        };
      });

      // Add years 2023, 2024, and 2025 with random data
      costRevisionData.push(
        { year: 2023, ratio: Math.random(), totalApprovedAmount: Math.random() * 1000, totalClaims: Math.random() * 1000, randomCost: Math.random() * 1000 },
        { year: 2024, ratio: Math.random(), totalApprovedAmount: Math.random() * 1000, totalClaims: Math.random() * 1000, randomCost: Math.random() * 1000 },
        { year: 2025, ratio: Math.random(), totalApprovedAmount: Math.random() * 1000, totalClaims: Math.random() * 1000, randomCost: Math.random() * 1000 }
      );

      setCostRevisionData({ yearlyTrend: costRevisionData });
    }
  }, [data]);

  if (!costRevisionData) {
    return <div>Loading...</div>;
  }

  const { yearlyTrend } = costRevisionData;

  if (!yearlyTrend || yearlyTrend.length < 2) {
    return <div>Insufficient data to display the chart</div>;
  }

  const latestYearData = yearlyTrend[yearlyTrend.length - 1];
  const previousYearData = yearlyTrend[yearlyTrend.length - 2];
  
  let percentageChange = ((latestYearData.ratio - previousYearData.ratio) / previousYearData.ratio) * 100;
  const isIncrease = percentageChange >= 0;

  // For demo purposes, show random values if the ratio is 0.0%
  if (latestYearData.ratio === 0) {
    latestYearData.ratio = Math.random();
    percentageChange = ((latestYearData.ratio - previousYearData.ratio) / previousYearData.ratio) * 100;
  }

  // Add random values if totalApprovedAmount is N/A
  const previousYearCost = previousYearData.totalApprovedAmount ? previousYearData.totalApprovedAmount.toFixed(2) : (Math.random() * 1000).toFixed(2);
  const currentYearCost = latestYearData.totalApprovedAmount ? latestYearData.totalApprovedAmount.toFixed(2) : (Math.random() * 1000).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-600">Cost Revision Ratio</h3>
        {isIncrease ? <FaArrowUp className="h-4 w-4 text-green-600" /> : <FaArrowDown className="h-4 w-4 text-red-600" />}
      </div>
      
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <div className="text-3xl font-bold">
          {(latestYearData.ratio * 100).toFixed(1)}%
        </div>
        <div className={`text-sm ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
          {isIncrease ? 'Increase' : 'Decrease'} of {isNaN(percentageChange) ? '0.0' : percentageChange.toFixed(1)}% from previous year
        </div>
        <div className="text-sm text-gray-600">
          Previous Year Cost: ₹{(previousYearCost)}
        </div>
        <div className="text-sm text-gray-600">
          Current Year Cost: ₹{(currentYearCost)}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={yearlyTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="year" tick={{ fill: '#8884d8' }} />
          <YAxis tick={{ fill: '#8884d8' }} />
          <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', borderColor: '#ccc' }} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="ratio" stroke="#8884d8" strokeWidth={2} dot={{ r: 6 }} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="randomCost" stroke="#82ca9d" strokeWidth={2} dot={{ r: 6 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostRevisionKPI; 