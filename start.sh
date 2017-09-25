echo "Starting mongod..............."
#mongodb/mongodb-linux-x86_64-3.0.4/bin/mongod --config mongod.conf
mongod --config mongod.conf &
echo "mongodb now running at localhost:27017"
echo "you can change any value you want at mongod.config"
echo "Press Crtl+C to prevent server from loading"
#sleep 4
node server.js
#sleep 4
#clear
