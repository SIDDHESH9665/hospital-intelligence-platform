import React, { useEffect, useState } from 'react';
import CostRevisionKPI from './CostRevisionKPI';
import { API_ENDPOINTS } from '@/config/api';

const CostRevise = ({ partnerId = 65458106 }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CLAIMS_ANALYSIS(partnerId));
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [partnerId]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CostRevisionKPI data={data} />
    </div>
  );
};

export default CostRevise; 