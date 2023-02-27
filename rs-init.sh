#!/bin/bash

echo "Running Script...."
mongosh <<EOF
rs.initiate()
var conf = rs.conf()
conf.members[0].host = "mongo-primary:27017"
rs.reconfig(conf)
rs.add("mongo-secondary:27017")
rs.add("mongo-arbiter:27017")
rs.status()
exit
EOF
