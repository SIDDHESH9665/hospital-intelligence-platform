import React, { useState } from 'react';
import { X, User, Mail, Building, MessageSquare } from 'lucide-react';

const ReportRequestForm = ({ isOpen, onClose, hospitalId, title = "Request Hospital Report" }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    hospitalId: hospitalId || '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/report-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          hospitalId: formData.hospitalId,
          message: formData.message,
        }),
      });
      if (response.ok) {
        alert("Report request sent successfully!");
        onClose();
      } else {
        alert("Failed to send report request.");
      }
    } catch (err) {
      alert("Error sending report request.");
    }
  };

  if (!isOpen) return null;

  const inputFields = [
    { 
      id: 'fullName', 
      label: 'Full Name', 
      type: 'text', 
      placeholder: 'Enter your full name',
      icon: <User className="w-5 h-5 text-gray-400" />
    },
    { 
      id: 'email', 
      label: 'Email', 
      type: 'email', 
      placeholder: 'Enter your email address',
      icon: <Mail className="w-5 h-5 text-gray-400" />
    },
    { 
      id: 'hospitalId', 
      label: 'Hospital ID', 
      type: 'text', 
      placeholder: 'Enter hospital ID',
      icon: <Building className="w-5 h-5 text-gray-400" />
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out animate-fadeInUp">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">Please fill in the details below to request a report</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {inputFields.map(({ id, label, type, placeholder, icon }) => (
            <div key={id} className="space-y-2">
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 tracking-wide">
                {label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {icon}
                </div>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-700"
                  required
                />
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 tracking-wide">
              Message
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                id="message"
                rows="4"
                placeholder="Enter your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-gray-400 text-gray-700"
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
           
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportRequestForm;
