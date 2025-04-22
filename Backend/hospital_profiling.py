import json
import logging

class HospitalProfilingDataHandler:
    def __init__(self, data_path):
        self.data_path = data_path
        self.data = self.load_data()

    def load_data(self):
        try:
            with open(self.data_path, 'r') as file:
                data = json.load(file)
            logging.info(f"Loaded hospital profiling data with {len(data['hospitals'])} hospitals")
            return data['hospitals']
        except FileNotFoundError:
            logging.error(f"JSON file not found at path: {self.data_path}")
            return []
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON: {e}")
            return []
        except Exception as e:
            logging.error(f"Error loading hospital profiling data: {e}")
            return []

    def get_hospital_by_id(self, hospital_id):
        try:
            hospital = next((h for h in self.data if h['id'] == hospital_id), None)
            return hospital
        except Exception as e:
            logging.error(f"Error fetching hospital by ID: {e}")
            return None

    def get_all_hospitals(self):
        try:
            return self.data
        except Exception as e:
            logging.error(f"Error fetching all hospitals: {e}")
            return []