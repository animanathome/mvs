mkdir /data
mkdir /data/db
mkdir /root/code
cd /root/code
git clone https://github.com/animanathome/mvs.git

cd /root
apt-get install -y npm nodejs
apt install docker-compose
ln -s /usr/bin/nodejs /usr/bin/node

export PROJ_DIR='/root/code/'
export PIA_USR=$1
export PIA_PAS=$2

# build our client react project
# cd $PROJ_DIR'mvs/client'
# npm install
# npm run build 

# update search
# cd $PROJ_DIR'mvs/server'
# npm install

# update player
# cd $PROJ_DIR'mvs/player'
# npm i process-nextick-args util-deprecate
# npm install

# update search
# cd $PROJ_DIR'mvs/search'
# npm i process-nextick-args util-deprecate
# npm install

# update search
# cd $PROJ_DIR'mvs/trigger'
# npm install

# run project
cd $PROJ_DIR'mvs/'
docker-compose up --build