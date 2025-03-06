import React from 'react';

export const TopDiagnoses = ({ diagnosisData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Top Diagnoses</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Diagnosis</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Claims</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Avg. Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {diagnosisData.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-900">{row.diagnosis}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">{row.claims}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">₹{row.avgCost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 