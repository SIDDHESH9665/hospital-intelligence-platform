import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

export const MedicalVsSurgical = ({ percentageAnalysisData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Medical vs Surgical</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-64">
          <p className="text-sm font-medium text-center mb-2">Approved Amount</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={percentageAnalysisData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="approved"
              >
                {percentageAnalysisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <p className="text-sm font-medium text-center mb-2">Claimed Amount</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={percentageAnalysisData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="claimed"
              >
                {percentageAnalysisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 