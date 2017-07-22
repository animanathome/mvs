#!/bin/sh

echo 'running MVS in development mode'
echo 'private internet access creditentials - username:' $1 'password:' $2

export PROJ_DIR='/Users/manu/Code/'
export PIA_USR=$1
export PIA_PAS=$2

# build our client react project
cd $PROJ_DIR'mvs/client'
npm install
npm run build 

# update search
cd $PROJ_DIR'mvs/server'
npm install

# update player
cd $PROJ_DIR'mvs/player'
npm install

# update search
cd $PROJ_DIR'mvs/search'
npm install

# update search
cd $PROJ_DIR'mvs/trigger'
npm install

# run project
cd $PROJ_DIR'mvs/'
docker-compose up