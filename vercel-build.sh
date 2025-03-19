#!/bin/bash

# Create necessary directories
mkdir -p Backend

# Copy the Excel file to the Backend directory
cp hospital_data_v1.xlsx Backend/

# Install backend dependencies
cd Backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies and build
cd Frontend/HospIntel
npm install
npm run build

# Return to root
cd ../..

# Ensure the build output directory exists
mkdir -p Frontend/HospIntel/dist 