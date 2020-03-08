#!/bin/bash
OUTPUT=$(npm run publish:alpha | tail -1)
VERSION="$(cut -d'@' -f2 <<< $OUTPUT)"
if [ $VERSION != "" ]
then
    echo "publishing $VERSION"
    git add -A
    git commit -nm "release $VERSION"
    git tag -a $VERSION -m "release $VERSION"
    ggp && git push origin $VERSION
else
    echo "Can't get version"
    exit 100
fi