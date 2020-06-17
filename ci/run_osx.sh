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

# RESET
# rm -rf ./node_modules

mkdir -p $GLOBAL_PATH
mkdir -p "$PROV_PROFILES"
chmod 777 "$PROV_PROFILES"
security create-keychain -p travis ios-build.keychain
security default-keychain -s ios-build.keychain
security unlock-keychain -p travis ios-build.keychain
security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

brew tap wix/brew > /dev/null 2>&1
brew install applesimutils > /dev/null 2>&1

yarn bootstrap
cd packages/app

# RUN

npx rnv template apply --template renative-template-hello-world --ci --mono
yarn e2e-ios
