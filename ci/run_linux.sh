#!/usr/bin/env bash

# RUN CHECK
echo "CURRENT ENV:: TRAVIS_BRANCH: $TRAVIS_BRANCH, TRAVIS_PULL_REQUEST: $TRAVIS_PULL_REQUEST, TRAVIS_TAG: $TRAVIS_TAG , TRAVIS_OS_NAME: $TRAVIS_OS_NAME"

# DEFINITIONS

# SETUP
set -e
set -o xtrace
set -o verbose
set -o pipefail

GLOBAL_ROOT="/home/travis/.$ACCOUNT_NAME"
PROJECT_PATH="/home/travis/build/$REPO_NAME"
GLOBAL_PATH="$GLOBAL_ROOT/$PROJECT_NAME"

echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
echo "no" | android create avd -n android_test -t android-28 --abi x86
emulator -avd android_test -no-audio -no-window

# RESET
# rm -rf ./node_modules

mkdir -p $GLOBAL_PATH

yarn bootstrap
cd packages/app

# RUN

npx rnv template apply --template renative-template-hello-world --ci --mono
yarn e2e-android
