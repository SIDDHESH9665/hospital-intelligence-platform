import React from 'react';

export const ClaimsSummary = ({ claimsData }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {Object.entries(claimsData).map(([key, data]) => (
        <div key={key} className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold text-blue-600">₹{(data.amount / 100000).toFixed(1)}L</div>
          <div className="text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)} Claims</div>
          <div className="text-xs text-gray-500">({data.count} claims)</div>
        </div>
      ))}
    </div>
  );
}; 