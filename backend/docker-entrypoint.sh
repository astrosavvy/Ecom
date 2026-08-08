#!/bin/sh
set -e

echo "Running Medusa DB migrations..."
npx medusa db:migrate

echo "Starting Medusa application..."
npm run start
