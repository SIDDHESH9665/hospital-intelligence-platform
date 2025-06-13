import React, { useState } from 'react';

const RequestReportForm = ({ open = true, onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);

  if (!open) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.fullName && formData.email && formData.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-slate-900/60 via-purple-900/40 to-slate-900/60 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] w-full max-w-md relative overflow-hidden border border-white/20">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 pointer-events-none" />
        
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
          
            <h2 className="text-3xl font-bold bg-blue-600  bg-clip-text text-transparent mb-2">
              Request Report
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fill out the form below and our medical team will contact you within 24 hours
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Full Name */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 pl-11 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 ${
                    focusedField === 'fullName' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 pl-11 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 ${
                    focusedField === 'email' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Message
              </label>
              <div className="relative">
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 pl-11 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 placeholder-gray-400 resize-none min-h-[100px] ${
                    focusedField === 'message' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Describe your report requirements..."
                  required
                />
                <div className="absolute left-3 top-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.691 1.309 3.061 2.925 3.061 1.616 0 2.925-1.37 2.925-3.061 0-1.69-1.309-3.061-2.925-3.061S1.5 11.069 1.5 12.76z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                isFormValid
                  ? 'bg-blue-600  hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {isFormValid ? (
                  <>
                    Submit Request
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.768 59.768 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </>
                ) : (
                  'Please fill all fields'
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestReportForm;