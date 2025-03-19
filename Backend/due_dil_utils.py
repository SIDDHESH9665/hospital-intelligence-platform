import json
import os
from typing import Dict, List, Optional

class DueDiligenceDataHandler:
    def __init__(self, data_file: str = "due_diligence_data.json"):
        # Get the absolute path to the data file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_file = os.path.join(current_dir, data_file)
        print(f"Initializing DueDiligenceDataHandler with data file: {self.data_file}")
        print(f"Current directory: {current_dir}")
        print(f"File exists: {os.path.exists(self.data_file)}")
        self.data = self._load_data()
        print(f"Loaded {len(self.data)} hospitals")
        if self.data:
            print(f"Available hospital IDs: {[h['hospital_info']['ID'] for h in self.data]}")

    def _load_data(self) -> List[Dict]:
        """Load data from JSON file"""
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                print(f"Successfully loaded data from {self.data_file}")
                return data
        except FileNotFoundError:
            print(f"Warning: {self.data_file} not found. Creating empty data file.")
            self._save_data([])
            return []
        except json.JSONDecodeError:
            print(f"Warning: {self.data_file} is invalid. Creating empty data file.")
            self._save_data([])
            return []

    def _save_data(self, data: List[Dict]) -> None:
        """Save data to JSON file"""
        try:
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
                print(f"Successfully saved data to {self.data_file}")
        except Exception as e:
            print(f"Error saving data: {e}")
            raise

    def get_all_hospitals(self) -> List[Dict]:
        """Get all hospital data"""
        return self.data

    def get_hospital_by_id(self, hospital_id: int) -> Optional[Dict]:
        """Get hospital data by ID"""
        print(f"Searching for hospital with ID: {hospital_id}")
        print(f"Available hospitals: {[h['hospital_info']['ID'] for h in self.data]}")
        for hospital in self.data:
            if str(hospital["hospital_info"]["ID"]) == str(hospital_id):
                print(f"Found hospital with ID {hospital_id}")
                return hospital
        print(f"Hospital with ID {hospital_id} not found")
        return None

    def get_hospital_by_name(self, hospital_name: str) -> Optional[Dict]:
        """Get hospital data by name"""
        for hospital in self.data:
            if hospital["hospital_info"]["HOSPITAL"].lower() == hospital_name.lower():
                return hospital
        return None

    def add_hospital(self, hospital_data: Dict) -> bool:
        """Add new hospital data"""
        if not self._validate_hospital_data(hospital_data):
            return False
        
        # Check if hospital already exists
        if self.get_hospital_by_id(hospital_data["hospital_info"]["ID"]):
            return False

        self.data.append(hospital_data)
        self._save_data(self.data)
        return True

    def update_hospital(self, hospital_id: int, hospital_data: Dict) -> bool:
        """Update existing hospital data"""
        if not self._validate_hospital_data(hospital_data):
            return False

        for i, hospital in enumerate(self.data):
            if hospital["hospital_info"]["ID"] == hospital_id:
                self.data[i] = hospital_data
                self._save_data(self.data)
                return True
        return False

    def delete_hospital(self, hospital_id: int) -> bool:
        """Delete hospital data"""
        for i, hospital in enumerate(self.data):
            if hospital["hospital_info"]["ID"] == hospital_id:
                del self.data[i]
                self._save_data(self.data)
                return True
        return False

    def _validate_hospital_data(self, data: Dict) -> bool:
        """Validate hospital data structure"""
        required_fields = {
            "hospital_info": ["ID", "HOSPITAL", "ADDRESS", "CATEGORY", "TIER", "INFRA_SCORE"],
            "hospital_score": ["score"],
            "financial_assessment": ["gst_status", "pan_status", "epfo_status"],
            "negative_legal": ["blacklist", "pmjay_status", "legal_status"],
            "accreditation_status": ["jci", "nabh", "rohini", "none"]
        }

        try:
            for section, fields in required_fields.items():
                if section not in data:
                    print(f"Missing section: {section}")
                    return False
                for field in fields:
                    if field not in data[section]:
                        print(f"Missing field {field} in section {section}")
                        return False
                    
            # Validate nested structures
            if not isinstance(data["negative_legal"]["blacklist"], dict):
                print("Invalid blacklist structure")
                return False
            if "count" not in data["negative_legal"]["blacklist"]:
                print("Missing blacklist count")
                return False
            if "severity" not in data["negative_legal"]["blacklist"]:
                print("Missing blacklist severity")
                return False
                
            legal_status = data["negative_legal"]["legal_status"]
            for case_type in ["criminal_case", "civil_case"]:
                if case_type not in legal_status:
                    print(f"Missing {case_type}")
                    return False
                if not isinstance(legal_status[case_type], dict):
                    print(f"Invalid {case_type} structure")
                    return False
                if "status" not in legal_status[case_type]:
                    print(f"Missing status in {case_type}")
                    return False
                if "details" not in legal_status[case_type]:
                    print(f"Missing details in {case_type}")
                    return False
                    
            for cert in ["jci", "nabh", "rohini"]:
                cert_data = data["accreditation_status"][cert]
                if not isinstance(cert_data, dict):
                    print(f"Invalid {cert} structure")
                    return False
                if "status" not in cert_data:
                    print(f"Missing status in {cert}")
                    return False
                if "label" not in cert_data:
                    print(f"Missing label in {cert}")
                    return False
                    
            return True
        except Exception as e:
            print(f"Validation error: {e}")
            return False 