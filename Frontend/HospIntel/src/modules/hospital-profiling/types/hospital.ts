export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Doctor {
  name: string;
  specialty: string;
  image: string;
}

export interface RCStatus {
  isListed: boolean;
  registrationNumber: string;
  validUntil: string;
  status: string;
}

export interface HospitalData {
  name: string;
  rating: number;
  patientStories: number;
  location: Location;
  details: {
    type: string;
    established: number;
    beds: number;
    doctorsCount: number;
  };
  rcStatus: RCStatus;
  accreditation: {
    JCI: boolean;
    NABH: boolean;
    Rohini: string;
    ISO: boolean;
  };
  keyServices: string[];
  facilities: {
    wheelchairAccessible: boolean;
    ambulanceCount: number;
    parkingAvailable: boolean;
    cafeteria: boolean;
  };
  paymentMethods: string[];
}