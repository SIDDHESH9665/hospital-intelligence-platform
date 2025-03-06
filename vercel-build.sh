#!/bin/bash

# Create necessary directories
mkdir -p Backend

# Copy the Excel file to the Backend directory
cp hospital_data_v1.xlsx Backend/

# Install frontend dependencies and build
cd Frontend/HospIntel
npm install
npm run build

# Return to root
cd ../.. 