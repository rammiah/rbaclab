# RBAC environments setup

## First: install required tools

OS: linux kernel based system or wsl(2) is OK.

tools: docker 19.02 or higher, docker-compose 1.25.0 or higher, go 1.13 or higher, node 10 or 12

## Setup images

Change to project directory, run:

```shell
./bootstrap.sh
```

to download images

## Generate certificates and init blocks

run

```shell
./generate.sh
```

will generate all user CA, connection profiles, create genesis block, channel block, update anchor block.

## Run network

run

```shell
./start-network.sh
```

will start network named rbaclab_rbac, create channel, install chancode and commit to channel

## Clean network

run 

```shell
./clean-network.sh
```

will clean all the containers and volumes, ***be careful!!!***





