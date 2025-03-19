import { HospitalData, Doctor } from '../types/hospital';

export const doctors: Doctor[] = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    image: "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    image: "https://plus.unsplash.com/premium_photo-1661775317533-2e8ecd5d8c37?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dr. Emily Williams",
    specialty: "Oncology",
    image: "https://plus.unsplash.com/premium_photo-1661775731358-797ea34ba790?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    image: "https://plus.unsplash.com/premium_photo-1661775731395-3c2e4535c4e4?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Dr. Lisa Anderson",
    specialty: "Pediatrics",
    image: "https://plus.unsplash.com/premium_photo-1661775731399-25cb3272797f?auto=format&fit=crop&q=80&w=300&h=300"
  }
];

export const hospitalData: HospitalData = {
  name: "Apollo Hospitals",
  rating: 4.5,
  patientStories: 476,
  location: {
    address: "Plot No. 1, Film City Road",
    city: "Goregaon East, Mumbai",
    state: "Maharashtra",
    pincode: "400063",
    coordinates: {
      lat: 19.1626,
      lng: 72.8619
    }
  },
  details: {
    type: "Multi-Speciality Hospital",
    established: 2000,
    beds: 500,
    doctorsCount: 64
  },
  rcStatus: {
    isListed: true,
    registrationNumber: "RC/MH/2023/12345",
    validUntil: "2025-12-31",
    status: "Active"
  },
  accreditation: {
    JCI: true,
    NABH: true,
    Rohini: "pending",
    ISO: true
  },
  keyServices: [
    "Cardiology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Emergency Care",
    "Diagnostics",
    "Surgery"
  ],
  facilities: {
    wheelchairAccessible: true,
    ambulanceCount: 10,
    parkingAvailable: true,
    cafeteria: true
  },
  paymentMethods: [
    "Credit Card",
    "Insurance",
    "Cash",
    "Cheque",
    "Online Payment",
    "Debit Card",
    "UPI"
  ]
};