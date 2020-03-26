#!/bin/bash

# 清理文件
echo "-----clean files-----"
if [ -d "crypto-config" ]; then
  rm -rf crypto-config
fi

if [ -d "channel-artifacts" ]; then
  rm -rf channel-artifacts
fi

# 开始生成文件
export PATH="$PWD/bin:$PATH"
echo "-----genarating certificates-----"
which cryptogen
if [ "$?" -ne 0 ]; then
  echo "cryptogen tool not found. exiting"
  exit 1
fi

cryptogen generate --config crypto-config.yaml
res=$?

if [ $res -ne 0 ]; then
  echo "failed to generate certificates"
  exit 1
fi
./ccp-generate.sh

echo "-----generate certificates finished-----"

echo "-----generate config block and transaction-----"

which configtxgen
if [ "$?" -ne 0 ]; then
    echo "configtxgen tool not found. exiting"
    exit 1
fi

CHANNEL_NAME="rbacchannel"

configtxgen -profile RBACMultiNodeEtcdRaft -channelID rbac-sys-channel -outputBlock ./channel-artifacts/genesis.block
if [ "$?" -ne 0 ]; then
    echo "generate genesis block failed. exiting"
    exit 1
fi
configtxgen -profile RBACOrgsChannel -channelID $CHANNEL_NAME -outputCreateChannelTx ./channel-artifacts/channel.tx
if [ "$?" -ne 0 ]; then
    echo "generate create channel transaction failed. exiting"
    exit 1
fi
configtxgen -profile RBACOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
    echo "generate anchor peers update transaction failed. exiting"
    exit 1
fi

echo "-----generate config block and transaction finished-----"