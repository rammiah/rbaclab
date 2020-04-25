#!/usr/bin/env bash

echo "Starting containers"
docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml \
  -f docker-compose-etcdraft2.yaml -f docker-compose-ca.yaml up -d
