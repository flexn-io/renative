#!/usr/bin/env bash

params=()

# check os
if [[ "$OSTYPE" != "linux-gnu" && "$OSTYPE" != "darwin"* ]]; then
        echo "We do not support $OSTYPE yet."
fi

# check if docker and docker-compose is installed

if [ ! -x "$(command -v docker)" ]; then
    if [["$OSTYPE" == "darwin"* && -x "$(command -v brew)"]]; then 
        brew install docker docker-compose
    else
        echo "Please install docker and docker-compose"
    fi
fi

# check for no-cache

if [ "$1" == '--no-cache' ]; then
    params+=(--no-cache)
fi

if [ ! -x "$(command -v docker-compose)" ]; then
    echo "Please install docker-compose"
fi

# start the fun

docker-compose build "${params[@]}" test
docker-compose run --rm test
