if [ `whoami` = 'root' ]
  then
    echo "You don't want to rub this script with root! Seriously DONT!."
    exit
fi
npm install
echo "Installing mongodb............"
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.0.4.tgz
tar -zxvf mongodb-linux-x86_64-3.0.4.tgz
mkdir -p mongodb
mv mongodb-linux-x86_64-3.0.4 mongodb
echo "Removing junk................."
rm mongodb-linux-x86_64-3.0.4.tgz
echo "Starting mongod..............."
chmod a+x start.sh
ln -s mongod.conf mongodb/mongodb-linux-x86_64-3.0.4/bin/mongod.conf
./mongod --config mongod.conf
echo "mongodb now running at localhost:27017"
echo "you can change any value you want at mongod.config"
echo "Press Crtl+C to prevent server from loading"
sleep 4
echo "NOTE: Now server can be started by typing ./start.sh"
node server.js