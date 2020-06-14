#!/usr/bin/env bash

# RUN CHECK
echo "CURRENT ENV:: TRAVIS_BRANCH: $TRAVIS_BRANCH, TRAVIS_PULL_REQUEST: $TRAVIS_PULL_REQUEST, TRAVIS_TAG: $TRAVIS_TAG"

# DEFINITIONS


# SETUP
set -e
set -o xtrace
set -o verbose
set -o pipefail

GLOBAL_ROOT="/Users/travis/.$ACCOUNT_NAME"
PROJECT_PATH="/Users/travis/build/$REPO_NAME"
GLOBAL_PATH="$GLOBAL_ROOT/$PROJECT_NAME"
PROV_PROFILES=~/Library/MobileDevice/Provisioning\ Profiles

# Disable temporary to speed up the build
# rm -rf ./node_modules && rm -rf ./package-lock.json
mkdir -p $GLOBAL_PATH
# echo "{\"appConfigsPath\":\"$PROJECT_PATH/appConfigs\", \"defaultTargets\": {}}" > "$GLOBAL_ROOT/renative.json"
mkdir -p "$PROV_PROFILES"
chmod 777 "$PROV_PROFILES"
security create-keychain -p travis ios-build.keychain
security default-keychain -s ios-build.keychain
security unlock-keychain -p travis ios-build.keychain
security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

if [ -d "../lib/node_modules/npx" ]
then
    echo "npx already installed. skipping"
else
    npm install -g npx
fi

yarn bootstrap
cd packages/app

# RUN

npx rnv template apply --template renative-template-hello-world --ci --mono
npx rnv configure -c helloWorld -p web --ci --mono
# npx rnv build -p web -c helloWorld --ci --mono
