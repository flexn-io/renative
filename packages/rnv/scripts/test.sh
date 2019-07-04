#!/usr/bin/env bash

params=()
docker_max_checks=24 # 2 minutes
docker_checks=0

echo "☕️ Starting up... "

# check os
if [[ "$OSTYPE" != "linux-gnu" && "$OSTYPE" != "darwin"* ]]; then
        echo "We do not support $OSTYPE yet."
fi

# check if docker and docker-compose is installed
echo  "🕒️ Checking required software... "

if [ ! -x "$(command -v docker)" ]; then
    if [["$OSTYPE" == "darwin"* && -x "$(command -v brew)"]]; then 
        echo -n "❌ Docker is not installed. \n"
        echo -n "🕒️ Installing docker and docker-compose... "
        brew cask install docker
        brew install docker-compose
    else
        echo "Please install docker and docker-compose"
    fi
fi

if [ ! -x "$(command -v docker-compose)" ]; then
    if [["$OSTYPE" == "darwin"* && -x "$(command -v brew)"]]; then 
        echo -n "❌ Docker-compose is not installed. Installing...\n"
        echo -n "🕒️ Installing docker-compose... "
        brew install docker-compose
    else 
        echo "Please install docker-compose"
    fi
fi

echo "✅ Required software installed"

# check for no-cache

if [ "$1" == '--no-cache' ]; then
    params+=(--no-cache)
fi

# check if docker is running

docker_running=false

docker_state=$(docker info >/dev/null 2>&1)
if [[ $? -ne 0 ]]; then
    echo "🛑 Docker does not seem to be running"
    echo "🕒️ Starting docker"
    open --background -a Docker # @todo check if docker installed with brew starts like this
    until [[ "$docker_running" == true || "$docker_checks" == "$docker_max_checks" ]]; do 
        docker_checks=$((docker_checks+1))
        if [[ `docker info | grep -m 1 "Server Version"` ]] &>/dev/null; then
            docker_running=true
        else
            sleep 5
        fi
    done
else 
    docker_running=true
fi

if ! $docker_running; then
    echo "❌ Could not start docker. Please start it manually and rerun this command"
    exit 1
else 
    echo "✅ Docker is started"
fi

# start the fun
docker-compose build "${params[@]}" test
docker-compose run --rm test
