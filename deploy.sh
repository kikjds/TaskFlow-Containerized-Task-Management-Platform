#! /bin/bash


set -e
declare -a services=(mongod redis-server)
app_service=app.service


if [[ -z $1 ]]; then
    echo "Usage: $0 docker|native"
    exit 1
elif [[ $1 == "docker" && -f .env ]]; then
    if [[ ! $(systemctl is-active docker) == active || ! $(docker compose version) ]]; then
        echo "Docker service is not running or compose plugin is not installed" >&2
        exit 1
    fi
    echo "Starting application in docker environment"
    docker compose up --build -d
elif [[ $1 == "native" && -f .env ]]; then
    for service in ${services[@]}; do
        if [[ ! $(systemctl is-active $service) == active ]]; then
            echo "Service "$service" is not running" >&2
            exit 1
        fi
    done
    if [[ ! $(npm -v) || ! $(node -v) ]]; then
        echo "Node package manager or node is not installed" >&2
        exit 1
    fi
    npm run build
    if [[ ! $(systemctl is-active $app_service) == active || ! -s "/etc/systemd/system/$app_service" ]]; then
        sudo cp "$app_service" "/etc/systemd/system/$app_service"
        sudo systemctl daemon-reload
    fi
    sudo systemctl restart "$app_service"
    echo "Successfully built and restarted $app_service"
else
    echo "Make sure to create a proper .env file. You can copy .env.example" >&2
    exit 1
fi