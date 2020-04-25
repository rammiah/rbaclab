#!/usr/bin/env bash

echo "Stopping all docker containers"
IDS=$(docker ps -aq)
if [ "$IDS" != "" ]; then
  docker container stop $IDS
fi
