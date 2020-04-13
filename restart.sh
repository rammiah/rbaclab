echo "Stopping all containers"
docker stop $(docker ps -aq)
echo "Starting containers"
docker-compose -f docker-compose-cli.yaml -f docker-compose-couch.yaml  -f docker-compose-etcdraft2.yaml up -d

