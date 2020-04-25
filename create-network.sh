#!/usr/bin/env bash

echo "-----starting orderers and peers-----"
docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml \
 -f docker-compose-etcdraft2.yaml -f docker-compose-ca.yaml up -d
# docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up -d
echo "sleep for 5 seconds to wait for raft cluster"
sleep 5
docker exec cli scripts/scripts.sh
