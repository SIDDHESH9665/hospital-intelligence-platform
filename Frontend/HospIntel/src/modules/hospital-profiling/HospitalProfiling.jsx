import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MapPin,
  Award,
  BadgeDollarSign,
  Stethoscope,
  RefreshCw,
  FileText,
  TrendingUp,
  User,
  Phone,
  Armchair,
  Star,
  Clock,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { makeAPIRequest } from '@/config/api';
import RequestReportForm from './components/RequestReportForm';

// Lazy load the map components
const MapComponent = React.lazy(() => 
  import('react-leaflet').then(module => {
    const { MapContainer, TileLayer, Marker, Popup } = module;
    return { default: ({ center, zoom, hospitalData }) => (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            {hospitalData.name}<br />
            {hospitalData.location.address}
          </Popup>
        </Marker>
      </MapContainer>
    )};
  })
);

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5173';

function HospitalProfiling() {
  const navigate = useNavigate();
  const { partnerId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isMapReady, setIsMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState(null);
  const [error, setError] = useState(null);
  const [hospitalsData, setHospitalsData] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showNotFoundPopup, setShowNotFoundPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const fetchHospitalData = async () => {
      setLoading(true);
      try {
        const hospitals = await makeAPIRequest('/api/hospital-profiling/hospitals');
        console.log('Fetched Hospitals:', hospitals);

        setHospitalsData(hospitals);
        const hospital = partnerId ? hospitals.find(h => h.id === partnerId) : hospitals[0];
        console.log('Selected Hospital:', hospital);

        setHospitalData({
          ...hospital,
          accreditationStatus: hospital?.accreditationStatus || [],
          amountGrading: hospital?.amountGrading || { value: 'N/A', grading: 'N/A', barFill: 0 },
          readmissionRate: hospital?.readmissionRate || { percentage: 'N/A', barFill: 0 },
        });
      } catch (err) {
        setError('Failed to fetch hospital data');
        console.error('Error fetching hospitals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [partnerId]);

  const handleBack = () => {
    navigate('/home');
  };

  const handleSearch = () => {
    const hospital = hospitalsData.find(h => h.id === searchQuery);
    if (hospital) {
      navigate(`/hospital-profiling/${hospital.id}`);
    } else {
      setPopupMessage(`Hospital with Partner ID ${searchQuery} not found. Please check the ID and try again.`);
      setShowNotFoundPopup(true);
    }
  };

  useEffect(() => {
    // Fix Leaflet default marker icon issue
    const L = window.L;
    if (L) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
    setIsMapReady(true);
  }, []);

  const handleCallNow = () => {
    window.location.href = 'tel:+911234567890';
  };

  const renderMap = () => {
    if (!isMapReady || !hospitalData) return null;

    return (
      <div className="h-64 rounded-lg overflow-hidden bg-gray-100">
        <Suspense fallback={
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <MapComponent
            center={[hospitalData.location.coordinates.lat, hospitalData.location.coordinates.lng]}
            zoom={15}
            hospitalData={hospitalData}
          />
        </Suspense>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!hospitalData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Hospital not found</div>
      </div>
    );
  }

  // Ensure hospitalsData is an array before accessing its length
  const hospitalCount = Array.isArray(hospitalsData) ? hospitalsData.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button and Logo */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 text-white py-4">
        <div className="absolute inset-0 bg-[url('/img/navbg.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="w-full px-4 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Hospital Profiling</h1>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64 lg:w-96 flex items-center">
                <input
                  type="text"
                  placeholder="Search hospital by Partner ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full text-sm sm:text-base pl-8 sm:pl-10 pr-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/70"
                />
                <Search 
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/70 cursor-pointer" 
                  onClick={handleSearch}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="ml-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Search
                </button>
              </div>
              <img src="/img/logo.png" alt="Logo" className="h-8 sm:h-12 w-auto" />
            </div>
          </div>
        </div>
      </div>
      {/* Popup for not found */}
      {showNotFoundPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Hospital Not Found</h3>
            <p className="text-gray-600 mb-6">{popupMessage || `Hospital with Partner ID ${searchQuery} not found. Please check the ID and try again.`}</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setShowNotFoundPopup(false); setShowRequestForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded">Request Report</button>
              <button onClick={() => { setShowNotFoundPopup(false); setSearchQuery('65458106'); handleSearch('65458106'); }} className="px-4 py-2 bg-green-600 text-white rounded">Try Default ID</button>
              
            </div>
          </div>
        </div>
      )}
      {/* Request Report Form Popup */}
      {showRequestForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <RequestReportForm onClose={() => setShowRequestForm(false)} />
        </div>
      )}
      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{hospitalData.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${hospitalData.networkStatus?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{hospitalData.networkStatus?.status || 'Unknown'}</span>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-xl sm:text-2xl font-semibold text-green-600">{hospitalData.rating}</span>
                {[1, 2, 3, 4].map((_, i) => (
                  <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 fill-current" />
                ))}
                <Star className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 fill-current" strokeWidth={0.5} />
                <span className="text-sm sm:text-base text-gray-600">({hospitalData.patientStories} patient stories)</span>
              </div>
              <div className="mt-2 text-sm sm:text-base text-blue-600 font-medium">
                Partner ID: {hospitalData.id}
              </div>
              <p className="text-gray-600 mt-2">{hospitalData.location?.city || 'City not available'}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm sm:text-base text-gray-600">
                <span>{hospitalData.details?.type || 'Type not available'}</span>
                <span>•</span>
                <span>Established {hospitalData.details?.established || 'N/A'}</span>
                <span>•</span>
                <span>{hospitalData.details?.beds || 'N/A'} Beds</span>
                <span>•</span>
                <span>{hospitalData.details?.doctorsCount || 'N/A'} Doctors</span>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <Armchair className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Wheelchair accessibility available</span>
              </div>
            </div>
            <button
              onClick={handleCallNow}
              className="w-full sm:w-auto bg-blue-400 hover:bg-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b min-w-max">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'doctors', label: `Doctors (${hospitalData?.doctors?.length || 0})` },
              { id: 'rc', label: 'Relationship Manager' },
              { id: 'services', label: 'Services' },
              { id: 'network', label: 'Network Status' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <Award className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">Accreditation</h3>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {['JCI', 'NABH', 'NABL', 'ROHINI'].map((accred, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${hospitalData.accreditationStatus?.includes(accred) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{accred}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <BadgeDollarSign className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">Amount Grading</h3>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${hospitalData.amountGrading?.barFill || 0}%` }}></div>
                      </div>
                      <span className="ml-3 text-green-600 font-medium whitespace-nowrap">
                        {hospitalData.amountGrading?.grading || 'N/A'} ({hospitalData.amountGrading?.value || 'N/A'})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <Stethoscope className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">Key Services</h3>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {(hospitalData.keyServices || []).slice(0, 5).map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{service}</span>
                    ))}
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      +{hospitalData.keyServices?.length - 5 || 0} more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <RefreshCw className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">Readmission Rate</h3>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${hospitalData.readmissionRate?.barFill || 0}%` }}></div>
                      </div>
                      <span className="ml-3 text-blue-600 font-medium">
                        {hospitalData.readmissionRate?.percentage || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <FileText className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Claim Counts</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Medical Claims</p>
                      <p className="text-2xl font-bold text-gray-800">{hospitalData.claimCounts?.medicalClaims || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Surgical Claims</p>
                      <p className="text-2xl font-bold text-gray-800">{hospitalData.claimCounts?.surgicalClaims || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Portfolio Analysis</h3>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Medical Average</span>
                      <span className="text-sm font-medium">₹{hospitalData.portfolioAnalysis?.portfolioAverage || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Surgical Average</span>
                      <span className="text-sm font-medium">₹{hospitalData.portfolioAnalysis?.categoryAverage || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Tab-specific content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* KPI Cards */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">About {hospitalData.name}</h3>
                <p className="text-gray-600 mb-6">
                  {hospitalData.name} was established in {hospitalData.details?.established || 'N/A'}, and today it has emerged as Asia's foremost integrated healthcare services provider. The hospital has a robust presence across the healthcare ecosystem, including Hospitals, Pharmacies, Primary Care & Diagnostic Clinics.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Address</h4>
                    <p className="text-gray-600">
                      {hospitalData.location.address}<br />
                      {hospitalData.location.city}<br />
                      {hospitalData.location.state} {hospitalData.location.pincode}
                    </p>
                    <button className="text-blue-600 mt-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Get Directions
                    </button>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Timings</h4>
                    <div className="flex items-center text-green-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Open 24 x 7</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Photos</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {hospitalData.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Hospital Photo ${index + 1}`}
                        className="rounded-lg w-full h-24 object-cover"
                      />
                    ))}
                  </div>
                  {/* <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2800&q=80"
                      alt="Emergency Room"
                      className="rounded-lg w-full h-32 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2800&q=80"
                      alt="Hospital Corridor"
                      className="rounded-lg w-full h-32 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2800&q=80"
                      alt="Medical Equipment"
                      className="rounded-lg w-full h-32 object-cover hidden sm:block"
                    />
                  </div> */}
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Location</h4>
                  <div className="h-64 rounded-lg overflow-hidden">
                    {renderMap()}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Payment Methods</h4>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">{hospitalData?.paymentMethods?.join(' | ') || 'No payment methods available'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {hospitalData.doctors.map((doctor, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
                    <img
                      src={doctor.doc_image}
                      alt={doctor.name}
                      className="w-32 h-32 object-cover rounded-full mb-4"
                    />
                    <h4 className="text-lg font-semibold text-gray-800">{doctor.name}</h4>
                    <p className="text-gray-600">{doctor.specialty}</p>
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {doctor.qualification}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{doctor.experience} years experience</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'rc' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <User className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Relationship Manager</h3>
                    <p className="text-lg text-gray-600">{hospitalData.accountHandler.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Contact Number</h4>
                    <p className="text-lg font-semibold text-gray-800">{hospitalData.accountHandler.contactNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Email Address</h4>
                    <p className="text-lg font-semibold text-gray-800">{hospitalData.accountHandler.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Designation</h4>
                    <p className="text-lg font-semibold text-gray-800">{hospitalData.accountHandler.designation}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Managing Since</h4>
                    <p className="text-lg font-semibold text-gray-800">{hospitalData.accountHandler.managingSince}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {hospitalData.services.map((service, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">{service.name}</h4>
                      <p className="text-gray-600 mt-2">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Network Status Content - Only show when network tab is active */}
            {activeTab === 'network' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">Network Status</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${hospitalData.networkStatus?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {hospitalData.networkStatus?.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="text-red-800 font-medium mb-4">Details</h4>
                        <div className="space-y-4">
                          {hospitalData.networkStatus.details.map((detail, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                              <span className="font-medium text-gray-800">{detail.company}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-red-600">{detail.status}</span>
                                <span className="text-sm text-gray-500">Since: {detail.since}</span>
                              </div>
                            </div>
                          ))}x
                        </div>
                        <p className="text-sm text-red-600 mt-4">Last verified: {hospitalData.networkStatus.lastVerified}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HospitalProfiling;