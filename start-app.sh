#! /bin/bash

docker-compose up -d

sleep 5

docker exec mongo-primary /scripts/rs-init.sh
