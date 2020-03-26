#!/bin/bash

IDS=$(docker ps -aq)
if [ "$IDS" != "" ]; then
  docker container stop $IDS
  docker container prune -f
fi

docker volume prune -f
docker network prune -f
