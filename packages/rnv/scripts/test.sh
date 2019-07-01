#!/usr/bin/env bash

params=()

echo "☕️ Starting up... "

# check os
if [[ "$OSTYPE" != "linux-gnu" && "$OSTYPE" != "darwin"* ]]; then
        echo "We do not support $OSTYPE yet."
fi

# check if docker and docker-compose is installed
echo  "🕒️ Checking required software... "

if [ ! -x "$(command -v docker)" ]; then
    if [["$OSTYPE" == "darwin"* && -x "$(command -v brew)"]]; then 
        echo -n "❌ docker is not installed. \n"
        echo -n "🕒️ Installing docker and docker-compose... "
        brew cask install docker
        brew install docker-compose
    else
        echo "Please install docker and docker-compose"
    fi
fi

if [ ! -x "$(command -v docker-compose)" ]; then
    if [["$OSTYPE" == "darwin"* && -x "$(command -v brew)"]]; then 
        echo -n "❌ docker-compose is not installed. Installing...\n"
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

# start the fun
docker-compose build "${params[@]}" test
docker-compose run --rm test
