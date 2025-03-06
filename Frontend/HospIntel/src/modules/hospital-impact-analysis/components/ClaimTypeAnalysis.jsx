import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export const ClaimTypeAnalysis = ({ claimTypeData }) => {
  const COLORS = {
    primary: "rgb(37, 99, 235)", // Blue
    secondary: "rgb(147, 197, 253)" // Light Blue
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Claim Type Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={claimTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" orientation="left" stroke={COLORS.primary} />
            <YAxis yAxisId="right" orientation="right" stroke={COLORS.secondary} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="cashless_count" name="Cashless Claims" fill={COLORS.primary} />
            <Bar yAxisId="left" dataKey="reimbursement_count" name="Reimbursement Claims" fill={COLORS.secondary} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 