#!/bin/bash

# Check for a commit message
if [ -z "$1" ]; then
  echo "Error: No commit message provided."
  echo "Usage: ./auto_push.sh \"Your commit message\""
  exit 1
fi

# Add all changes to the staging area
git add .

# Commit the changes with the provided message
git commit -m "$1"

# Push the changes to the remote repository
git push

# Print a success message
echo "Changes have been successfully pushed to the repository." 

# Print the current date and time
echo "Current date and time:"
date

# Print the current working directory
echo "Current working directory:"
pwd

# deploy the vercel prod
echo "Deploying vercel prod..."
vercel --prod

# Print the vercel prod deployment status
echo "Vercel prod deployment status:"
vercel ls --prod