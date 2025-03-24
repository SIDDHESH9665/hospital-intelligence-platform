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