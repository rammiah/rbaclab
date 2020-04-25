#!/usr/bin/env bash
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/peer/crypto/peerOrganizations/org1.rammiah.org/users/Admin@org1.rammiah.org/msp
CORE_PEER_ADDRESS=peer0.org1.rammiah.org:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/peer/crypto/peerOrganizations/org1.rammiah.org/peers/peer0.org1.rammiah.org/tls/ca.crt
PEER0_ORG1_CA=/opt/gopath/src/peer/crypto/peerOrganizations/org1.rammiah.org/peers/peer0.org1.rammiah.org/tls/ca.crt
PEER1_ORG1_CA=/opt/gopath/src/peer/crypto/peerOrganizations/org1.rammiah.org/peers/peer1.org1.rammiah.org/tls/ca.crt
PEER2_ORG1_CA=/opt/gopath/src/peer/crypto/peerOrganizations/org1.rammiah.org/peers/peer2.org1.rammiah.org/tls/ca.crt
PEER3_ORG1_CA=/opt/gopath/src/peer/crypto/peerOrganizations/org1.rammiah.org/peers/peer3.org1.rammiah.org/tls/ca.crt
PEER4_ORG1_CA=/opt/gopath/src/peer/crypto/peerOrganizations/org1.rammiah.org/peers/peer4.org1.rammiah.org/tls/ca.crt
ORDERER_CA=/opt/gopath/src/peer/crypto/ordererOrganizations/rammiah.org/orderers/orderer0.rammiah.org/msp/tlscacerts/tlsca.rammiah.org-cert.pem
# peer channel create -o orderer0.rammiah.org:7050 -c rbacchannel -f ./channel-artifacts/channel.tx --tls --cafile $ORDERER_CA
# update anchor
# peer channel update -o orderer0.rammiah.org:7050 -c rbacchannel -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile $ORDERER_CA

LANGUAGE=golang
SRC_PATH="/opt/gopath/src/rbac-contract/"
CHANNEL_NAME=rbacchannel
echo "Channel name : "$CHANNEL_NAME
DELAY=1
LABEL=rbac_1
PACKAGE_NAME="rbac.tar.gz"
VERSION=1

setGlobal () {
    PEER=$1
    if [ $PEER -eq 0 ]; then
      CORE_PEER_ADDRESS=peer0.org1.rammiah.org:7051
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
    elif [ $PEER -eq 1 ]; then
      CORE_PEER_ADDRESS=peer1.org1.rammiah.org:8051
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_ORG1_CA
    elif [ $PEER -eq 2 ]; then
      CORE_PEER_ADDRESS=peer2.org1.rammiah.org:9051
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER2_ORG1_CA
    elif [ $PEER -eq 3 ]; then
      CORE_PEER_ADDRESS=peer3.org1.rammiah.org:10051
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER3_ORG1_CA
    elif [ $PEER -eq 4 ]; then
      CORE_PEER_ADDRESS=peer4.org1.rammiah.org:11051
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER4_ORG1_CA
    fi
}

createChannel () {
	peer channel create -o orderer0.rammiah.org:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile $ORDERER_CA
	echo "===================== Channel '$CHANNEL_NAME' created ===================== "
}

joinChannel () {
    for peer in 0 1 2 3 4; do
      setGlobal $peer
      peer channel join -b $CHANNEL_NAME.block
      echo "===================== peer${peer}.org1 joined channel '$CHANNEL_NAME' ===================== "
      sleep $DELAY
      echo
    done
}

updateAnchorPeers () {
    peer channel update -o orderer0.rammiah.org:7050 -c rbacchannel -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile $ORDERER_CA
}

packageChaincode () {
    cd $SRC_PATH
    go mod vendor
    cd -
    echo "mod vendor finished"
    peer lifecycle chaincode package $PACKAGE_NAME --path $SRC_PATH --lang $LANGUAGE --label $LABEL
    if [ ! -f $PACKAGE_NAME ]; then
        echo "package chaincode failed"
        exit -1
    fi
    echo "package chaincode successful"
}

installChaincode () {
    for i in 0 1 2 3 4; do
      setGlobal $i
      peer lifecycle chaincode install $PACKAGE_NAME
      echo "install chaincode on peer$i successful"
      sleep $DELAY
    done
}

queryInstalled () {
    for i in 0 1 2 3 4; do
      setGlobal $i
      peer lifecycle chaincode queryinstalled
    done
    PACKAGE_ID=$(peer lifecycle chaincode queryinstalled -O json | jq '.installed_chaincodes | .[0] | .package_id' -r)
}

approveForMyOrg() {
    # peer lifecycle chaincode approveformyorg --channelID $CHANNEL_NAME --name rbac --version ${VERSION} --package-id ${PACKAGE_ID} --sequence ${VERSION} --waitForEvent
    peer lifecycle chaincode approveformyorg $PEER_CONN_PARMS -o orderer0.rammiah.org:7050 --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name rbac --version ${VERSION} --package-id ${PACKAGE_ID} --sequence ${VERSION} --waitForEvent
}

commitChaincode() {
    peer lifecycle chaincode commit $PEER_CONN_PARMS -o orderer0.rammiah.org:7050 --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name rbac --version ${VERSION} --sequence ${VERSION}
}

parseConnArgs() {
    PEER_CONN_PARMS=""
    # PEERS=""
    for i in 0 1 2 3 4; do
        setGlobal $i
        # PEER="peer$i.org1"
        PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
        TLSINFO="--tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE"
        PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    done
}

## Create channel
echo "Creating channel..."
createChannel

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

echo "Updating organization anchor..."
updateAnchorPeers

echo "Packaging chaincode..."
packageChaincode

echo "Installing chaincode..."
installChaincode
queryInstalled

parseConnArgs
approveForMyOrg
commitChaincode
