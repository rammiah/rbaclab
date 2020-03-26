#!/bin/bash

./clean-network.sh
./generate.sh

echo "-----starting orderers and peers-----"
docker-compose -f docker-compose-cli.yaml -f docker-compose-etcdraft2.yaml up -d

