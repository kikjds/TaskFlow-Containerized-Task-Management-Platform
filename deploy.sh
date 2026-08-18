#!/bin/bash

set -e

if [[ -z $1 ]]; then
    echo "Usage: $0 docker|native"
    exit 1
elif [[ $1 == "docker" && -f .env ]]; then
    echo "Starting application in docker environment"
    docker compose up --build -d
elif [[ $1 == "native" && -f .env ]]; then
    echo "Make sure you have installed Redis and MongoDB on your machine"
    npm run build
    echo "Successfully built and launching application"
    npm run start
else
    echo "Make sure to create a proper .env file. You can copy .env.example"
    exit 1
fi