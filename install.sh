#!/bin/bash
#fail on any error
set -e

github=https://github.com/Tungsten78
modules=../../modules

echo "Checking for modules..."
if [ ! -d "$modules" ] 
then
    echo "Expecting modules at $PWD/$modules, ensure layout is installed at \$ATTRACT_HOME/layouts/[layout]/"
    exit 0
fi

[ -d "$modules/gtc" ] && hasGtc=true && echo "Found existing gtc module"
[ -d "$modules/gtc-kb" ] && hasGtcKb=true && echo "Found existing gtc-kb module"
[ -d "$modules/gtc-pas" ] && hasGtcPas=true && echo "Found existing gtc-pas module"

if [ "$hasGtc" = true ] && [ "$hasGtcKb" = true ] && [ "$hasGtcPas" = true ] 
then
    echo "All modules already present, exiting.."
    exit 0;
fi

mkdir -p scratch
cd scratch

if [ ! "$hasGtc" ]
then
    echo "gtc module - download and unzip"
    rm -rf gtc-master
    curl -LO $github/gtc/archive/refs/heads/master.zip
    unzip master.zip
    mv gtc-master gtc
    mv gtc ../$modules
fi

if [ ! "$hasGtcKb" ]
then
    echo "gtc-kb module - download and unzip"
    rm -rf gtc-kb-master
    curl -LO $github/gtc-kb/archive/refs/heads/master.zip
    unzip master.zip
    mv gtc-kb-master gtc-kb
    mv gtc-kb ../$modules
fi

if [ ! "$hasGtcPas" ]
then
    echo "gtc-pas module - download and unzip"
    rm -rf gtc-pas-master
    curl -LO $github/gtc-pas/archive/refs/heads/master.zip
    unzip master.zip
    mv gtc-pas-master gtc-pas
    mv gtc-pas ../$modules
fi

echo "cleaning up..."
cd ..
rm -rf scratch

echo "done"