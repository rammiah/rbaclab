#!/bin/bash

echo "-----starting orderers and peers-----"
docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml  -f docker-compose-etcdraft2.yaml up -d
# docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up
