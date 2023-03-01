#!/bin/bash

echo "Exporting env variables"
export "$(cat /app/.env | xargs)"

echo "Adding members to mongodb cluster...."
mongosh -u  "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD"<<EOF
rs.initiate()
var conf = rs.conf()
conf.members[0].host = "mongo-primary:27017"
rs.reconfig(conf)
rs.add("mongo-secondary:27017")
rs.add("mongo-arbiter:27017")
rs.status()
exit
EOF
