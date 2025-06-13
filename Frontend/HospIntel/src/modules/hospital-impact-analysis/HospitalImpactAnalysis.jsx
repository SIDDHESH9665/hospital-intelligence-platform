import React, { useState, useEffect, useCallback } from 'react';
import { Search, Building2, MapPin, ArrowLeft, X } from 'lucide-react';
import { StarRating } from './components/StarRating';
import ACSGauge from './components/ACSGauge';
import CostRevise from './components/CostRevise';
import { ClaimTypeAnalysis } from './components/ClaimTypeAnalysis';
import { MedicalVsSurgical } from './components/MedicalVsSurgical';
import { RoomCategoryDistribution } from './components/RoomCategoryDistribution';
import { TopDiagnoses } from './components/TopDiagnoses';
import { ClaimsSummary } from './components/ClaimsSummary';
import { API_ENDPOINTS, initializeAPI, makeAPIRequest } from '@/config/api';
import { useNavigate } from 'react-router-dom';
import ReportRequestForm from '@/components/ReportRequestForm';

const HospitalDashboard = ({ partnerId = 65458106 }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [currentPartnerId, setCurrentPartnerId] = useState(partnerId);
  const [alternativeHospitals, setAlternativeHospitals] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [apiInitialized, setApiInitialized] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchData = async () => {
    if (!apiInitialized) return;
    
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.CLAIMS_ANALYSIS(currentPartnerId));
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Hospital with Partner ID ${currentPartnerId} not found. Please check the ID and try again.`);
        }
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      if (!jsonData || !jsonData.hospital_info) {
        throw new Error(`No data found for Hospital with Partner ID ${currentPartnerId}`);
      }
      setData(jsonData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize API when component mounts
  useEffect(() => {
    const initAPI = async () => {
      await initializeAPI();
      setApiInitialized(true);
      // Fetch data after API is initialized
      fetchData();
    };
    initAPI();
  }, []);

  useEffect(() => {
    if (apiInitialized) {
      fetchData();
    }
  }, [currentPartnerId, apiInitialized]);

  useEffect(() => {
    if (data?.Similar_Hospitals) {
      const transformedHospitals = data.Similar_Hospitals.map(hospital => ({
        name: hospital.name,
        rating: hospital.rating,
        avgCost: hospital.acs,
        distance: hospital.distance,
        hosp_type: hospital.hosp_type
      }));
      setAlternativeHospitals(transformedHospitals);
    }
  }, [data]);

  const claimsData = data?.Get_claims_summary?.reduce((acc, item) => {
    if (item.Type === 'cashless') {
      acc.cashless.amount += item.Amount || 0;
      acc.cashless.count += item.Count || 0;
    } else if (item.Type === 'reimbursement') {
      acc.reimbursement.amount += item.Amount || 0;
      acc.reimbursement.count += item.Count || 0;
    } else if (item.Type === 'medical') {
      acc.medical.amount += item.Amount || 0;
      acc.medical.count += item.Count || 0;
    } else if (item.Type === 'surgical') {
      acc.surgical.amount += item.Amount || 0;
      acc.surgical.count += item.Count || 0;
    }
    return acc;
  }, {
    cashless: { amount: 0, count: 0 },
    reimbursement: { amount: 0, count: 0 },
    medical: { amount: 0, count: 0 },
    surgical: { amount: 0, count: 0 }
  }) || {
    cashless: { amount: 0, count: 0 },
    reimbursement: { amount: 0, count: 0 },
    medical: { amount: 0, count: 0 },
    surgical: { amount: 0, count: 0 }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentPartnerId(searchInput);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Hospital Not Found</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        
        {showSearch ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Hospital Partner ID"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (searchInput.trim()) {
                    setCurrentPartnerId(searchInput);
                    setError(null);
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
              <button 
                onClick={() => {
                  setShowSearch(false);
                  setSearchInput('');
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                setCurrentPartnerId(partnerId);
                setError(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Default Hospital
            </button>
            <button 
              onClick={() => setShowSearch(true)}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Try Another ID
            </button>
            <button 
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md"
            >
              Request Report
            </button>
          </div>
        )}
      </div>
      <ReportRequestForm 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        hospitalId={currentPartnerId}
      />
    </div>
  );
  
  if (!data) return null;

  // Transform data for charts
  const claimTypeData = data.Claim_Type_Analysis.map(item => ({
    year: item.claim_year.toString(),
    cashless_count: item.CASHLESS_Claims,
    reimbursement_count: item.REIMBURSEMENT_Claims,
    cashless_approved: item.CASHLESS_Amount,
    reimbursement_approved: item.REIMBURSEMENT_Amount
  }));

  const percentageAnalysisData = data.Type_Percentage_Analysis
    .filter(item => item.MEDICAL_OR_SURGICAL !== 'Grand Total')
    .map((item, index) => ({
      name: item.MEDICAL_OR_SURGICAL,
      approved: item.Sum_of_Approved_Amt_Percentage,
      claimed: item.Sum_of_Claimed_Amt_Percentage,
      color: index === 0 ? "rgb(37, 99, 235)" : "rgb(147, 197, 253)" // Blue, Light Blue
    }));

  const roomCategoryData = data?.Room_Category_Analysis.map(item => ({
    category: item.ROOM_CATEGORY,
    claims: item.Total_Claims
  })) || [];

  const diagnosisData = data?.Diagnosis_Analysis.slice(0, 5).map(item => ({
    diagnosis: item.FINAL_DIAGNOSIS,
    claims: item.Total_Claims,
    avgCost: item.Total_Approved_AMT / item.Total_Claims
  })) || [];

  const averageClaimSizeData = data?.Average_Claim_Cost.map(item => ({
    total_acs: item.total_acs,
    medical_acs: item.medical_acs,
    surgical_acs: item.surgical_acs,
  })) || [];

  const costRevisionData = data?.Cost_Revision_Ratio.map(item => ({
    year: item.claim_year,
    ratio: item.Total_Approved_Amount / item.Total_Claims
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button and Logo */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 text-white py-4">
        <div className="absolute inset-0 bg-[url('/img/navbg.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="w-full px-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">Hospital Impact Analysis</h1>
            </div>
            <img src="/img/logo.png" alt="Logo" className="h-16 w-25" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-0 py-2">
        {/* Hospital Info Section */}
        <div className="bg-white shadow-sm mb-2">
          <div className="p-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* Hospital Details - Left Side */}
              <div className="lg:col-span-7">
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Building2 className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-base font-semibold text-gray-900">{data.hospital_info.HOSPITAL}</h5>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-red-400" />
                      <p className="text-sm text-gray-600">{data.hospital_info.ADDRESS} | ID: {currentPartnerId}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 items-center">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">{data.hospital_info.TIER}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{data.hospital_info.CATEGORY}</span>
                      <span className="text-sm text-gray-600 ml-0">Infrastructure Score:</span>
                      <StarRating score={data.hospital_info.INFRA_SCORE} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters - Right Side */}
              <div className="lg:col-span-5">
                <form onSubmit={handleSearch} className="space-y-2">
                  <div className="flex gap-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="search"
                        placeholder="Search by Partner ID"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                      />
                    </div>
                    <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Search
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <select className="border rounded-lg p-2">
                      <option>All Specializations</option>
                    </select>
                    <input type="date" className="border rounded-lg p-2" />
                    <input type="date" className="border rounded-lg p-2" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="space-y-2">
          {/* Claims Summary */}
          <ClaimsSummary claimsData={claimsData} />
        
          {/* KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            <CostRevise costRevisionData={costRevisionData} />
            <ACSGauge
              averageClaimSizeData={averageClaimSizeData}
              alternativeHospitals={alternativeHospitals}
            />
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ClaimTypeAnalysis claimTypeData={claimTypeData} />
            <MedicalVsSurgical percentageAnalysisData={percentageAnalysisData} />
            <RoomCategoryDistribution roomCategoryData={roomCategoryData} />
            <TopDiagnoses diagnosisData={diagnosisData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;